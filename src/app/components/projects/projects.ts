import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-projects',
  standalone: true,
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects implements AfterViewInit {
  projects = [
    {
      title: 'CLEANROOM CONFIGURATOR',
      year: '2026',
      type: 'FULL STACK APPLICATION',
      image: '../assets/images/estimate.png',
      stack: ['Angular', 'Node.js', 'MongoDB', 'TypeScript'],
      description:
        'Web app designed to quickly configure and estimate cleanroom projects. It combines a clear step-by-step workflow with an interactive sketch editor for adding, positioning and configuring rooms and components, generating a preliminary bill of materials and project estimate on the go.',
      flipped: false,
      note: 'A fast and structured tool for turning room layouts and components into clear project estimates.',
      link: 'https://cleanroom-configurator.web.app',
    },
    {
      title: 'GAME FACEOFF',
      year: '2026',
      type: 'INTERACTIVE WEB EXPERIENCE',
      image: '../assets/images/game-faceoff.png',
      stack: ['React', 'Three.js', 'Node.js', 'MongoDB', 'IGDB API'],
      description:
        'Interactive fullstack project where users vote between two videogames in endless head-to-head matches. It tracks community voting scores and builds dynamic rankings, revealing insights about gaming preferences and uncover hidden gems.',
      flipped: false,
      note: 'Every vote counts. Discover which games win, what the community prefers, and how gaming tastes compare.',
      link: 'https://game-faceoff.web.app/',
    },
    {
      title: 'TRAVEL PLATFORM',
      year: '2025',
      type: 'FULL STACK APPLICATION',
      image: '../assets/images/viajes.png',
      stack: ['Angular', 'Node.js', 'MySQL', 'TypeScript'],
      description:
        'This is a fullstack project that allows users to create and be part of diverse trips. Kind of a traveling airBnb. Done with a MySql database, a back structured in node.js and an Angular typed front.',
      flipped: false,
      note: 'A collaborative travel platform where users create, manage and join experiences.',
      link: '',
    },
    {
      title: 'INTERACTIVE TABLE',
      year: '2025',
      type: 'INTERACTION DESIGN',
      image: '../assets/images/portf.png',
      stack: ['Angular', 'CSS', 'Motion', 'WebGL', 'MongoDB'],
      description:
        'Another fullstack project loaded via REST client. The culmination of my full-stack course that alows me to experiment with different logics, where i can put all my knowledge not just from programing but from design as well.',
      flipped: false,
      note: 'A spatial interface connecting physical objects with digital interaction.',
      link: 'https://portfolio-faf73.web.app/',
    },

  ];

  activeIndex = 0;

  selectProject(index: number) {
    this.activeIndex = index;
  }

  flipProject(project: any, event: MouseEvent) {
    event.stopPropagation();
    if (this.projects.indexOf(project) !== this.activeIndex) {
      return;
    }
    project.flipped = !project.flipped;
  }

  tilt(event: MouseEvent) {
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const px = x / rect.width;
    const py = y / rect.height;
    const mx = px * 100;
    const my = py * 100;
    card.style.setProperty('--mx', `${mx}%`);
    card.style.setProperty('--my', `${my}%`);

    /* holo movement */

    const hx = 50 + (px - 0.5) * 80;
    const hy = 50 + (py - 0.5) * 80;
    card.style.setProperty('--hx', `${hx}%`);
    card.style.setProperty('--hy', `${hy}%`);

    /* card tilt */

    card.style.setProperty('--ry', `${(px - 0.5) * 14}deg`);
    card.style.setProperty('--rx', `${-(py - 0.5) * 14}deg`);
  }

  leave(event: MouseEvent) {
    const card = event.currentTarget as HTMLElement;
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
    card.style.setProperty('--mx', '50%');
    card.style.setProperty('--my', '50%');
    card.style.setProperty('--hx', '50%');
    card.style.setProperty('--hy', '50%');
  }

  cardStyle(index: number) {
    const offset = index - this.activeIndex;
    const distance = Math.abs(offset);
    const isMobile = window.innerWidth <= 576;

    if (isMobile) {
      return {
        'z-index': this.projects.length - distance,
        '--card-transform': `
        translateY(${offset * 200}px)
        scale(${1 - distance * 0.04})
        rotate(${offset * 3}deg)
      `,
        opacity: Math.max(0.7, 1 - distance * 0.12),
      };
    }

    return {
      'z-index': this.projects.length - distance,
      '--card-transform': `
      translateX(${offset * 180}px)
      translateY(${distance * 80}px)
      scale(${1 - distance * 0.08})
      rotate(${offset * 6}deg)
    `,
      opacity: Math.max(0.85, 1 - distance * 0.05),
    };
  }

  onMove(e: MouseEvent, card: HTMLElement) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const mx = x / rect.width;
    const my = y / rect.height;
    card.style.setProperty('--mx', `${mx * 100}%`);
    card.style.setProperty('--my', `${my * 100}%`);
    card.style.setProperty('--ry', `${(mx - 0.5) * 18}deg`);
    card.style.setProperty('--rx', `${-(my - 0.5) * 18}deg`);
  }

  private idleFrame = 0;

  ngAfterViewInit() {
    const cards = document.querySelectorAll<HTMLElement>('.project-card');
    const loop = () => {
      const t = Date.now() / 1500;
      cards.forEach((card) => {
        card.style.setProperty('--idleX', `${Math.sin(t) * 12}%`);
        card.style.setProperty('--idleY', `${Math.cos(t) * 12}%`);
      });
      requestAnimationFrame(loop);
    };
    loop();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.idleFrame);
  }

  photoLight(event: MouseEvent) {
    const card = event.currentTarget as HTMLElement;
    const photo = card.querySelector('.photo-front') as HTMLElement;
    const back = card.querySelector('.photo-back') as HTMLElement;
    if (!photo) return;
    const rect = photo.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    photo.style.setProperty('--photo-x', `${x}%`);
    photo.style.setProperty('--photo-y', `${y}%`);
    if (back) {
      back.style.setProperty('--photo-x', `${x}%`);
      back.style.setProperty('--photo-y', `${y}%`);
    }
  }
}
