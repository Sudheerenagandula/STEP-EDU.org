import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID,
  Inject,
  NgZone
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer implements AfterViewInit, OnDestroy {

  @ViewChild('revealSection')
  revealSection!: ElementRef<HTMLElement>;

  @ViewChild('brandLayer')
  brandLayer!: ElementRef<HTMLElement>;

  private ticking = false;

  private isBrowser: boolean;

  // Track width only — mobile address-bar show/hide changes
  // window.innerHeight but NOT innerWidth. We only want to
  // recalc on a real viewport change, not an address-bar toggle.
  private lastWidth = 0;

  private boundScrollUpdate = () => this.requestUpdate();
  private boundResizeUpdate = () => this.handleResize();


  constructor(
    @Inject(PLATFORM_ID)
    platformId: Object,

    private zone: NgZone
  ) {
    this.isBrowser =
      isPlatformBrowser(platformId);
  }


  ngAfterViewInit(): void {

    if (!this.isBrowser) {
      return;
    }

    this.lastWidth = window.innerWidth;

    /*
     * Run scroll handling outside Angular.
     * This prevents Angular change detection from
     * running on every scroll frame.
     */

    this.zone.runOutsideAngular(() => {

      /*
       * Normal window scrolling.
       * (Removed the extra document-level capture-phase
       * listener — it was firing a second time on every
       * scroll event alongside the window listener, which
       * added unnecessary work and a chance of the two
       * calls landing in different frames.)
       */

      window.addEventListener(
        'scroll',
        this.boundScrollUpdate,
        {
          passive: true
        }
      );


      /*
       * Recalculate when the viewport genuinely changes size
       * (rotation, real resize) — but ignore the fake "resize"
       * mobile browsers fire when the address bar hides/shows
       * during scroll, since that only changes height.
       */

      window.addEventListener(
        'resize',
        this.boundResizeUpdate
      );


      /*
       * Initial calculation
       *
       * Double requestAnimationFrame makes sure
       * the footer has finished rendering before
       * calculating its position.
       */

      requestAnimationFrame(() => {

        requestAnimationFrame(() => {

          this.updatePin();

        });

      });

    });

  }


  ngOnDestroy(): void {

    if (!this.isBrowser) {
      return;
    }


    window.removeEventListener(
      'scroll',
      this.boundScrollUpdate
    );


    window.removeEventListener(
      'resize',
      this.boundResizeUpdate
    );

  }


  /*
   * ========================================================
   * RESIZE HANDLING
   * ========================================================
   *
   * Mobile browsers fire 'resize' when the address bar
   * collapses/expands during scroll. That's a height-only
   * change, not a real layout change, and reacting to it is
   * what causes the STEP layer to jump/gap on mobile.
   * Only recalculate if the width actually changed.
   */

  private handleResize(): void {

    const currentWidth = window.innerWidth;

    if (currentWidth === this.lastWidth) {
      return;
    }

    this.lastWidth = currentWidth;

    this.requestUpdate();
  }


  /*
   * ========================================================
   * REQUEST UPDATE
   * ========================================================
   *
   * Prevents multiple update calls during the same
   * browser frame.
   */

  private requestUpdate(): void {

    if (this.ticking) {
      return;
    }


    this.ticking = true;


    requestAnimationFrame(() => {

      this.updatePin();

      this.ticking = false;

    });

  }


  /*
   * ========================================================
   * STEP POSITIONING
   * ========================================================
   *
   * IMPORTANT:
   *
   * We intentionally DO NOT calculate:
   *
   * sectionHeight - brandHeight
   *
   * and we DO NOT clamp the STEP to the bottom.
   *
   * That bottom clamp was causing the STEP to get stuck.
   *
   * NOTE: now uses `transform: translateY()` instead of
   * `top`. `top` is a layout property, so updating it every
   * frame forces a synchronous reflow on top of the
   * getBoundingClientRect() read below — that combination is
   * the main source of the visible jitter. transform is
   * compositor-only and doesn't trigger layout.
   */

  private updatePin(): void {

    const section =
      this.revealSection?.nativeElement;

    const brand =
      this.brandLayer?.nativeElement;


    if (!section || !brand) {
      return;
    }


    /*
     * Get the current position of the entire
     * footer reveal section relative to viewport.
     */

    const sectionRect =
      section.getBoundingClientRect();


    /*
     * If the footer section has not reached the
     * viewport yet, keep STEP at its initial position.
     */

    if (sectionRect.top > window.innerHeight) {

      brand.style.transform = 'translateY(0px)';

      return;
    }


    /*
     * Once the footer enters the viewport,
     * move the absolute STEP layer along with the
     * document scroll.
     *
     * This makes the STEP appear stationary while
     * the footer content moves over it.
     *
     * Rounded to a whole pixel to avoid the sub-pixel
     * blur/shimmer some browsers show on large text when
     * it sits at a fractional position.
     */

    const top =
      Math.round(-sectionRect.top);


    /*
     * IMPORTANT:
     *
     * No Math.min()
     * No sectionHeight - brandHeight
     * No bottom clamp.
     */

    brand.style.transform =
      `translateY(${top}px)`;

  }

}
