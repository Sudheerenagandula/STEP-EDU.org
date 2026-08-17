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

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private elRef: ElementRef
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled = window.scrollY > 20;
      // push page content down by the navbar's real height, since
      // fixed positioning takes it out of normal document flow
      setTimeout(() => {
        const navHeight = this.elRef.nativeElement.querySelector('.nav-shell')?.offsetHeight || 72;
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
}
