# DOM XSS Practice Hub — Modern Angular labs

A small Angular CLI app (standalone components, no router) with the modern-Angular
sink labs. It's separate from the rest of the hub because it needs a build step;
everything else there is plain static files.

## Run

```bash
cd angular
npm install   # only needed once
npx ng serve
```

Open <http://localhost:4200> directly — the port is pinned to 4200 in `angular.json`,
so `ng serve` either uses it or fails with a clear "port already in use" error;
it never silently picks a different port. The hub's own pages hardcode links to
that port, so keeping it fixed is what makes those links work.

If you're in an editor that auto-forwards local ports (VS Code does this), use
the plain `http://localhost:4200` URL, not a forwarded/preview link on some
other port — the "Back to hub" link on these pages uses `document.referrer` to
find its way back, and that only works if you got here through an actual link
click on `http://localhost:4200`, not a separately forwarded address.

If port 4200 really is taken by something else, free it (or change the port in
`angular.json`'s `serve.options` and in the hub's `index.html`/`sources.html`/
`sinks.html` links to match).

## Layout

There is no router. `app.ts` reads `?lab=NN` from the URL once at load and shows
the matching component — the same "read the URL on load" style as every other
lab in this hub, just done in Angular.

```
src/app/
  app.ts / app.html          picks a lab from ?lab=NN, or shows the list
  labs/
    lab18-innerhtml-sanitized/   [innerHTML], sanitized by default (safe)
    lab19-bypass-html/           DomSanitizer.bypassSecurityTrustHtml
    lab20-bypass-url/            DomSanitizer.bypassSecurityTrustUrl
    lab21-nativeelement-innerhtml/  raw DOM access around Angular's sanitizer
```

Each lab component reads its own field (`bio`, `returnUrl`) from `location.search`,
the same source used throughout the hub, and each `.html` file has the same
notes / payload / fix layout as the other labs.

## Adding a lab

1. Copy an existing folder under `src/app/labs/`, rename it, and update the
   selector, class name and `templateUrl` in the `.ts` file.
2. Add it to the `imports` array and the `@switch` block in `app.ts` / `app.html`.
3. Add a row to the tables in the root `index.html` and `sinks.html`.
