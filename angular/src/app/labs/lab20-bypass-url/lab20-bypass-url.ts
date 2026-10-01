import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-lab20-bypass-url',
  templateUrl: './lab20-bypass-url.html',
})
export class Lab20BypassUrl {
  protected readonly returnUrl: SafeUrl;

  constructor(sanitizer: DomSanitizer) {
    // SOURCE: the query string of the URL
    const raw = new URLSearchParams(location.search).get('returnUrl') ?? '#';

    // SINK: bypassSecurityTrustUrl turns off the check that normally blocks
    // javascript: URLs from being used in [href].
    this.returnUrl = sanitizer.bypassSecurityTrustUrl(raw);
  }
}
