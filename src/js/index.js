import Scene from './scene';
import {gsap, Power3} from 'gsap';


let scene = new Scene();






//loading
let $counter = document.querySelector('.loader-screen .counter .number');
let loadingComplete = false;

//sceneEvents
scene.on('load', ev => loadHandle(ev, 3) );
scene.on('complete', () => completeHandle() );

let closeLoader = gsap.timeline({
	paused: true,
	onComplete: () => {
		document.querySelector('.loader-screen').remove();
	}
});

closeLoader.to('.loader-screen', 1, {
	opacity: 0,
});


//actions
function loadHandle (value, time) {
	console.log(value);
	gsap.to($counter, time, {
		textContent: value * 100,
		snap: 'textContent',
		ease: Power3.easeOut,
		onComplete: () => {
			loadingComplete && closeLoader.play();
		}
	});
}

function completeHandle () {
	loadingComplete = true;
	//loadHandle(1, 4);
}







