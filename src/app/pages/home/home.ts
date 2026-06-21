import { Component, HostListener } from '@angular/core';

import { Header } from '../../components/header/header';
import { Hero } from '../../components/hero/hero';
import { About } from '../../components/about/about';
import { Projects } from '../../components/projects/projects';
import { Background } from '../../components/background/background';
import { Contact } from '../../components/contact/contact';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-home',
  imports: [
    Header,
    Hero,
    About,
    Projects,
    Background,
    Contact,
    Footer
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  currentIndex = 0;

  colors = [
    '#111111',
    '#1e3a5f',
    '#b33a3a',
    '#3b5f3a',
    '#d8d2c4'
  ];

  // DESKTOP
  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {

    if (window.innerWidth <= 768) return;

    if (event.deltaY > 0) {
      this.currentIndex = Math.min(this.currentIndex + 1, 4);
    } else {
      this.currentIndex = Math.max(this.currentIndex - 1, 0);
    }
  }

  // MOBILE (FIX REAL)
  @HostListener('document:scroll', [])
  onScroll() {

    if (window.innerWidth > 768) return;

    const vh = window.innerHeight;

    // IMPORTANTE: usamos el scroll del viewport, no window
    const scrollY = document.querySelector('.viewport')?.scrollTop || 0;

    const index = Math.round(scrollY / vh);

    this.currentIndex = Math.min(Math.max(index, 0), 4);
  }
}