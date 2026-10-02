# DOM XSS Practice Hub

>**NOTE**: I used Claude to help me build / explain everything. If you would like to add please do not be afraid to make a pull request. This was a project I wanted to build to help me practice and understand DOM XSS better.

A set of intentionally vulnerable pages for practising DOM XSS, one lab per
source-and-sink pair. Plain HTML and JavaScript for most of it, no build step,
no dependencies. Modern Angular is the one exception (see below), because it
needs a build step by nature.

**Run it locally only. Do not deploy it.**

## Run

```bash
cd ~/Projects/DOM-XSS
python3 -m http.server 8000 --bind 127.0.0.1
```

`--bind 127.0.0.1` matters here: without it, `http.server` listens on all
network interfaces, so anyone else on your WiFi/LAN could reach these
intentionally-vulnerable pages while the server is running.

Open <http://localhost:8000>. That covers every lab except modern Angular.

For the modern Angular labs (18-21), also run, in a second terminal:

```bash
cd ~/Projects/DOM-XSS/angular
npm install   # only needed once
npx ng serve
```

The port is pinned to 4200 in `angular.json`, and the hub's links hardcode that
port, so open it as plain `http://localhost:4200`, not a forwarded/preview link
from your editor (see `angular/README.md` if you're on VS Code and this bites you).
`ng serve` binds to localhost only by default, so it doesn't need the same
`--bind` treatment as the Python server above.

## Layout

```
index.html        hub with the list of labs
sources.html      notes on every source
sinks.html        notes on every sink
style.css         shared styling
lib/              local copies of every library used below: jQuery (4.0.0 and
                   the vulnerable 1.6.1), AngularJS 1.8.3 + angular-sanitize,
                   React 18, Vue 3, Handlebars, Lodash, Knockout, Alpine.js
labs/             one source + one sink per lab
  NN-name.html    the widget, plus notes, payload and fix
  NN-name.js      the vulnerable code (SOURCE and SINK are commented)
  jquery/         the jQuery labs (11-14), same file pattern
  angularjs/      the AngularJS 1.x labs (15-17), same file pattern
  react/          lab 22, same file pattern
  vue/            lab 23, same file pattern
  handlebars/     lab 24, same file pattern
  lodash/         lab 25, same file pattern
  knockout/       lab 26, same file pattern
  alpine/         lab 27, same file pattern
angular/          the modern Angular labs (18-21), a separate CLI project
```

Labs 28, 31-33 (mitigations), 29-30 (more sources), and 34 (mXSS) live
directly in `labs/`, same file pattern as 01-10. Lab 35 lives in `labs/jquery/`
alongside 11-14, since it's jQuery-specific.

## Adding a lab

1. Copy an existing pair in `labs/` (or one of its framework subfolders) and
   rename it `NN-source-sink`. For modern Angular, see `angular/README.md`.
2. Mark the `SOURCE` and `SINK` lines in the `.js` (or `.ts`) file with comments.
3. Fill in the notes in the `.html` file: what happens, why it is a sink, payload, fix.
4. Add a row to the table in `index.html`, and link it from `sources.html` and `sinks.html`.

## Sources and sinks reference

`sources.html` and `sinks.html` are cross-checked against actively-maintained
references — [PortSwigger](https://portswigger.net/web-security/cross-site-scripting/dom-based),
[MDN](https://developer.mozilla.org/), and [jQuery's own API docs](https://api.jquery.com/) —
rather than written from memory, and note where no lab exists yet for
something worth knowing about (`history.pushState`, WebSocket messages,
IndexedDB, and more). The "sources and sinks" framing itself traces back to
Stefano Di Paola & Giorgio Maone's DOMXSS wiki (circa 2011-2013); it's credited
in both pages for originating the idea, but since it's no longer maintained,
it isn't used as a citation for any claim that could have gone stale — those
were re-checked against the current references above or verified directly in
a real browser (see `sinks.html`'s note on `document.domain`'s deprecation,
found this way).

## Keeping `lib/` current

The libraries in `lib/` get checked against their latest releases periodically,
not just pinned once and forgotten. The last pass (comparing every version here
against each project's npm registry listing) found three real, patched
vulnerabilities this hub had been shipping — now fixed:

- **DOMPurify 3.2.3** → 3.4.16, affected by an mXSS advisory ([GHSA-h8r8-wccr-v5f2](https://github.com/advisories/GHSA-h8r8-wccr-v5f2))
- **Handlebars 4.7.8** → 4.7.9, affected by a critical (9.8) RCE ([CVE-2026-33937](https://www.sentinelone.com/vulnerability-database/cve-2026-33937/)) plus two more CVEs
- **jQuery 3.7.1** → 4.0.0, Lodash 4.17.21 → 4.18.1, the latter affected by a `_.template` code-injection bug ([CVE-2026-4800](https://github.com/lodash/lodash/wiki/Changelog))

None of the three affected code paths this hub's own labs actually exercise,
but a security-education repo has no business shipping known-vulnerable
dependencies regardless. The jQuery bump also turned up something worth a
lab of its own: jQuery 3.x can't even load on a page enforcing Trusted Types,
fixed in 4.0 — see lab 35.

## References

Documents and pages actually cited while building this hub, beyond what's
already linked inline in `sources.html` / `sinks.html` / the labs themselves.

**Official docs and APIs**
- [PortSwigger — DOM-based XSS](https://portswigger.net/web-security/cross-site-scripting/dom-based) and its [XSS cheat sheet](https://portswigger.net/web-security/cross-site-scripting/cheat-sheet) (source of lab 34)
- [MDN — `document.domain`](https://developer.mozilla.org/en-US/docs/Web/API/Document/domain), [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API), [Trusted Types API](https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API)
- [jQuery API docs](https://api.jquery.com/), the [jQuery 1.9 upgrade guide](https://jquery.com/upgrade-guide/1.9/), and the [jQuery 4.0 upgrade guide](https://jquery.com/upgrade-guide/4.0/) (Trusted Types support, behind lab 35)
- [React — `dangerouslySetInnerHTML`](https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html)
- [Vue — built-in directives (`v-html`)](https://vuejs.org/api/built-in-directives.html)
- [Knockout — the `html` binding](https://knockoutjs.com/documentation/html-binding.html)
- [Alpine.js — the `x-html` directive](https://alpinejs.dev/directives/html)
- [Handlebars.js](https://handlebarsjs.com/) (compatibility with Mustache)
- [Lodash docs](https://lodash.com/docs) — the `_.template` delimiter behaviour was also verified directly against the library in this repo, not taken on the docs alone
- [AngularJS docs](https://docs.angularjs.org/) (end-of-life as of January 2022, used here only for the historical 1.x labs)

**Security research and CVEs**
- [PortSwigger Research — DOM-based AngularJS sandbox escapes](https://portswigger.net/research/dom-based-angularjs-sandbox-escapes)
- [CVE-2012-6708](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2012-6708) — the jQuery `$(selector)` HTML-string confusion behind lab 13
- [CVE-2020-6802](https://bugzilla.mozilla.org/show_bug.cgi?id=1615315) (Mozilla Bleach) and [CVE-2021-23974](https://bugzilla.mozilla.org/show_bug.cgi?id=1528997) (browser `DOMParser` APIs) — real mXSS CVEs over `<noscript>` handling, the mechanism behind lab 34
- [GHSA-h8r8-wccr-v5f2](https://github.com/advisories/GHSA-h8r8-wccr-v5f2) — the DOMPurify mXSS advisory that affected the exact version (3.2.3) this hub originally shipped in `lib/`, since upgraded
- [CVE-2026-33937](https://www.sentinelone.com/vulnerability-database/cve-2026-33937/) — critical (9.8) RCE affecting Handlebars 4.0.0-4.7.8, the version this hub originally shipped, since upgraded to 4.7.9
- [CVE-2026-4800](https://github.com/lodash/lodash/wiki/Changelog) — `_.template` code injection via the `imports` option, affecting the Lodash version this hub originally shipped, since upgraded to 4.18.1
- [Homarr GHSA-79pg-554g-rw82](https://github.com/homarr-labs/homarr/security/advisories/GHSA-79pg-554g-rw82) — a real `callbackUrl` redirect-param DOM XSS, cited on the hub's front page
- [Detectify — postMessage XSS on a million sites](https://labs.detectify.com/writeups/postmessage-xss-on-a-million-sites/) — cited alongside it

**Historical credit, not cited as current fact**
- Stefano Di Paola & Giorgio Maone's [DOMXSS wiki](https://github.com/wisec/domxsswiki/wiki) (circa 2011-2013) originated the "sources and sinks" framing this whole hub is built around, and its [jQuery sinks page](https://github.com/wisec/domxsswiki/wiki/jQuery-sinks) specifically. No longer maintained — every claim drawn from it was re-verified against something current (above) or tested directly in a browser before being written down here.

## License

[MIT](LICENSE)
