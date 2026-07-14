import { Component } from '@angular/core';
import { Model3d } from '../model3d/model3d';

@Component({
  selector: 'app-hero',
  imports: [Model3d],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {}
