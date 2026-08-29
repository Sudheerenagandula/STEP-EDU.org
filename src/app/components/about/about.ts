import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChildren, QueryList, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About implements AfterViewInit, OnDestroy {

  // ---------- SCROLL REVEAL (repeating) ----------
  // Previously: entry.target.classList.add('is-visible') then
  // this.observer.unobserve(entry.target) — so each element only
  // ever revealed once and then was left alone forever.
  //
  // Now: we never unobserve. On every intersection change we toggle
  // 'is-visible' based on entry.isIntersecting, so elements fade/slide
  // in every time they enter the viewport (scrolling down into them,
  // or scrolling back up into them) and fade/slide out every time they
  // leave the viewport in either direction.
  @ViewChildren('revealEl') revealEls!: QueryList<ElementRef>;
  private observer!: IntersectionObserver;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return; // skip on server — IntersectionObserver doesn't exist there

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          } else {
            entry.target.classList.remove('is-visible');
          }
        });
      },
      {
        threshold: 0,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    this.revealEls.forEach(el => this.observer.observe(el.nativeElement));
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
