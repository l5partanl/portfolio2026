
import { Component, HostListener } from '@angular/core';

import { Header } from '../../components/header/header';
import { Hero } from '../../components/hero/hero';
import { About } from '../../components/about/about';
import { Projects } from '../../components/projects/projects';
import { Background } from '../../components/background/background';
import { Contact } from '../../components/contact/contact';
import { Footer } from '../../components/footer/footer';
import { Divider } from "../../components/divider/divider";

@Component({
  selector: 'app-home',
  imports: [
    Header,
    Hero,
    About,
    Projects,
    Background,
    Contact,
    Footer,
    Divider
],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  // =========================
  // CONFIG
  // =========================
  sections = 5;

  // real target (input)
  targetIndex = 0;

  // visual smooth (output)
  smoothIndex = 0;

  velocity = 0;

  friction = 0.14;
  scrollStrength = 0.0004;

  colors = [
[17, 17, 17], // hero
[30, 58, 95], // about
[179, 58, 58], // projects
[59, 95, 58], // background
[216, 210, 196] // contact
  ];

  // =========================
  // INPUT (WHEEL)
  // =========================
  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {

    if (window.innerWidth <= 768) return;

    this.velocity += event.deltaY * this.scrollStrength;

    this.animatePhysics();
  }

  // =========================
  // PHYSICS → TARGET INDEX
  // =========================
  private animatePhysics() {

    this.targetIndex += this.velocity;

    this.velocity *= this.friction;

    this.targetIndex = this.clamp(this.targetIndex, 0, this.sections - 1);

    if (Math.abs(this.velocity) > 0.0005) {
      requestAnimationFrame(() => this.animatePhysics());
    }
  }

  // =========================
  // SMOOTH FOLLOW
  // =========================
  private animateSmooth() {

    const diff = this.targetIndex - this.smoothIndex;

    this.smoothIndex += diff * 1.02;

    requestAnimationFrame(() => this.animateSmooth());
  }

  // auto start loop
  constructor() {
    this.animateSmooth();
  }

  // =========================
  // MOBILE
  // =========================
  @HostListener('window:scroll', [])
  onScroll() {

    if (window.innerWidth > 768) return;

    const step = this.mobileStepHeight;

const t = window.scrollY / step;

this.targetIndex = this.clamp(
  t,
  0,
  this.sections - 1
);
this.smoothIndex = this.targetIndex;
  }

  // =========================
  // TRANSFORM (USES smoothIndex)
  // =========================
  get trackTransform() {

    if (window.innerWidth <= 768) return 'none';

    return `translate3d(-${this.smoothIndex * 112}vw, 0, 0)`; // 112vw (100vw of section + 12vw of divider)
  }

  // =========================
  // COLOR (USES SAME smoothIndex → FIX DESYNC)
  // =========================
  get bgColor() {

    const i = Math.floor(this.smoothIndex);
    const j = Math.min(i + 1, this.sections - 1);

    const t = this.smoothIndex - i;

    const c1 = this.colors[i];
    const c2 = this.colors[j];

    return `rgb(
      ${this.lerp(c1[0], c2[0], t)},
      ${this.lerp(c1[1], c2[1], t)},
      ${this.lerp(c1[2], c2[2], t)}
    )`;
  }

  // =========================
  // HELPERS
  // =========================
  private lerp(a: number, b: number, t: number) {
    return Math.round(a + (b - a) * t);
  }

  private clamp(v: number, min: number, max: number) {
    return Math.max(min, Math.min(max, v));
  }

  // =========================
  // MOUSE PARALLAX 
  // =========================
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {

    if (window.innerWidth <= 768) return;

    const x = (e.clientX / window.innerWidth - 0.5) * 40;
    const y = (e.clientY / window.innerHeight - 0.5) * 40;

    document.documentElement.style.setProperty('--mx', `${x}px`);
    document.documentElement.style.setProperty('--my', `${y}px`);
  }

    // =========================
  // FOR NAME UNDERLINE ANIMATION
  // =========================
get isAboutVisible() {
  return this.smoothIndex > 0.6 && this.smoothIndex < 1.4;
}


    // =========================
  // FOR SCROLL INDICATOR
  // =========================
goToSection(index: number) {

  this.targetIndex = index;

  if (window.innerWidth <= 768) {

 window.scrollTo({
  top: index * this.mobileStepHeight,
  behavior:'smooth'
});

  }
}

// =========================
// MOBILE LAYOUT
// =========================

mobileSectionHeight = 100; // vh
mobileDividerHeight = 60;  // vh

get mobileStepHeight(){

  return window.innerHeight *
  ((this.mobileSectionHeight + this.mobileDividerHeight) / 100);

}

  }