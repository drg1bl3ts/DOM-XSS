import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-lab18-innerhtml-sanitized',
  templateUrl: './lab18-innerhtml-sanitized.html',
})
export class Lab18InnerhtmlSanitized {
  // SOURCE: the query string of the URL
  // This value goes straight into [innerHTML] in the template below.
  // Angular sanitizes every [innerHTML] binding by default, so this is safe.
  protected readonly bio = signal(new URLSearchParams(location.search).get('bio') ?? '');
}
