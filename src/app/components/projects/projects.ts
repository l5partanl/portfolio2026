import { Component } from '@angular/core';

@Component({
  selector: 'app-projects',
  standalone: true,
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
  projects = [
    {
      title: 'TRAVEL PLATFORM',
      year: '2026',
      type: 'FULL STACK APPLICATION',

      image:
        'https://res.cloudinary.com/dmfyesbwp/image/upload/v1746879800/ezgif-6cad2b15543c2b_rk6lyd.gif',

      stack: ['Angular', 'Node.js', 'MySQL', 'TypeScript'],

      description:
        'A collaborative travel platform where users create, manage and join experiences.',

      flipped: false,
    },

    {
      title: 'INTERACTIVE TABLE',
      year: '2026',
      type: 'INTERACTION DESIGN',

      image:
        'https://res.cloudinary.com/dmfyesbwp/image/upload/v1746878625/blogdeviajes_wpl2k8.gif',

      stack: ['Angular', 'Three.js', 'WebGL'],

      description: 'A spatial interface connecting physical objects with digital interaction.',

      flipped: false,
    },

    {
      title: 'PORTFOLIO SYSTEM',
      year: '2026',
      type: 'CREATIVE DEVELOPMENT',

      image: 'assets/projects/portfolio.gif',

      stack: ['Angular', 'CSS', 'Motion'],

      description: 'A digital playground exploring interfaces, animation and creative coding.',

      flipped: false,
    },
  ];

  activeIndex = 0;

  selectProject(index: number) {
    this.activeIndex = index;
  }

  flipProject(project: any, event: MouseEvent) {
    event.stopPropagation();

    project.flipped = !project.flipped;
  }

  cardStyle(index: number) {
    const offset = index - this.activeIndex;

    const distance = Math.abs(offset);

    return {
      'z-index': this.projects.length - distance,

      transform: `
      translateX(${offset * 90}px)
      translateY(${distance * 70}px)
      scale(${1 - distance * 0.08})
      rotate(${offset * 6}deg)
    `,

      opacity: Math.max(0.35, 1 - distance * 0.15),
    };
  }
}
