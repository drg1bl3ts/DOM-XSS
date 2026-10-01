// Tiny DOM XSS fuzzer. It opens each payload in a real (headless) Chromium
// and reports which ones make the page show an alert/confirm/prompt box,
// or call print().
//
// Why check print() too? Chrome 92+ (July 2021) blocks alert/confirm/prompt
// from cross-origin iframes, a response to malicious ads abusing alert() to
// trap visitors. print() isn't blocked the same way, so PortSwigger's cheat
// sheet (the source of ../payloads/) now uses print() as its general PoC
// function in several entries, not just inside iframes. See PortSwigger's
// own writeup: https://portswigger.net/research/alert-is-dead-long-live-print
// Without checking for it, those payloads would silently look like misses
// here even when they work.
//
// Why not ffuf? The server sends the same static page for every payload, and the
// bug happens later in the browser. Only a browser can see it.
//
// Usage:
//   node fuzz.mjs "<url with FUZZ in it>" [wordlist] [wait-ms]
//
// Examples:
//   node fuzz.mjs "http://localhost:8000/labs/01-search-innerhtml.html?name=FUZZ"
//   node fuzz.mjs "http://localhost:8000/labs/03-hash-eval.html#FUZZ" ../payloads/xss-payloads.txt
//   node fuzz.mjs "http://localhost:8000/labs/10-search-settimeout.html?msg=FUZZ" ../payloads/xss-payloads.txt 2000
//
// Limits:
//   - Payloads that need a click (labs 04 and 09) are not clicked, so they will not show as hits.
//   - It only detects alert/confirm/prompt dialogs and print() calls. A payload
//     that proves itself some other way (changing the page title, making a
//     network request, etc.) is still a miss here.

import { spawn } from "node:child_process";
import { readFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createServer } from "node:net";

// Ask the OS for a free port, rather than a fixed one. Two fuzz.mjs runs at
// once (two terminals, or a leftover process from a previous run) used to
// collide on the same hardcoded port and silently cross-contaminate each
// other's dialog events — found by watching exactly that happen.
function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

// ---- 1. Read the arguments ----
const [urlTemplate, wordlistPath = "../payloads/xss-payloads.txt", waitArg = "1000"] = process.argv.slice(2);
const waitMs = Number(waitArg);

if (!urlTemplate || !urlTemplate.includes("FUZZ")) {
  console.error('Give a URL that contains the word FUZZ, for example "http://localhost:8000/labs/01-search-innerhtml.html?name=FUZZ"');
  process.exit(1);
}

const payloads = readFileSync(wordlistPath, "utf8").split("\n").filter(line => line.length > 0);
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// ---- 2. Start Chromium with its remote-control port open ----
const port = await getFreePort();
const profileDir = mkdtempSync(join(tmpdir(), "fuzz-"));
const chromium = spawn("chromium", [
  "--headless=new", "--no-sandbox", "--disable-gpu",
  `--remote-debugging-port=${port}`, `--user-data-dir=${profileDir}`, "about:blank",
], { stdio: "ignore" });

await sleep(2500); // give the browser time to start

// ---- 3. Connect to the first tab ----
const tabs = await (await fetch(`http://localhost:${port}/json`)).json();
const tab = tabs.find(t => t.type === "page");
const socket = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise(resolve => (socket.onopen = resolve));

// Send a command to the browser
let nextId = 0;
function send(method, params = {}) {
  socket.send(JSON.stringify({ id: ++nextId, method, params }));
}

// ---- 4. Watch for alert/confirm/prompt, and set up a print() trap ----
// alert/confirm/prompt show up as a real browser event we can listen for.
// print() doesn't (headless Chrome has no print UI to show), so instead we
// overwrite window.print before the page's own scripts run, and just check
// afterwards whether anything called it.
let dialogType = null;
socket.onmessage = message => {
  const data = JSON.parse(message.data);
  if (data.method === "Page.javascriptDialogOpening") {
    dialogType = data.params.type; // "alert", "confirm", or "prompt"
    send("Page.handleJavaScriptDialog", { accept: true }); // close it so the page keeps going
  }
};
send("Page.enable");
send("Runtime.enable");
send("Page.addScriptToEvaluateOnNewDocument", {
  source: "window.__fuzzerPrintCalled = false; window.print = () => { window.__fuzzerPrintCalled = true; };",
});
await sleep(200); // let the setup command above land before the first navigation

// ---- 5. Try every payload ----
const hits = [];
console.log(`Trying ${payloads.length} payloads against ${urlTemplate}\n`);

for (const payload of payloads) {
  dialogType = null;
  const url = urlTemplate.replace("FUZZ", encodeURIComponent(payload));
  send("Page.navigate", { url });
  await sleep(waitMs);

  // Read back whether print() was called on this page load, then reset it.
  nextId++;
  const printCheckId = nextId;
  socket.send(JSON.stringify({
    id: printCheckId,
    method: "Runtime.evaluate",
    params: { expression: "window.__fuzzerPrintCalled && (window.__fuzzerPrintCalled = false, true)" },
  }));
  const printResult = await new Promise(resolve => {
    const original = socket.onmessage;
    socket.onmessage = message => {
      const data = JSON.parse(message.data);
      if (data.id === printCheckId) {
        socket.onmessage = original;
        resolve(Boolean(data.result?.result?.value));
      } else {
        original(message);
      }
    };
  });

  const signal = dialogType ?? (printResult ? "print()" : null);
  if (signal) {
    hits.push({ payload, signal });
    console.log(`HIT [${signal}]`, payload);
  }
}

// ---- 6. Print the summary and clean up ----
console.log(`\n${hits.length} of ${payloads.length} payloads fired a dialog or called print().`);
chromium.kill();
rmSync(profileDir, { recursive: true, force: true });
process.exit(0);
