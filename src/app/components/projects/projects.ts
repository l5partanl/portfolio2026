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
      title: 'TRAVEL PLATFORM',
      year: '2025',
      type: 'FULL STACK APPLICATION',
      image:
        'https://res.cloudinary.com/dmfyesbwp/image/upload/v1746879800/ezgif-6cad2b15543c2b_rk6lyd.gif',
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
      image:
        'https://res.cloudinary.com/dmfyesbwp/image/upload/v1785576874/7C6E5F84-3E7D-4159-9C52-26F8156FC347_snhvze.png',
      stack: ['Angular', 'Three.js', 'WebGL', 'MongoDB'],
      description:
        'Another fullstack project loaded via REST client. The culmination of my full-stack course that alows me to experiment with different logics, where i can put all my knowledge not just from programing but from design as well.',
      flipped: false,
      note: 'A spatial interface connecting physical objects with digital interaction.',
      link: 'https://portfolio-faf73.web.app/',
    },

    {
      title: 'TRIPS BLOG',
      year: '2024',
      type: 'CREATIVE DEVELOPMENT',
      image:
        'https://res.cloudinary.com/dmfyesbwp/image/upload/v1746878625/blogdeviajes_wpl2k8.gif',
      stack: ['Angular', 'CSS', 'Motion'],
      description:
        'A small digital playground exploring interfaces, animation and creative coding.',
      flipped: false,
      note: 'A fullstack (mostly front) project with a badass parallax effect and other experiments.',
      link: '',
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
