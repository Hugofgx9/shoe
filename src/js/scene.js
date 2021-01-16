import * as THREE from 'three';
import gsap from 'gsap';
import Model from './model';

export default class Scene{ 
	constructor() {

		this.scene = new THREE.Scene();
		//this.scene.background = new THREE.Color( 0x1C1C1C );
		this.container = document.querySelector('canvas');
		this.perspective = 800;
		this.fov = (180 * (2 * Math.atan(window.innerHeight / 2 / this.perspective))) / Math.PI; //use for camera
		this.renderer = new THREE.WebGLRenderer ({
			canvas: this.container,
			antialias: true,
			alpha: true,
		});
		this.clock = new THREE.Clock();
		//document.body.appendChild ( this.renderer.domElement );
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setPixelRatio(window.devicePixelRatio);

		this.mouse = new THREE.Vector2(0,0);

		this.initLights();
		this.initCamera();
		this.start();
		this.update();
		this.listenWindow();
	}

	start() {
		this.shoe = new Model(this);
	}

	initLights() {
		const ambientLight = new THREE.AmbientLight( 0xffffff, 0.5);
		this.scene.add(ambientLight);

		const light = new THREE.PointLight( 0xffffff, 1, 1000 );
		light.position.set(0, 0, 400 );
		this.scene.add( light );
		// const helper = new THREE.PointLightHelper( light, 5 );
		// this.scene.add( helper );
	}

	initCamera() {
		this.camera = new THREE.PerspectiveCamera( this.fov, window.innerWidth / window.innerHeight, 1, 1000);
		this.camera.position.set(0,0, this.perspective);
	}

	updateCamera() {
		this.camera.fov = this.fov;
		this.camera.aspect =window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
	}

	onWindowResize() {
		this.updateCamera();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.shoe.onWindowResize();
	}

	onMouseMove(event) {
		gsap.to(this.mouse, 0.5, {
			x: event.clientX,
			y: event.clientY,
		});
	}

	update() {
		requestAnimationFrame( this.update.bind( this ) );
		this.renderer.render( this.scene , this.camera );
		this.shoe.update();
	}

	listenWindow() {
		if ('ontouchstart' in window){
			document.addEventListener('touchmove', (ev) => this.onMouseMove(ev) );
		}else{
			window.addEventListener( 'resize', () => this.onWindowResize() );
			document.addEventListener('mousemove', (ev) => this.onMouseMove(ev) );
		}
	}
}