import Scene from './scene';
import {gsap, Power3} from 'gsap';


let scene = new Scene();






//loading
let $counter = document.querySelector('.loader-screen .counter .number');
let loadingComplete = false;
scene.on('load', ev => loadHandle(ev));
scene.on('complete', () => { loadingComplete = true});

let closeLoader = gsap.timeline({
	paused: true,
	onComplete: () => {
		document.querySelector('.loader-screen').remove();
	}
});

closeLoader.to('.loader-screen', 1, {
	opacity: 0,
});

function loadHandle (value) {
	gsap.to($counter, 3, {
		textContent: value * 100,
		snap: 'textContent',
		ease: Power3.easeOut,
		onComplete: () => {
			loadingComplete && closeLoader.play();
		}
	});
}







