import * as THREE from 'three';
import gsap from 'gsap';
import { Power1 } from 'gsap/all';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import shoeFile from '../assets/model/shoeMat.gltf';
import { rotation3d } from './utils';

export default class Model{
	constructor(scene){

		this.scene = scene;
		this.loader = new GLTFLoader();
		this.importModel();
		this.bindEvents();
		this.shoeCreated = false; 
	}

	importModel() {

		this.material = new THREE.MeshPhongMaterial( { color: 0xc30e2, shininess: 10, specular: 0x50507, emissive: 0x414889} );
		//const geometry = new THREE.BoxGeometry( 1, 1, 1 );
		//this.shoe = new THREE.Mesh( geometry, this.material);
		//this.scene.scene.add(this.shoe);
		//const url = '../assets/model/shoes.gltf';
		this.loader.load( shoeFile, ( gltf ) => {
			this.shoe = gltf.scene.children[0];
			//this.shoe.children.map((child) => child.material = this.material)
			//this.shoe.material = this.material;
			console.log(this.shoe.rotation.z);
			this.scene.scene.add( this.shoe );

			const shoeAxes = new THREE.AxesHelper( 300 );
			this.shoe.add ( shoeAxes);

			const sceneAxes = new THREE.AxesHelper( 300 );
			this.scene.scene.add ( sceneAxes );

			this.shoeCreated = true;

		}, ( xhr ) => {
			console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
		}, ( error ) => {
			console.error( error );
		});
	}

	drag(e) {
		let movement = {x: e.movementY, y: e.movementX, z: 0};
		let shoeRotation = {x: this.shoe.rotation.x, y: this.shoe.rotation.y, z: this.shoe.rotation.z};
		let shoeNewRotation = rotation3d(movement, shoeRotation);
		gsap.to(this.shoe.rotation, 2., {
			x: `+= ${shoeNewRotation.x * 0.05}`,
			y: `+= ${shoeNewRotation.y * 0.05}`,
			z: `+= ${shoeNewRotation.z * 0.05}`,
			ease: Power1.easeOut,
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
		this.scene.container.addEventListener('mouseup', () => isDown = false );
		this.scene.container.addEventListener('mouseleave', () => isDown = false );

	}

	update() {
		if ( this.shoeCreated == true ) {
			//this.shoe.rotation.y += 0.01;
			//this.shoe.rotation.x += 0.01;
		}
	}
}