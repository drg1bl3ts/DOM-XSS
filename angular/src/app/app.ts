import { Component, signal } from '@angular/core';
import { Lab18InnerhtmlSanitized } from './labs/lab18-innerhtml-sanitized/lab18-innerhtml-sanitized';
import { Lab19BypassHtml } from './labs/lab19-bypass-html/lab19-bypass-html';
import { Lab20BypassUrl } from './labs/lab20-bypass-url/lab20-bypass-url';
import { Lab21NativeelementInnerhtml } from './labs/lab21-nativeelement-innerhtml/lab21-nativeelement-innerhtml';

// There is no router here on purpose, to keep this project small.
// Which lab to show is decided once, from ?lab=18 in the URL, the same
// way the plain HTML/jQuery/AngularJS labs read their own query params.
@Component({
  selector: 'app-root',
  imports: [Lab18InnerhtmlSanitized, Lab19BypassHtml, Lab20BypassUrl, Lab21NativeelementInnerhtml],
  templateUrl: './app.html',
})
export class App {
  protected readonly activeLab = signal(new URLSearchParams(location.search).get('lab') ?? '');

  // The hub can run on any port (whatever's free for "python3 -m http.server").
  // Rather than hardcode a guess, use document.referrer: the browser fills this
  // in with the exact page you clicked from, port and all. It's only empty if
  // this page was opened directly (typed URL, bookmark), so fall back to the
  // hub's usual port for that case.
  protected readonly hubHref = document.referrer || 'http://localhost:8000/index.html';
}
