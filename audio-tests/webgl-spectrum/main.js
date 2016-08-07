// context
var canvas, gl;

// GLSL
var shaderProgram;

// model-view matrix
var mvMatrix  = mat4.create();
mvMatrixStack = [];

// perspective matrix
var pMatrix = mat4.create();

window.onresize = updateDimensions;
function updateDimensions () {
	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth;
	gl.viewportWidth = canvas.width;
	gl.viewportHeight = canvas.height;
}

// implementing basic stupid zoom
var zoom = -50;
var rX = 0.3;
var rY = Math.PI/2;
var rZ = Math.PI/2;
window.onkeydown = function (e) {
	switch (e.keyCode) {
		case 107:
			zoom++;
		break;
		case 109:
			zoom--;
		break;
		case 85:
			var url = prompt('URL? [song.ogg]')
			audio.src = url || 'song.ogg';
			location.hash = url || '';
		break;
		default: console.log(e.keyCode);
	}
}

var elements = [];
function initElements () {
	var omgwtfbbq = 32;
	for (var x = -omgwtfbbq/2; x < omgwtfbbq/2; x++) {
		for (var z = -omgwtfbbq/2; z < omgwtfbbq/2; z++) {
			// Math.sin(x/3)*Math.cos(z/3)*2
			elements.push(new Pyramid(0,x,z));
		}
	}
	// elements.push(new Grid(128,128));
}

var fbcArray;
function render() {
	// get animation frame for next render
	window.requestAnimFrame(render, canvas);
	
	// start stats
	stats.begin();

	// get audio data
	analyser.getByteFrequencyData(fbcArray);
	
	// set resolution
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	
	// clear buffers
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// update pMatrix
	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

	// update mvMatrix
	mat4.identity(mvMatrix);
	mat4.translate(mvMatrix, [0.0, 0.0, zoom]);


	mat4.rotate(mvMatrix, rX, [1, 0, 0]);
	mat4.rotate(mvMatrix, rY, [0, 1, 0]);
	mat4.rotate(mvMatrix, rZ, [0, 0, 1]);

	// push lightning direction
	var lightingDirection = [10,0,0];
	var adjustedLD = vec3.create();
	vec3.normalize(lightingDirection, adjustedLD);
	vec3.scale(adjustedLD, -1);
	gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);

	var copy = mat4.create();
	mat4.set(mvMatrix, copy);

	setMatrixUniforms();
	
	// render triangles
	for (var i = 0; i < elements.length; i++) {
		mvMatrix.set(copy);

		var e = elements[i];

		mat4.translate(mvMatrix, [fbcArray[(e.pos[1]+16)*32+e.pos[2]+16]/16,e.pos[1],e.pos[2]]);

		// positions
		gl.bindBuffer(gl.ARRAY_BUFFER, e.vertexPositionBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, e.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

		// normals
		gl.bindBuffer(gl.ARRAY_BUFFER, e.vertexNormalBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, e.vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

		// push uniforms to gpu
		pushMVMatrix();

		// draw
		gl.drawArrays(gl.TRIANGLES, 0, e.vertexPositionBuffer.numItems);
	}

	if (rY >= Math.PI || rY <= 0) {
		flopRot = !flopRot;
	} 
	rY = flopRot?rY-0.005:rY+0.005;

	stats.end();

}
var flopRot = false;

// Matrix Uniforms
function setMatrixUniforms () {
	// push pMatrix & mvMatrix to GPU
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

	// create normalMatrix
	var normalMatrix = mat3.create();
	mat4.toInverseMat3(mvMatrix, normalMatrix);
	mat3.transpose(normalMatrix);
	
	// push normalMatrix to GPU
	gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
}

function pushMVMatrix () {
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

/*----------helper functions----------*/

// Matrix Stack
function mvPushMatrix () {
	var copy = mat4.create();
	mat4.set(mvMatrix, copy);
	mvMatrixStack.push(copy);
}

function mvPopMatrix () {
	if (mvMatrixStack.length == 0) {
		throw "Invalid popMatrix!";
	}
	mvMatrix = mvMatrixStack.pop();
}

// Shaders
function getShader(gl, id) {
	var shaderScript = document.getElementById(id);
	if (!shaderScript) {
		return null;
	}

	var str = shaderScript.innerHTML;

	var shader;
	if (shaderScript.type == "x-shader/x-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}

	gl.shaderSource(shader, str);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.error(gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}

function initShaders() {
	// get GLSL
	var fragmentShader = getShader(gl, "shader-fs");
	var vertexShader = getShader(gl, "shader-vs");

	// create shader program
	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}

	// tell GL to use shader program
	gl.useProgram(shaderProgram);

	// tell shaders to use Vertices
	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

	// tell shader to use normals
	shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
	gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

	// use JS to attach Uniforms to shaderProgram
	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");

	// lighting direction uniform
	shaderProgram.lightingDirectionUniform = gl.getUniformLocation(shaderProgram, "uLightingDirection");
}


// audio

// create audio object
var audio = new Audio();
audio.src = location.hash.substring(1) || 'song.ogg';
audio.controls = true;
audio.loop = true;
audio.autoplay = true;
audio.volume = 0.2;

// initialize
window.addEventListener('load', init, false);

var context, analyser, source, fbcArray;

function init () {
	// setup audio
	document.body.appendChild(audio);
	context = new AudioContext();
	analyser = context.createAnalyser();
	source = context.createMediaElementSource(audio);
	source.connect(analyser);
	analyser.connect(context.destination);

	fbcArray = new Uint8Array(analyser.frequencyBinCount);

	// setup WebGL
	// get canvas
	canvas = document.getElementsByTagName('canvas')[0];

	// create webgl context
	gl = WebGLUtils.setupWebGL(canvas);
	
	// update Dimensions
	updateDimensions();

	// run pre-render functions
	initStats();
	initShaders();
	initElements();

	// set background color
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);

	// run
	render();
}

var stats;
function initStats () {
	stats = new Stats();
	stats.setMode(0); // 0: fps, 1: ms

	// Align top-left
	stats.domElement.style.position = 'fixed';
	stats.domElement.style.left = '0';
	stats.domElement.style.top = '0';

	document.body.appendChild( stats.domElement );
}
