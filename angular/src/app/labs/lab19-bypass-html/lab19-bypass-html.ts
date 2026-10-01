import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-lab19-bypass-html',
  templateUrl: './lab19-bypass-html.html',
})
export class Lab19BypassHtml {
  protected readonly bio: SafeHtml;

  constructor(sanitizer: DomSanitizer) {
    // SOURCE: the query string of the URL
    const raw = new URLSearchParams(location.search).get('bio') ?? '';

    // SINK: bypassSecurityTrustHtml turns off Angular's sanitizer for this value.
    // [innerHTML] then inserts it as-is. Nobody checked "raw" first.
    this.bio = sanitizer.bypassSecurityTrustHtml(raw);
  }
}
