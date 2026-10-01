import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-lab21-nativeelement-innerhtml',
  templateUrl: './lab21-nativeelement-innerhtml.html',
})
export class Lab21NativeelementInnerhtml implements AfterViewInit {
  @ViewChild('box') private box!: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    // SOURCE: the query string of the URL
    const bio = new URLSearchParams(location.search).get('bio') ?? '';

    // SINK: plain DOM innerHTML, reached through ElementRef.nativeElement.
    // Angular's sanitizer only runs on template bindings like [innerHTML] in the
    // other labs. It never sees this call, so nothing is stripped.
    this.box.nativeElement.innerHTML = bio;
  }
}
