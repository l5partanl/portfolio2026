import { Component, Input } from '@angular/core';
import { Model3d } from '../model3d/model3d';

@Component({
  selector: 'app-about',
  imports: [Model3d],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  @Input() active = false;

  showCvTooltip = false;

  tooltipX = 0;
  tooltipY = 0;

  moveCvTooltip(event: MouseEvent) {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();

    this.tooltipX = event.clientX - rect.left + 20;

    this.tooltipY = event.clientY - rect.top + 20;
  }

  downloadCV() {
    const link = document.createElement('a');

    link.href = '/assets/CV-GianCaorlin.pdf';

    link.download = 'CV-GianCaorlin.pdf';

    link.click();
  }
}
