import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

@Component({
  selector: 'app-model3d',
  templateUrl: './model3d.html',
  styleUrl: './model3d.css',
})
export class Model3d implements AfterViewInit {
  @ViewChild('canvas')
  canvas!: ElementRef<HTMLCanvasElement>;

  model?: THREE.Object3D;

  private rotationTarget = {
    x: 0,
    y: 0,
  };

  private dragging = false;

  private previousX = 0;

  private previousY = 0;

  ngAfterViewInit() {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );

    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas.nativeElement,

      alpha: true,

      antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);

    /* LIGHT */

    const light = new THREE.HemisphereLight(0xffffff, 0x222222, 3);

    scene.add(light);

    /* LOAD MODEL */

    new GLTFLoader().load(
      'assets/models/donut.glb', //load the 3d model

      (gltf) => {
        this.model = gltf.scene;

        this.model.scale.set(5, 5, 5); //size the 3d model

        scene.add(this.model);
      },
    );

    /* MOUSE PARALLAX */

    window.addEventListener('mousemove', (e) => {
      if (!this.model) return;

      const x = e.clientX / window.innerWidth - 0.5;

      const y = e.clientY / window.innerHeight - 0.5;

      this.rotationTarget.y = x * 0.3;

      this.rotationTarget.x = y * 0.15;
    });

    /* DRAG ROTATION */

    renderer.domElement.addEventListener('pointerdown', (e) => {
      this.dragging = true;

      this.previousX = e.clientX;

      this.previousY = e.clientY;
    });

    window.addEventListener('pointerup', () => {
      this.dragging = false;
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.dragging || !this.model) return;

      const dx = e.clientX - this.previousX;

      const dy = e.clientY - this.previousY;

      this.model.rotation.y += dx * 0.01;

      this.model.rotation.x += dy * 0.01;

      this.previousX = e.clientX;

      this.previousY = e.clientY;
    });

    /* LOOP */

    const animate = () => {
      requestAnimationFrame(animate);

      if (this.model) {
        this.model.rotation.y += (this.rotationTarget.y - this.model.rotation.y) * 0.03;

        this.model.rotation.x += (this.rotationTarget.x - this.model.rotation.x) * 0.03;

        // flotación

        this.model.position.y = Math.sin(Date.now() * 0.001) * 0.08;
      }

      renderer.render(scene, camera);
    };
    
        animate();

  }
}
