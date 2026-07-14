import { Component, ElementRef, ViewChild, AfterViewInit, Input, OnDestroy } from '@angular/core';

import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

@Component({
  selector: 'app-model3d',
  standalone: true,
  templateUrl: './model3d.html',
  styleUrl: './model3d.css',
})
export class Model3d implements AfterViewInit, OnDestroy {
  @ViewChild('viewer', { static: true })
  viewer!: ElementRef<HTMLDivElement>;

  /*
  ====================
  INPUTS
  ====================
  */

  @Input()
  model = 'assets/models/model.glb';

  @Input()
  scale = 2;

  @Input()
  posX = 0;

  @Input()
  posY = 0;

  @Input()
  posZ = 0;

  /*
  ROTACION INICIAL DEL OBJETO
  ====================
  */

  @Input()
  rotX = 0;

  @Input()
  rotY = 0;

  @Input()
  rotZ = 0;

  /*
  FLOAT
  ====================
  */

  @Input()
  floatAmplitude = 0.12;

  @Input()
  floatSpeed = 0.0007;

  /*
  HOVER
  ====================
  */

  @Input()
  mouseInfluence = 0.08;

  /*
  ====================
  THREE
  ====================
  */

  private scene!: THREE.Scene;

  private camera!: THREE.PerspectiveCamera;

  private renderer!: THREE.WebGLRenderer;

  private object?: THREE.Group;

  private animationId = 0;

  /*
  ====================
  BASE ROTATION
  ====================
  */

  private baseRotation = {
    x: 0,

    y: 0,

    z: 0,
  };

  /*
  ====================
  STATE
  ====================
  */

  private mouse = {
    x: 0,

    y: 0,
  };

  private dragging = false;

  private previousPointer = {
    x: 0,

    y: 0,
  };

  /*
  acumulador drag
  */

  private dragOffset = {
    x: 0,

    y: 0,
  };

  /*
  rotacion actual suavizada
  */

  private currentRotation = {
    x: 0,

    y: 0,
  };

  /*
  ====================
  INIT
  ====================
  */

  ngAfterViewInit() {
    this.initScene();

    this.createLights();

    this.loadModel();

    this.animate();

    window.addEventListener('mousemove', this.mouseMove);

    window.addEventListener('resize', this.resize);
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);

    window.removeEventListener('mousemove', this.mouseMove);

    window.removeEventListener('resize', this.resize);

    this.renderer?.dispose();
  }

  /*
  ====================
  SCENE
  ====================
  */

  private initScene() {
    const width = this.viewer.nativeElement.clientWidth;

    const height = this.viewer.nativeElement.clientHeight;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);

    this.camera.position.z = 6;

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,

      antialias: true,
    });

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.renderer.setSize(width, height);

    this.viewer.nativeElement.appendChild(this.renderer.domElement);

    const canvas = this.renderer.domElement;

    canvas.addEventListener('pointerdown', this.pointerDown);

    canvas.addEventListener('pointermove', this.pointerMove);

    canvas.addEventListener('pointerup', this.pointerUp);

    canvas.addEventListener('pointerleave', this.pointerUp);
  }

  /*
  ====================
  LIGHTS
  ====================
  */

  private createLights() {
    const ambient = new THREE.AmbientLight(0xffffff, 1);

    this.scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffffff, 2);

    key.position.set(3, 5, 6);

    this.scene.add(key);
  }

  /*
  ====================
  MODEL
  ====================
  */

  private loadModel() {
    new GLTFLoader().load(
      this.model,

      (gltf) => {
        this.object = gltf.scene;

        this.object.scale.setScalar(this.scale);

        this.object.position.set(this.posX, this.posY, this.posZ);

        /*
        BASE Rotation
        */

        this.baseRotation.x = this.rotX;

        this.baseRotation.y = this.rotY;

        this.baseRotation.z = this.rotZ;

        this.object.rotation.set(
          this.baseRotation.x,

          this.baseRotation.y,

          this.baseRotation.z,
        );

        this.scene.add(this.object);
      },
    );
  }

  /*
  ====================
  ANIMATION
  ====================
  */

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);

    if (this.object) {
      const time = performance.now();

      /*
      FLOAT VERTICAL
      */

      this.object.position.y = this.posY + Math.sin(time * this.floatSpeed) * this.floatAmplitude;

      /*
      IDLE MOVEMENT
      */

      const idleY = Math.sin(time * 0.001) * 0.04;

      const idleX = Math.sin(time * 0.0012) * 0.025;

      /*
      HOVER
      */

      const hoverX = this.mouse.y * this.mouseInfluence;

      const hoverY = this.mouse.x * this.mouseInfluence;

      let targetX = idleX + hoverX + this.dragOffset.x;

      let targetY = idleY + hoverY + this.dragOffset.y;

      /*
      RETURN AFTER DRAG
      */

      if (!this.dragging) {
        this.dragOffset.x = THREE.MathUtils.lerp(this.dragOffset.x, 0, 0.035);

        this.dragOffset.y = THREE.MathUtils.lerp(this.dragOffset.y, 0, 0.035);
      }

      this.currentRotation.x = THREE.MathUtils.lerp(this.currentRotation.x, targetX, 0.03);

      this.currentRotation.y = THREE.MathUtils.lerp(this.currentRotation.y, targetY, 0.03);

      /*
      BASE + DINAMICA
      */

      this.object.rotation.x = this.baseRotation.x + this.currentRotation.x;

      this.object.rotation.y = this.baseRotation.y + this.currentRotation.y;

      this.object.rotation.z = this.baseRotation.z;
    }

    this.renderer.render(this.scene, this.camera);
  };

  /*
  ====================
  DRAG
  ====================
  */

  private pointerDown = (e: PointerEvent) => {
    this.dragging = true;

    this.previousPointer.x = e.clientX;

    this.previousPointer.y = e.clientY;

    this.renderer.domElement.setPointerCapture(e.pointerId);
  };

  private pointerMove = (e: PointerEvent) => {
    if (!this.dragging) return;

    const dx = e.clientX - this.previousPointer.x;

    const dy = e.clientY - this.previousPointer.y;

    this.dragOffset.y += dx * 0.008;

    this.dragOffset.x += dy * 0.008;

    this.previousPointer.x = e.clientX;

    this.previousPointer.y = e.clientY;
  };

  private pointerUp = () => {
    this.dragging = false;
  };

  /*
  ====================
  HOVER
  ====================
  */

  private mouseMove = (e: MouseEvent) => {
    this.mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;

    this.mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  };

  /*
  ====================
  RESIZE
  ====================
  */

  private resize = () => {
    const width = this.viewer.nativeElement.clientWidth;

    const height = this.viewer.nativeElement.clientHeight;

    this.camera.aspect = width / height;

    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  };
}
