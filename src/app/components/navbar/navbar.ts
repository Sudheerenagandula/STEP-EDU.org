import { Component, OnInit, HostListener, Inject, PLATFORM_ID, ViewEncapsulation, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit {

  isScrolled = false;
  menuOpen = false;

  highlightWidth = 0;
  highlightX = 0;
  highlightOpacity = 0;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private elRef: ElementRef
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled = window.scrollY > 20;
      setTimeout(() => {
        const navHeight = this.elRef.nativeElement.querySelector('.nav-shell')?.offsetHeight || 84;
        document.body.style.paddingTop = navHeight + 'px';
      });
    }
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled = window.scrollY > 20;
    }
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  onLinkHover(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    this.highlightWidth = target.offsetWidth;
    this.highlightX = target.offsetLeft;
    this.highlightOpacity = 1;
  }

  resetHighlight(): void {
    this.highlightOpacity = 0;
  }
}
