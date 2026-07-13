import { Component } from '@angular/core';
import { Model3d } from '../model3d/model3d';

@Component({
  selector: 'app-background',
  imports: [Model3d],
  templateUrl: './background.html',
  styleUrl: './background.css',
})
export class Background {}
