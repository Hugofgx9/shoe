import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import shoeFile from '../assets/model/Shoe.gltf';



export default class Model{
	constructor(scene){

		this.scene = scene;
		this.loader = new GLTFLoader();
		this.importModel();
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
			this.shoe.children.map((child) => child.material = this.material)
			//this.shoe.material = this.material;
			this.scene.scene.add( this.shoe );
			this.shoeCreated = true;


		}, undefined, ( error ) => {
			console.error( error );
		});
	}

	update(){
		if ( this.shoeCreated == true ) {
			this.shoe.rotation.y += 0.01;
			this.shoe.rotation.x += 0.01;
		}
	}
}