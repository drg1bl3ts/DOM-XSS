// Tiny DOM XSS fuzzer. It opens each payload in a real (headless) Chromium
// and reports which ones make the page show an alert/confirm/prompt box.
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
//   - It only detects dialogs (alert, confirm, prompt). A payload that does something else is a miss.

import { spawn } from "node:child_process";
import { readFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

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
const port = 9400;
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

// ---- 4. Count dialogs ----
let dialogCount = 0;
socket.onmessage = message => {
  const data = JSON.parse(message.data);
  if (data.method === "Page.javascriptDialogOpening") {
    dialogCount++;
    send("Page.handleJavaScriptDialog", { accept: true }); // close it so the page keeps going
  }
};
send("Page.enable");

// ---- 5. Try every payload ----
const hits = [];
console.log(`Trying ${payloads.length} payloads against ${urlTemplate}\n`);

for (const payload of payloads) {
  dialogCount = 0;
  const url = urlTemplate.replace("FUZZ", encodeURIComponent(payload));
  send("Page.navigate", { url });
  await sleep(waitMs);

  if (dialogCount > 0) {
    hits.push(payload);
    console.log("HIT  ", payload);
  }
}

// ---- 6. Print the summary and clean up ----
console.log(`\n${hits.length} of ${payloads.length} payloads fired a dialog.`);
chromium.kill();
rmSync(profileDir, { recursive: true, force: true });
process.exit(0);
