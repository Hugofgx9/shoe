import {gsap, Power3} from 'gsap';

const load = (scene) => {

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
		gsap.to($counter, time, {
			textContent: value * 100,
			snap: 'textContent',
			ease: Power3.easeOut,
			onComplete: () => {
				($counter.textContent == 100 && loadingComplete) && closeLoader.play();
			}
		});
	}

	function completeHandle () {
		loadingComplete = true;
	}
};

export default load;


