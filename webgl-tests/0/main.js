// context
var canvas, gl;

// GLSL
var shaderProgram;

// model-view matrix
var mvMatrix  = mat4.create();
mvMatrixStack = [];

// perspective matrix
var pMatrix = mat4.create();

window.onload = function () {
	// get canvas
	canvas = document.getElementsByTagName('canvas')[0];

	// create webgl context
	gl = WebGLUtils.setupWebGL(canvas);
	
	// update dimensions
	updateDimensions();

	// run pre-render functions
	initShaders();
	initBuffers();

	// set background color
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);

	// start render loop
	render();
}

window.onresize = updateDimensions;
function updateDimensions () {
	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth;
	gl.viewportWidth = canvas.width;
	gl.viewportHeight = canvas.height;
}

var elements = [];
function initBuffers () {
	var amount = prompt('amount? [500]') || 500;
	for (var i = 0; i < amount; i++) {
		elements[i] = {
			rotX: 0,
			rotY: 2*Math.PI*i/amount+Math.random()/1000,
			rotZ: 2*Math.PI*i/amount+Math.random()/1000,
			tick: function () {
				this.rotY += 0.05;
			}
		};

		// shorthand for elements[i]
		var e = elements[i];
		
		// create vertex position buffer
		e.vertexPositionBuffer = gl.createBuffer();
		
		// bind it
		gl.bindBuffer(gl.ARRAY_BUFFER, e.vertexPositionBuffer);
		
		// data
		e.vertices = [
			 0.0,  1.0,  0.0,
			-1.0, -1.0,  0.0,
			 1.0, -1.0,  0.0
		];

		// fill buffer with positions
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(e.vertices), gl.STATIC_DRAW);
		e.vertexPositionBuffer.itemSize = 3;
		e.vertexPositionBuffer.numItems = 3;

		// create vertex color buffer
		e.vertexColorBuffer = gl.createBuffer();

		// bind it
		gl.bindBuffer(gl.ARRAY_BUFFER, e.vertexColorBuffer);

		// data
		e.colors = [
			 1.0, 0.0, 0.0, 1.0,
			 0.0, 1.0, 0.0, 1.0,
			 0.0, 0.0, 1.0, 1.0
		];
		
		// fill buffer with colors
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(e.colors), gl.STATIC_DRAW);
		e.vertexColorBuffer.itemSize = 4;
		e.vertexColorBuffer.numItems = 3;
	}
}

function render() {
	// get animation frame for next render
	window.requestAnimFrame(render, canvas);

	// set resolution
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	
	// clear buffers
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// update pMatrix
	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

	// update mvMatrix
	mat4.identity(mvMatrix);
	mat4.translate(mvMatrix, [0.0, 0.0, -10.0]);

	// render triangles
	for (var i = 0; i < elements.length; i++) {
		mvPushMatrix();
		var e = elements[i];

		e.tick();

		mat4.rotate(mvMatrix, e.rotX, [1, 0, 0]);
		mat4.rotate(mvMatrix, e.rotY, [0, 1, 0]);
		mat4.rotate(mvMatrix, e.rotZ, [0, 0, 1]);

		// positions
		gl.bindBuffer(gl.ARRAY_BUFFER, e.vertexPositionBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, e.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

		// colors
		gl.bindBuffer(gl.ARRAY_BUFFER, e.vertexColorBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, e.vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

		// push uniforms to gpu
		setMatrixUniforms();
		
		// draw
		gl.drawArrays(gl.TRIANGLES, 0, e.vertexPositionBuffer.numItems);

		mvPopMatrix();
	}
}

// Matrix Uniforms
function setMatrixUniforms() {
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

/*----------helper functions----------*/

// Matrix Stack
function mvPushMatrix() {
	var copy = mat4.create();
	mat4.set(mvMatrix, copy);
	mvMatrixStack.push(copy);
}

function mvPopMatrix() {
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
		alert(gl.getShaderInfoLog(shader));
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

	// tell shaders to use Colors
	shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
	gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

	// use JS to attach Uniforms to shaderProgram
	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
}
