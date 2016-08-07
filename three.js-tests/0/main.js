// events

window.addEventListener('load', init, false);
window.addEventListener('resize', updateResolution, false );

// variables

var WIDTH, HEIGHT;
var VIEW_ANGLE, ASPECT, NEAR, FAR;

var renderer, camera, scene;

var stats;

// initialize

function init () {
	// set the scene size
	WIDTH = window.innerWidth;
	HEIGHT = window.innerHeight;

	// set some camera attributes
	VIEW_ANGLE = 45;
	ASPECT = WIDTH / HEIGHT;
	NEAR = 0.1;
	FAR = 10000;


	// create a WebGL renderer, camera
	// and a scene
	renderer = new THREE.WebGLRenderer();
	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;

	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

	scene = new THREE.Scene();

	// add the camera to the scene
	scene.add(camera);

	// the camera starts at 0,0,0
	camera.position.y = -40;
	camera.position.z = 30;
	camera.rotation.x = Math.PI/3;

	// start the renderer
	renderer.setSize(WIDTH, HEIGHT);

	// attach the render-supplied DOM element
	document.body.appendChild(renderer.domElement);

	// call
	initAudio();
	initStats();
	makePlane();
	makeLight();
	loop();
}

function initStats () {
	stats = new Stats();
	stats.setMode(0); // 0: fps, 1: ms

	// Align top-left
	stats.domElement.style.position = 'fixed';
	stats.domElement.style.left = '0';
	stats.domElement.style.top = '0';

	document.body.appendChild( stats.domElement );
}

// stuff

function updateResolution(){
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

window.onkeydown = function (e) {
	switch (e.keyCode) {
		case 85:
			var url = prompt('URL? [song.mp3]')
			audio.src = url || 'song.mp3';
			location.hash = url || '';
		break;
	}
}

// prepare objects

var plane;
function makePlane () {
	texture = THREE.ImageUtils.loadTexture("texture4.jpg");
	var geometry = new THREE.PlaneGeometry(32,32,32,32);
	var material = new THREE.MeshPhongMaterial({
		color: 0xFFFFFF,
		map: texture,
		side: THREE.DoubleSide
	});

	geometry.dynamic = true;

	plane = new THREE.Mesh(geometry, material);
	plane.castShadow = true;
	plane.receiveShadow = true;
	scene.add(plane);
}

// prepare light

var pointLight;
function makeLight () {
	// create a point light
	pointLight = new THREE.SpotLight(0xAAAAFF);

	// set its position
	pointLight.position.x = 20;
	pointLight.position.y = -100;
	pointLight.position.z = 20;

	pointLight.castShadow = true;
	pointLight.shadowDarkness = 0.8;

	// pointLight.shadowCameraVisible = true;

	// add to the scene
	scene.add(pointLight);
}

// render that stuff

function loop () {
	window.requestAnimationFrame(loop);
	stats.begin();
	update();
	renderer.render(scene, camera);
	stats.end();
}

// update

var lastTime = new Date().getTime();
var rotationFlip = false;
function update () {
	// time
	var time = (new Date()).getTime();
	var timeDiff = time - lastTime;
	var angleChange = 0.00025 * timeDiff;
	plane.rotation.z = rotationFlip?plane.rotation.z-angleChange:plane.rotation.z+angleChange;
	if (plane.rotation.z > Math.PI/3) {
		rotationFlip = true;
	} else if (plane.rotation.z < -Math.PI/3) {
		rotationFlip = false;
	}
	lastTime = time;

	// audio
	analyser.getByteFrequencyData(fbcArray);

	pointLight.position.z = average();

	// update plane

	for (var i = 0; i < 1024; i++) {
		plane.geometry.vertices[i].z = fbcArray[i]/8;
	}

	plane.geometry.verticesNeedUpdate = true;
	plane.geometry.elementsNeedUpdate = true;
	plane.geometry.normalsNeedUpdate = true;
}

// audio

function average () {
	var value = 0;
	for (var i = 0; i < 1024; i++) {
		value += fbcArray[i];
	}
	return value/1024;
}

// create audio object
var audio = new Audio();
audio.src = location.hash.substring(1) || 'song.mp3';
audio.controls = true;
audio.loop = true;
audio.autoplay = true;
audio.volume = 0.2;

var context, analyser, source, fbcArray;

function initAudio () {
	// setup audio
	document.body.appendChild(audio);
	context = new AudioContext();
	analyser = context.createAnalyser();
	source = context.createMediaElementSource(audio);
	source.connect(analyser);
	analyser.connect(context.destination);

	fbcArray = new Uint8Array(analyser.frequencyBinCount);
}
