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
}
