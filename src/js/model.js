import * as THREE from 'three';
import gsap from 'gsap';
import { Power1 } from 'gsap/all';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import shoeFile from 'url:../assets/model/Odysseyv2.gltf.png';
import iro from '@jaames/iro';
import Emitter from './emitter';
//import tissuTexture from '../assets/texture/tissuTexture.jpg';
//import { rotation3d } from './utils';

export default class Model {
	constructor(scene) {
		this.scene = scene;
		this.GLTFloader = new GLTFLoader();
		this.loader = new THREE.TextureLoader();
		this.importModel();
		this.shoeCreated = false;
		this.movement = new THREE.Vector3();
		this.emitter = new Emitter();
	}

	on(event, callback) {
		this.emitter.on(event, callback);
	}

	importModel() {
		this.GLTFloader.load(
			shoeFile,
			(gltf) => {
				this.shoe = gltf.scene.children[0];

				// set position
				let left = 0,
					width = window.innerWidth,
					top = 0,
					height = window.innerHeight;
				this.shoe.position.set(
					left - window.innerWidth / 2 + width / 2,
					-top + window.innerHeight / 2 - height / 2
				);

				this.scene.scene.add(this.shoe);

				//this.shoe.getObjectByName('MID', true).material.roughness = 0.25;
				//this.shoe.getObjectByName('TAPER', true).material.roughness = 0;
				console.log(this.shoe);

				// const shoeAxes = new THREE.AxesHelper( 300 );
				// this.shoe.add ( shoeAxes);

				// const sceneAxes = new THREE.AxesHelper( 300 );
				// this.scene.scene.add ( sceneAxes );

				let up = this.shoe.getObjectByName('UP', true);
				up.material.map.wrapS = up.material.map.wrapT = THREE.RepeatWrapping;
				up.material.map.offset.set( 0, 0 );
				up.material.map.repeat.set( 2, 2 );



				// up.material = new THREE.MeshBasicMaterial({
				// 	color: 'rgb(100%, 100%, 100%)',
				// 	map: up.material.map,
				// });

				this.shoeCreated = true;
				this.bindEvents();
				this.emitter.emit('complete', this.shoe);
				this.initColorPicker();
			},
			(xhr) => {
				let amount = xhr.loaded / xhr.total;
				amount = isFinite(amount) ? amount : 0;
				this.emitter.emit('load', amount);
			},
			(error) => {
				console.error(error);
			}
		);
	}

	drag(e) {
		let speed = 0.00015;
		let newMovement = this.movement;
		newMovement.x += e.movementX;
		newMovement.y += e.movementY;

		gsap.to(this.movement, 0.5, {
			x: e.movementX,
			y: e.movementY,
			onUpdate: () => {
				this.rotateAroundWorldAxis(
					this.shoe,
					new THREE.Vector3(0, 1, 0),
					this.movement.x * speed
				);
				this.rotateAroundWorldAxis(
					this.shoe,
					new THREE.Vector3(1, 0, 0),
					this.movement.y * speed
				);
			},
		});
	}

	//changer pour aller à la valeur modulo machin la plus proche
	initRotation() {
		gsap.to(this.shoe.rotation, 5, {
			x: 0,
			y: 0,
			z: 0,
			ease: Power1.easeInOut,
		});
	}

	bindEvents() {
		let isDown = false;
		this.scene.container.addEventListener('mousedown', () => (isDown = true));
		this.scene.container.addEventListener('mousemove', (e) => {
			if (isDown == true) {
				e.preventDefault();
				this.drag(e);
			}
		});
		this.scene.container.addEventListener('mouseup', () => (isDown = false));
		this.scene.container.addEventListener('mouseleave', () => (isDown = false));
		document.querySelectorAll('#color-select button').forEach((btn) => {
			btn.addEventListener('click', () => this.onBtnClick(btn));
		});
	}

	update() {
		if (this.shoeCreated == true) {
			this.shoe.rotation.y += 0.003;
			this.shoe.rotation.x += 0.005;
		}
	}

	rotateAroundObjectAxis(object, axis, radians) {
		let rotationMatrix = new THREE.Matrix4();

		rotationMatrix.makeRotationAxis(axis.normalize(), radians);
		object.matrix.multiply(rotationMatrix);
		object.rotation.setFromRotationMatrix(object.matrix);
	}

	rotateAroundWorldAxis(object, axis, radians) {
		let rotationMatrix = new THREE.Matrix4();

		rotationMatrix.makeRotationAxis(axis.normalize(), radians);
		rotationMatrix.multiply(object.matrix); // pre-multiply
		object.matrix = rotationMatrix;
		object.rotation.setFromRotationMatrix(object.matrix);
	}

	onBtnClick(btn) {
		let color = window.getComputedStyle(btn).backgroundColor;
		this.changeTextileColor(color);
	}

	changeTextileColor(color) {
		let textil = this.shoe.getObjectByName('UP', true).material;
		let targetColor = new THREE.Color(color);
		gsap.to(textil.color, 1.5, {
			r: targetColor.r,
			g: targetColor.g,
			b: targetColor.b,
			ease: Power1.easeOut,
		});
	}

	onWindowResize() {
		let left = 0,
			width = window.innerWidth,
			top = 0,
			height = window.innerHeight;
		this.shoe.position.set(
			left - window.innerWidth / 2 + width / 2,
			-top + window.innerHeight / 2 - height / 2
		);
	}

	initColorPicker() {
		this.colorPicker = new iro.ColorPicker('#picker', {
			handleSvg: '#handle',
			handleProps: { x: 0, y: -20 },
			layout: [
				{
					component: iro.ui.Slider,
					options: {
						// can also be 'saturation', 'value', 'red', 'green', 'blue', 'alpha' or 'kelvin'
						sliderType: 'hue',
					},
				},
				{
					component: iro.ui.Slider,
					options: {
						// can also be 'saturation', 'value', 'red', 'green', 'blue', 'alpha' or 'kelvin'
						sliderType: 'saturation',
					},
				},
				{
					component: iro.ui.Slider,
					options: {
						// can also be 'saturation', 'value', 'red', 'green', 'blue', 'alpha' or 'kelvin'
						sliderType: 'value',
					},
				},
			],
		});
		this.colorPicker.color.hsl = { h: 350, s: 0, l: 70 };
		this.changeTextileColor(this.colorPicker.color.hexString);

		this.colorPicker.on('color:change', (color) => {
			// log the current color as a HEX string
			this.changeTextileColor(color.hexString);
		});
		/*		this.colorPicker = new ColorPicker({
			el: '#custom-color',
			width: 45,
		});
		let $toggle = document.querySelector('#color-select .custom-color .toggle');
		let isOpen = false;

		//hide or show
		$toggle.addEventListener('click', () => {
			if (isOpen == false ) {
				this.colorPicker.$el.style.display = 'block';
				this.colorPicker.onChange( (hexa) => this.changeTextileColor(hexa) );
				isOpen = true;
			} else {
				this.colorPicker.$el.style.display = 'none';
				isOpen = false;
			}
		});*/
	}
}
