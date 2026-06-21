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

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {

    if (window.innerWidth <= 768) return;

    this.changeIndex(event.deltaY);
  }

  private changeIndex(delta: number) {

    if (delta > 0) {
      this.currentIndex = Math.min(this.currentIndex + 1, 4);
    } else {
      this.currentIndex = Math.max(this.currentIndex - 1, 0);
    }
  }

  // 👉 MOBILE FIX: usar touch simple
  private startY = 0;

  @HostListener('window:scroll', [])
onMobileScroll() {

  if (window.innerWidth > 768) return;

  const index = Math.round(
    window.scrollY / window.innerHeight
  );

  this.currentIndex = Math.min(
    Math.max(index, 0),
    this.colors.length - 1
  );
}

get trackTransform() {

  if (window.innerWidth <= 768) {
    return 'none';
  }

  return `translateX(-${this.currentIndex * 100}vw)`;
}
}