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
	camera.position.y = 1;
	camera.position.z = 10;
	camera.rotation.x = 0;

	// start the renderer
	renderer.setSize(WIDTH, HEIGHT);

	// attach the render-supplied DOM element
	document.body.appendChild(renderer.domElement);

	// call
	initStats();
	loadHouse();
	makeLight();
	// loop();
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

// prepare light

var pointLight;
function makeLight () {
	// create a point light
	pointLight = new THREE.SpotLight(0xFFFFFF);

	// set its position
	pointLight.position.x = 10;
	pointLight.position.y = 0;
	pointLight.position.z = 50;

	pointLight.castShadow = true;
	pointLight.shadowDarkness = 0.8;

	// pointLight.shadowCameraVisible = true;

	// add to the scene
	scene.add(pointLight);
}

var house;
function loadHouse () {
	loader = new THREE.JSONLoader();

	loader.load( "house.js", function(geometry, materials) {
		for (var i = materials.length - 1; i >= 0; i--) {
			materials[i].shading = THREE.FlatShading;
		};
		house = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
		// house.scale.set( 10, 10, 10 );
		house.position.y = 0;
		house.position.x = 0;
		// house.receiveShadows = true;
		// house.castShadow = true;
	} );

	loader.onLoadComplete = function () {
		scene.add(house);
		loop()
	} 
}

// render that stuff

function loop () {
	window.requestAnimationFrame(loop);
	stats.begin();
	update();
	renderer.render(scene, camera);
	stats.end();
}

var iteration = 0;
function update () {
	iteration++;
	house.rotation.y = iteration*0.01;
	house.position.y = Math.sin(iteration*0.01);
}
