import { Component } from '@angular/core';
interface Shape{

type:string;

x:number;

y:number;

size:number;

layer:string;

delay:number;

rotation:number;

}

@Component({
  selector: 'app-divider',
  imports: [],
  templateUrl: './divider.html',
  styleUrl: './divider.css',
})
export class Divider {
  
shapes: Shape[] = [];

types = [
'diamond',
'circle',
'square',
'ring',
'triangle',
'cross'
];

layers=[
'layer-fast',
'layer-medium',
'layer-slow'
];

constructor(){

this.generateShapes();

}

generateShapes(){

const amount=8;

for(let i=0;i<amount;i++){

this.shapes.push({

type:this.types[Math.floor(Math.random()*this.types.length)],

layer:this.layers[Math.floor(Math.random()*this.layers.length)],

x:Math.random()*80+10,

y:Math.random()*80+10,

size:20+Math.random()*60,

rotation:Math.random()*360,

delay:Math.random()*6

});

}

}

}
