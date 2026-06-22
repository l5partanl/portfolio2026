import { Component, Input, Output, EventEmitter, HostListener  } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  @Input() currentSection = 0;
  @Output() navigate = new EventEmitter<number>();

  sections = [
    'Hero',
    'About',
    'Projects',
    'Background',
    'Contact'
  ];

  // =========================
  // TOOLTIP STATE
  // =========================
  hoveredIndex: number | null = null;

  mouseX = 0;
  mouseY = 0;

   // store dot positions
  private dots: DOMRect[] = [];

    // =========================
  // TRACK MOUSE
  // =========================
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  }

    // =========================
  // REGISTER DOTS AFTER VIEW
  // =========================
  @HostListener('window:load')
  updateDots() {
    const els = document.querySelectorAll('.dot');
    this.dots = Array.from(els).map(el => el.getBoundingClientRect());
  }

  // =========================
  // MAGNET POSITION
  // =========================
  getMagnetStyle(i: number): string {

    const el = this.dots[i];
    if (!el) return 'translate(0px,0px)';

    const cx = el.left + el.width / 2;
    const cy = el.top + el.height / 2;

    const dx = this.mouseX - cx;
    const dy = this.mouseY - cy;

    const dist = Math.sqrt(dx * dx + dy * dy);

    const radius = 80; // influence radius

    if (dist > radius) return 'translate(0px,0px)';

    const strength = (1 - dist / radius) * 10;

    return `translate(${dx * strength * 0.05}px, ${dy * strength * 0.05}px)`;
  }

  // =========================
  // NAV
  // =========================
  goTo(index: number) {
    this.navigate.emit(index);
  }

  // =========================
  // FILL
  // =========================
  getFill(index: number): number {
    const diff = this.currentSection - index;

    // full if passed, partial if near
    if (diff >= 0) return 1;
    if (diff < -1) return 0;

    // transition zone (smooth between sections)
    return 1 + diff; // diff is negative between 0 and -1
  }

  // =========================
  // TOOLTIP EVENTS
  // =========================
  onEnter(index: number, event: MouseEvent) {
    this.hoveredIndex = index;
    this.updateMouse(event);
  }

  onMove(event: MouseEvent) {
    this.updateMouse(event);
  }

  onLeave() {
    this.hoveredIndex = null;
  }

  private updateMouse(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  get hoveredLabel(): string {
    return this.hoveredIndex !== null
      ? this.sections[this.hoveredIndex]
      : '';
  }
}