import * as THREE from 'three';
import gsap from 'gsap';
import { Power1 } from 'gsap/all';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import shoeFile from '../assets/model/Odyssey.gltf';
//import tissuTexture from '../assets/texture/tissuTexture.jpg';
//import { rotation3d } from './utils';

export default class Model{
	constructor(scene){

		this.scene = scene;
		this.GLTFloader = new GLTFLoader();
		this.loader = new THREE.TextureLoader();
		this.importModel();
		this.bindEvents();
		this.shoeCreated = false;
		this.movement = new THREE.Vector3();
	}

	importModel() {

		this.material = new THREE.MeshPhongMaterial( { color: 0xc30e2, shininess: 10, specular: 0x50507, emissive: 0x414889} );
		this.GLTFloader.load( shoeFile, ( gltf ) => {
			this.shoe = gltf.scene.children[0];
			// this.loader.load(tissuTexture, (texture) => {
			// 	this.shoe.children[1].material.map = texture;
			// });
			console.log(this.shoe);
			//this.shoe.children[1].material.color = new THREE.Color( 0.2, 0.2, 0.2 );
			//this.shoe.children[1].material.wireframe = true;
			let left = 50, width = window.innerWidth / 2, top = 0, height = window.innerHeight;
			this.shoe.position.set(left - window.innerWidth / 2 + width / 2, - top  + (window.innerHeight / 2) - (height / 2));


			this.scene.scene.add( this.shoe );

			// const shoeAxes = new THREE.AxesHelper( 300 );
			// this.shoe.add ( shoeAxes);

			// const sceneAxes = new THREE.AxesHelper( 300 );
			// this.scene.scene.add ( sceneAxes );

			this.shoeCreated = true;

		}, ( xhr ) => {
			console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
		}, ( error ) => {
			console.error( error );
		});
	}

	drag(e) {
		let speed = 0.0002;
		let newMovement = this.movement;
		newMovement.x += e.movementX;
		newMovement.y += e.movementY;

		gsap.to(this.movement, .3, {
			x: e.movementX,
			y: e.movementY,
			onUpdate: () => {
				this.rotateAroundWorldAxis(this.shoe, new THREE.Vector3(0, 1, 0), this.movement.x * speed);
				this.rotateAroundWorldAxis(this.shoe, new THREE.Vector3(1, 0, 0), this.movement.y * speed);
			}
		});
	}

	//changer pour aller à la valeur modulo machin la plus proche
	initRotation() {
		gsap.to(this.shoe.rotation, 5., {
			x: 0,
			y: 0,
			z: 0,
			ease: Power1.easeInOut,
		});

	}

	bindEvents() {
		let isDown = false;
		this.scene.container.addEventListener('mousedown', () => isDown = true );
		this.scene.container.addEventListener('mousemove', (e) => {
			if(isDown == true) {
				e.preventDefault();
				this.drag(e);
			}
		});
		this.scene.container.addEventListener('mouseup', () => isDown = false);
		this.scene.container.addEventListener('mouseleave', () => isDown = false );

	}

	update() {
		if ( this.shoeCreated == true ) {
			this.shoe.rotation.y += 0.005;
			this.shoe.rotation.x += 0.005;
		}
	}

	rotateAroundObjectAxis(object, axis, radians) {
		let rotationMatrix = new THREE.Matrix4();

		rotationMatrix.makeRotationAxis(axis.normalize(), radians);
		object.matrix.multiply(rotationMatrix);
		object.rotation.setFromRotationMatrix( object.matrix );

	}

	rotateAroundWorldAxis( object, axis, radians ) {

		let rotationMatrix = new THREE.Matrix4();

		rotationMatrix.makeRotationAxis( axis.normalize(), radians );
		rotationMatrix.multiply( object.matrix );                       // pre-multiply
		object.matrix = rotationMatrix;
		object.rotation.setFromRotationMatrix( object.matrix );
	}
}