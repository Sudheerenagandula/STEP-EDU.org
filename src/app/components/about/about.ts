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

  // ---------- SCROLL REVEAL ----------
  @ViewChildren('revealEl') revealEls!: QueryList<ElementRef>;
  private observer!: IntersectionObserver;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return; // FIX: skip on server — IntersectionObserver doesn't exist there

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            this.observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    this.revealEls.forEach(el => this.observer.observe(el.nativeElement));
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
