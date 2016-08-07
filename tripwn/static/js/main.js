/*--------------------events--------------------*/

window.addEventListener('load', init, false);
window.addEventListener('resize', updateResolution, false );
document.addEventListener('click', raycast, false);

/*--------------------constants--------------------*/
// computed
var sq3 = Math.sqrt(3);
var pi2 = Math.PI*2;

// custom
var colors = [{
	mesh: 0xDDDDDD,
	details: {
		rotate: 0x444444,
		shift: 0x444444,
		wall: 0x444444
	}
},{
	mesh: 0xFFDC00,
	details: {
		rotate: 0xFF851B,
		shift: 0xFF851B,
		wall: 0xFF851B
	}
},{
	mesh: 0x801515,
	details: {
		rotate: 0xAA3939,
		shift: 0xAA3939,
		wall: 0x550000
	}
},{
	mesh: 0x659933,
	details: {
		rotate: 0x427213,
		shift: 0x427213,
		wall: 0x254C00
	}
}];

var UPSCALE_FACTOR = 1;
var ANIMATION_SPEED = 5000;
var SHAKE_CAMERA = true; if (localStorage.disableShake == 'true') SHAKE_CAMERA = false;
var AA_ENABLED = true; if (localStorage.disableAA == 'true') AA_ENABLED = false;
var STATS_ENABLED = false;
var USE_THREE_CLOCK = true;

/*--------------------variables--------------------*/
// three.js
var WIDTH, HEIGHT;
var VIEW_ANGLE, ASPECT, NEAR, FAR;

var renderer, camera, scene;

var cameraCenter;

// stats.js
var stats;

/*--------------------initialize--------------------*/

function init () {
	// set the scene size
	WIDTH = window.innerWidth*UPSCALE_FACTOR;
	HEIGHT = window.innerHeight*UPSCALE_FACTOR;

	// set some camera attributes
	VIEW_ANGLE = 45;
	ASPECT = WIDTH / HEIGHT;
	NEAR = 0.1;
	FAR = 10000;


	// create WebGL renderer, camera, scene and raycasting projector
	renderer = new THREE.WebGLRenderer({antialias: AA_ENABLED});
	renderer.autoClear = false;

	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

	scene = new THREE.Scene();
	sceneDetails = new THREE.Scene();
	sceneOrtho = new THREE.Scene();

	cameraOrtho = new THREE.OrthographicCamera( - WIDTH / 2, WIDTH / 2, HEIGHT / 2, - HEIGHT / 2, 1, 10 );
	cameraOrtho.position.z = 10;

	projector = new THREE.Projector();

	// add the camera to the scene
	scene.add(camera);

	// the camera starts at 0,0,0
	cameraCenter = new THREE.Vector3(0.0,0.0,0.0)
	camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = 5;
	camera.lookAt(cameraCenter);

	// start the renderer
	renderer.setSize(WIDTH, HEIGHT);

	// attach the render-supplied DOM element
	document.body.appendChild(renderer.domElement);
	
	// prepare meshes
	prepareTriangle();
	prepareSquare();

	// prepare materials
	prepareColors();

	// generate example map
	var types = ['default', 'shift', 'wall', 'rotate'];

	for (var x = -5; x < 5; x++) {
		for (var y = -5; y < 5; y++) {
			for (var z = 0; z < 2; z++) {
				var type = types[Math.floor(Math.random()*types.length)];
				var color = Math.floor(Math.random()*colors.length);
				makeTriangle({
					coords: [x,y,z],
					type: type,
					color: color
				});
			}
		}
	}

	// make light
	makeLight();
	makeUI();

	// hud
	initHUD();

	// net stuff
	initNet();

	// start it
	STATS_ENABLED && initStats();
	initClock();
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

var clock;
function initClock () {
	if (USE_THREE_CLOCK) {
		clock = new THREE.Clock();
		clock.start();
	} else {
		clock = performance.now();
	}
}

/*--------------------utils--------------------*/

function updateResolution () {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth*UPSCALE_FACTOR, window.innerHeight*UPSCALE_FACTOR);
}

function toCartesianCoords (coords) {
	var r = [];
	r[0] = coords[0]*0.5-coords[1]*0.5;// x
	r[1] = (coords[2]?-sq3/3:0) + coords[0]*sq3/2 + coords[1]*sq3/2;// y

	return r;
}

function requestPointerLock () {
	var body = document.getElementsByTagName('body')[0];
	body.requestPointerLock = body.requestPointerLock || body.mozRequestPointerLock || body.webkitRequestPointerLock;
	body.requestPointerLock();
}

function raycast () {
	var vector = new THREE.Vector3((event.clientX/window.innerWidth)*2-1, -(event.clientY/window.innerHeight)*2+1, 0.5);
	projector.unprojectVector(vector, camera);

	var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

	var intersects = raycaster.intersectObjects(triangleRaycast);

	if (intersects.length > 0) {

		intersects[0].object.material.color.setHex(Math.random()*0xffffff);

		// particle.position.copy( intersects[ 0 ].point );
	}
	raycastUI(event.clientX, event.clientY);
}

function raycastUI (x, y) {
	var element = document.elementFromPoint(x, y);
	if (element !== renderer.domElement) { // ui click
		
	} else { // renderer click
		
	}
}

function hasCoords (triangle, coords) {
	if (triangle.coords[0] != coords[0]) return false;
	if (triangle.coords[1] != coords[1]) return false;
	if (triangle.coords[2] != coords[2]) return false;
	return true; 
}

/*--------------------scene--------------------*/

// load all images
var textures = {
	resources: {
		metal: THREE.ImageUtils.loadTexture('png/resources/metal.png'),
		trosphat: THREE.ImageUtils.loadTexture('png/resources/trosphat.png'),
		energy: THREE.ImageUtils.loadTexture('png/resources/energy.png')
	},
	// details: {
	// 	wall: THREE.ImageUtils.loadTexture('png/details/wall.png'),
	// 	rotate: THREE.ImageUtils.loadTexture('png/details/rotate.png'),
	// 	shift: THREE.ImageUtils.loadTexture('png/details/shift.png')
	// },
	mesh: THREE.ImageUtils.loadTexture('png/mesh.png')
}

// square
var squareGeometry = new THREE.Geometry();

// makeLight

// makeTriangle
var triangles = [];
var triangleRaycast = [];
var triangleGeometry = new THREE.Geometry();

// functions

function makeUI () {
	var text = "Hello World.";
	var quality = 100;
	var canvas1 = document.createElement('canvas');
	canvas1.height = 2*quality;
	canvas1.width = 5*quality;
    var context1 = canvas1.getContext('2d');
    context1.font = 'Bold ' + 2*quality + 'px Arial';
    context1.fillStyle = "rgba(255,0,0,0.8)";
    context1.fillText(text, 0, 1.5*quality, 5*quality);

    var texture1 = new THREE.Texture(canvas1);
    texture1.needsUpdate = true;

    var material1 = new THREE.MeshLambertMaterial( { map: texture1 } );
    material1.transparent = true;

    var mesh1 = new THREE.Mesh(
        new THREE.PlaneGeometry(5, 2),
        material1
    );

    mesh1.position.set(0, 0, 2);

    sceneDetails.add( mesh1 );
}

var sceneLight;
var sceneDetailsLight;
function makeLight () {
	sceneLight = new THREE.DirectionalLight(0xffffff, 1.0);
	sceneLight.position.set(0, 0, 1);
	scene.add(sceneLight);
	
	sceneDetailsLight = new THREE.DirectionalLight(0xffffff, 1.0);
	sceneDetailsLight.position.set(0, 0, 1);
	sceneDetails.add(sceneDetailsLight);
}

function prepareColors () {
	for (var i = 0, len = colors.length; i < len; i++) { // #todo - check if this really is faster
		colors[i].meshMaterial = new THREE.MeshLambertMaterial({
			map: textures.mesh,
			color: colors[i].mesh
		});
		colors[i].details.rotateMaterial = new THREE.MeshLambertMaterial({
			// map: textures.details.rotate
			opacity: 0.5,
			transparent: true,
			color: colors[i].details.rotate
		});
		colors[i].details.shiftMaterial = new THREE.MeshLambertMaterial({
			// map: textures.details.shift
			opacity: 0.5,
			transparent: true,
			color: colors[i].details.shift
		});
		colors[i].details.wallMaterial = new THREE.MeshLambertMaterial({
			// map: textures.details.wall
			opacity: 0.5,
			transparent: true,
			color: colors[i].details.wall
		});
	}
}

function prepareSquare () {
	squareGeometry.vertices.push(new THREE.Vector3(-0.5,  0.5, 0.0));
	squareGeometry.vertices.push(new THREE.Vector3( 0.5,  0.5, 0.0));
	squareGeometry.vertices.push(new THREE.Vector3( 0.5, -0.5, 0.0));
	squareGeometry.vertices.push(new THREE.Vector3(-0.5, -0.5, 0.0));
	squareGeometry.faces.push(new THREE.Face4(0, 1, 2, 3));
	squareGeometry.computeFaceNormals();
	squareGeometry.computeVertexNormals();

	// fix from https://stackoverflow.com/questions/20774648/three-js-generate-uv-coordinate
	squareGeometry.faceVertexUvs[0] = [];
	squareGeometry.computeBoundingBox();
	var max = squareGeometry.boundingBox.max,
		min = squareGeometry.boundingBox.min;
	var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
	var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
	for (i = 0; i < squareGeometry.faces.length; i++) {
		var v1 = squareGeometry.vertices[squareGeometry.faces[i].a], v2 = squareGeometry.vertices[squareGeometry.faces[i].b], v3 = squareGeometry.vertices[squareGeometry.faces[i].c];
		squareGeometry.faceVertexUvs[0].push([
			new THREE.Vector2((v1.x + offset.x)/range.x ,(v1.y + offset.y)/range.y),
			new THREE.Vector2((v2.x + offset.x)/range.x ,(v2.y + offset.y)/range.y),
			new THREE.Vector2((v3.x + offset.x)/range.x ,(v3.y + offset.y)/range.y)
		]);
	}
	squareGeometry.uvsNeedUpdate = true;
}

function prepareTriangle () {
	triangleGeometry.vertices.push(new THREE.Vector3(-0.5, -sq3/6, 0));
	triangleGeometry.vertices.push(new THREE.Vector3(0.5, -sq3/6, 0));
	triangleGeometry.vertices.push(new THREE.Vector3(0, sq3/3, 0));

	triangleGeometry.faces.push(new THREE.Face3(0, 1, 2));
	triangleGeometry.computeFaceNormals();
	triangleGeometry.computeVertexNormals();

	// fix from https://stackoverflow.com/questions/20774648/three-js-generate-uv-coordinate
	triangleGeometry.faceVertexUvs[0] = [];
	triangleGeometry.computeBoundingBox();
	var max = triangleGeometry.boundingBox.max,
		min = triangleGeometry.boundingBox.min;
	var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
	var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
	for (i = 0; i < triangleGeometry.faces.length; i++) {
		var v1 = triangleGeometry.vertices[triangleGeometry.faces[i].a], v2 = triangleGeometry.vertices[triangleGeometry.faces[i].b], v3 = triangleGeometry.vertices[triangleGeometry.faces[i].c];
		triangleGeometry.faceVertexUvs[0].push([
			new THREE.Vector2((v1.x + offset.x)/range.x ,(v1.y + offset.y)/range.y),
			new THREE.Vector2((v2.x + offset.x)/range.x ,(v2.y + offset.y)/range.y),
			new THREE.Vector2((v3.x + offset.x)/range.x ,(v3.y + offset.y)/range.y)
		]);
	}
	triangleGeometry.uvsNeedUpdate = true;
}

function makeTriangle (properties) {
	var triangle = {
		coords: properties.coords,
		details: [],
		type: properties.type,
		container: new THREE.Object3D(),
		detailContainer: new THREE.Object3D(),
		mesh: new THREE.Mesh(triangleGeometry, colors[properties.color].meshMaterial)
	};

	var cartesianCoords = toCartesianCoords(properties.coords);

	// move it
	triangle.container.position.x = cartesianCoords[0];
	triangle.container.position.y = cartesianCoords[1];

	triangle.detailContainer.position.x = cartesianCoords[0];
	triangle.detailContainer.position.y = cartesianCoords[1];

	// scale it
	triangle.container.scale.set(0.95, 0.95, 0.95);
	triangle.detailContainer.scale.set(0.95, 0.95, 0.95);

	if (properties.coords[2]) { // isFlipped
		triangle.container.rotation.z = Math.PI;
		triangle.detailContainer.rotation.z = Math.PI;
	}

	switch (properties.type) {
		case 'rotate':
			var detail = new THREE.Mesh(triangleGeometry, colors[properties.color].details.rotateMaterial);
			detail.position.set(0, 0, 0);

			// add to containers
			triangle.detailContainer.add(detail);
			triangle.details.push(detail);
		break;
		case 'shift':
			var detail1 = new THREE.Mesh(triangleGeometry, colors[properties.color].details.shiftMaterial);
			var detail2 = new THREE.Mesh(triangleGeometry, colors[properties.color].details.shiftMaterial);	

			// initial positions
			detail1.position.x = 0;
			detail1.position.y = sq3/6;

			detail2.position.x = -0.25;
			detail2.position.y = -sq3/12;
			
			detail1.position.z = 0;
			detail2.position.z = 0;

			// initial scale
			detail1.scale.set(0.5, 0.5, 0.5);
			detail2.scale.set(0.5, 0.5, 0.5);

			// add to containers
			triangle.detailContainer.add(detail1);
			triangle.detailContainer.add(detail2);
			triangle.details.push(detail1);
			triangle.details.push(detail2);
		break;
		case 'wall':
			var detail = new THREE.Mesh(triangleGeometry, colors[properties.color].details.wallMaterial);
			detail.position.x = .125;
			detail.position.y = -sq3/24;
			detail.position.z = 0;
			detail.scale.set(0.75, 0.75, 0.75);

			// colors #dirtyFix #todo
			// triangle.mesh.material.color.setHex(colors[properties.color].details.wall);

			// add to containers
			triangle.detailContainer.add(detail);
			triangle.detailContainer.add(detail);
			triangle.details.push(detail);
		break;
		default: break;
	}

	triangle.container.add(triangle.mesh);
	scene.add(triangle.container);
	sceneDetails.add(triangle.detailContainer);
	triangles.push(triangle);
	triangleRaycast.push(triangle.mesh);
}

/*--------------------renderer--------------------*/

function loop () {
	window.requestAnimationFrame(loop);
	// begin frame
	STATS_ENABLED && stats.begin();

	// update time
	USE_THREE_CLOCK && update((clock.getElapsedTime()*1000)%ANIMATION_SPEED/ANIMATION_SPEED);
	!USE_THREE_CLOCK && update((performance.now()-clock)%ANIMATION_SPEED/ANIMATION_SPEED);
	
	// render
	renderer.clear(); // maybe not needed
	renderer.render(scene, camera);
	renderer.clearDepth();
	renderer.render(sceneDetails, camera);
	renderer.clearDepth();
	renderer.render(sceneOrtho, cameraOrtho);
	
	// end frame
	STATS_ENABLED && stats.end();
}

var v1, v2, v3, v4, v5, v6, v7, v8; // memalloc
var d1, d2, d3, d4, d5, d6, d7, d8; // memalloc
function update (t) {
	if (SHAKE_CAMERA) {
		camera.position.z = Math.sin(t*pi2)+5;
		camera.position.y = Math.sin(t*pi2)*2;
		camera.position.x = Math.cos(t*pi2)*2;
		// camera.lookAt(cameraCenter);
	}

	for (var i = 0; i < triangles.length; i++) {
		switch(triangles[i].type) {
			case 'rotate':
				v1 = (t*pi2)%(pi2/3); // alpha mod 120°
				v2 = 1/(2*Math.sin(v1+Math.PI/6)); // scale
				triangles[i].details[0].rotation.z = v1;
				triangles[i].details[0].scale.set(v2, v2, v2); // maybeSlow
			break;
			case 'shift':
				d1 = triangles[i].details[0];
				d2 = triangles[i].details[1];

				// needs 3 moves
				switch (Math.floor(t*3)) {
					case 0:
						v1 = (t*3)%3;
						//fixed
						d1.position.x = 0;
						d1.position.y = sq3/6;
						//moving
						d2.position.x = -0.25+v1/2;
						d2.position.y = -sq3/12;
					break;
					case 1:
						v1 = (t*3-1)%3;
						//fixed
						d1.position.x = 0.25;
						d1.position.y = -sq3/12;
						//moving
						d2.position.x = -v1/4;
						d2.position.y = sq3/6-v1*3*sq3/12;
					break;
					case 2:
						v1 = (t*3-2)%3;
						//fixed
						d1.position.x = -0.25;
						d1.position.y = -sq3/12;
						//moving
						d2.position.x = 0.25-v1/4;
						d2.position.y = -sq3/12+v1*3*sq3/12;
					break;
				}
			break;
		}
	}
}
