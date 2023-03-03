import PCDLoader from './PCDLoader';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { BufferGeometry, Points, PointsMaterial } from 'three';

type Custom = string | string[] | null;

const pcdLoader = new PCDLoader();
//let queue: Custom = ['/test4.pcd', 'test3.pcd', 'test2.pcd'];

let queue: Custom = '/test4.pcd';

const successCallback = (points: Points<BufferGeometry, PointsMaterial>) => {
	const canvas = document.querySelector('#canvas')!;
	const scene = new THREE.Scene();
	const renderer = new THREE.WebGLRenderer({
		canvas,
		alpha: true,
		antialias: true,
	});

	renderer.setSize(canvas.clientWidth, canvas.clientHeight);
	const camera = new THREE.PerspectiveCamera(
		60,
		canvas.clientWidth / canvas.clientHeight,
		0.1,
		1000
	);
	camera.aspect = 1.6;
	const cameraPosition = new THREE.Vector3(0, 0, 0.8);
	camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
	points.material.color.set('#664EDE');
	points.geometry.center();
	points.rotateY(Math.PI);

	const boundingBox = points.geometry.boundingBox!;
	const measure = new THREE.Vector3();
	boundingBox.getSize(measure);

	const radius = 10;
	const radials = 16;
	const circles = 8;
	const divisions = 64;

	const helper = new THREE.PolarGridHelper(
		radius,
		radials,
		circles,
		divisions
	);

	scene.add(camera, points);

	const controls = new OrbitControls(camera, renderer.domElement);
	controls.enablePan = false;

	function setView(position: { x?: number; y?: number; z?: number } = {}) {
		const { x = 0, y = 0, z = 0 } = position;
		cameraPosition.set(x, y, z);
		controls.enabled = false;
	}

	const buttonTop = document.querySelector(
		'#button-top'
	) as HTMLButtonElement;
	const buttonFront = document.querySelector(
		'#button-front'
	) as HTMLButtonElement;
	const buttonSide = document.querySelector(
		'#button-side'
	) as HTMLButtonElement;

	buttonTop.addEventListener('click', () => setView({ y: measure.y }));
	buttonFront.addEventListener('click', () => setView({ z: 0.8 }));
	buttonSide.addEventListener('click', () => setView({ x: measure.x + 0.3 }));

	function animate() {
		controls.update();
		if (!controls.enabled) {
			camera.position.lerp(cameraPosition, 0.05);

			if (camera.position.distanceTo(cameraPosition) < 0.005) {
				controls.enabled = true;
			}
		}
		renderer.render(scene, camera);
		requestAnimationFrame(animate);
	}

	animate();
};

const errorCallback = (_: ErrorEvent) => {};

const load = (error?: ErrorEvent) => {
	let url: string;
	if (Array.isArray(queue)) {
		if (queue.length === 0) return;

		url = queue.shift()!;
	} else {
		if (queue == null) return;

		url = queue;
		queue = null;
	}

	if (error) errorCallback(error);

	pcdLoader.load(url, successCallback, undefined, load);
};

load();

const message = 'Hello World';

// Convert the message to an ArrayBuffer
const msgBuffer = new TextEncoder().encode(message);

// Hash the message
crypto.subtle
	.digest('SHA-512', msgBuffer)
	.then(function (hash) {
		// Convert the hash to a hex string
		const hashArray = Array.from(new Uint8Array(hash));
		const hashHex = hashArray
			.map(b => b.toString(16).padStart(2, '0'))
			.join('');
		console.log('SHA3-512 hash: ' + hashHex);
	})
	.catch(function (err) {
		console.error(err);
	});

