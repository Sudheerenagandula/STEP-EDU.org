import { Component, AfterViewInit, ElementRef, Inject, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],  // ← removed Hero, About, Courses etc. — they are separate routes
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  encapsulation: ViewEncapsulation.None
})
export class Dashboard implements AfterViewInit {

  stats = [
    { target: 200000, display: '0', suffix: '+', label: 'Graduates pass out every year in Hyderabad', icon: 'fas fa-user-graduate', isLakh: true,  isRange: false },
    { target: 100,    display: '0', suffix: '+', label: 'Engineering Colleges in GHMC area',          icon: 'fas fa-building-columns', isLakh: false, isRange: false },
    { target: 300,    display: '0', suffix: '+', label: 'Degree Colleges in GHMC area',               icon: 'fas fa-school', isLakh: false, isRange: false },
    { target: 6,      display: '6', suffix: '',  label: 'Months of focused finishing school training', icon: 'fas fa-calendar-check', isLakh: false, isRange: true }
  ];

  scopeCards = [
    { icon: 'fas fa-city',          value: '100+',      label: 'Engineering Colleges in GHMC area' },
    { icon: 'fas fa-school',        value: '300+',      label: 'Degree Colleges in GHMC area' },
    { icon: 'fas fa-user-graduate', value: '2,00,000+', label: 'Students graduate every year' },
    { icon: 'fas fa-rupee-sign',    value: '₹6 Cr+',   label: 'Revenue potential per center per year' }
  ];

  incomeStreams = [
    '6 & 12 Month Finishing School Programs',
    'School & Junior College Programs',
    'Open House Seminars & Workshops (1–4 days)',
    'Train the Trainer & Faculty Development',
    'Sales Training & Corporate Programs',
    'Publications & Learning Resources'
  ];

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.initCountUp();
  }

  private initCountUp(): void {
    const statsSection = this.el.nativeElement.querySelector('.stats-section');
    if (!statsSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.runCountUp();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(statsSection);
  }

  private runCountUp(): void {
    this.stats.forEach((stat, i) => {
      setTimeout(() => {
        stat.isRange ? this.animateRange(stat) : this.animateNumber(stat);
      }, i * 180);
    });
  }

  private animateNumber(stat: any): void {
    const duration = 2000;
    const steps = 65;
    let step = 0;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const timer = setInterval(() => {
      step++;
      const val = Math.round(stat.target * easeOut(step / steps));
      stat.display = stat.isLakh ? val.toLocaleString('en-IN') : val.toString();
      if (step >= steps) {
        clearInterval(timer);
        stat.display = stat.isLakh
          ? stat.target.toLocaleString('en-IN')
          : stat.target.toString();
      }
    }, duration / steps);
  }

  private animateRange(stat: any): void {
    const duration = 1200;
    const steps = 30;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      stat.display = Math.round((6 / steps) * step).toString();
      if (step >= steps) {
        clearInterval(timer);
        stat.display = '6';
        stat.suffix = '–12';
      }
    }, duration / steps);
  }
}
