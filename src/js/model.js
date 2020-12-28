import THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import shoeFile from '../assets/model/shoes.gltf';



export default class Model{
	constructor(scene){

		this.scene = scene;
		this.loader = new GLTFLoader();
		this.importModel();
	}

	importModel() {
		//const url = '../assets/model/shoes.gltf';
		this.loader.load( shoeFile, ( gltf ) => {
			this.shoe = gltf.scene.children[0];
			console.log(this.shoe);
			this.scene.scene.add( this.shoe );

		}, undefined, ( error ) => {
			console.error( error );
		});
	}

	update(){
		this.shoe.rotation.y += 0.01;
	}
}