import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChildren, QueryList, Inject, PLATFORM_ID } from '@angular/core';
import { NgFor, NgClass, AsyncPipe, isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-courses',
  standalone: true,
  templateUrl: './courses.html',
  styleUrls: ['./courses.css'],
  imports: [NgFor, NgClass, AsyncPipe]
})
export class CoursesComponent implements OnInit, AfterViewInit, OnDestroy {

  courses$!: Observable<any[]>;

  // ---------- SCROLL REVEAL (repeating) ----------
  // Elements tagged with #revealEl in courses.html fade/slide in every
  // time they enter the viewport (scrolling down OR back up into them)
  // and fade/slide out every time they leave the viewport in either
  // direction — same behavior as the About and Dashboard pages.
  @ViewChildren('revealEl') revealEls!: QueryList<ElementRef>;
  private observer!: IntersectionObserver;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.courses$ = of([
      { title: 'Communication Skills', duration: '4 Weeks' },
      { title: 'Personality Development', duration: '6 Weeks' },
      { title: 'Interview Preparation', duration: '3 Weeks' }
    ]);
  }

  ngAfterViewInit(): void {
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

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
