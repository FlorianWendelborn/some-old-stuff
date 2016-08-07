function Pyramid (x, y, z) {
	this.pos = [x, y, z];
	
	// create vertex position buffer
	this.vertexPositionBuffer = gl.createBuffer();
	
	// bind it
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
	
	// data
	this.vertices = [
		//
		-0.5, -0.5,  0.5,
		-0.5,  0.5,  0.5,
		 0.5,  0.0,  0.0,

		//
		-0.5, -0.5, -0.5,
		-0.5,  0.5, -0.5,
		 0.5,  0.0,  0.0,

		//
		-0.5,  0.5,  -0.5,
		-0.5,  0.5,  0.5,
		 0.5,  0.0,  0.0,

		//
		-0.5, -0.5,  0.5,
		-0.5, -0.5, -0.5,
		 0.5,  0.0,  0.0,

		//
		-0.5,  0.5, -0.5,
		-0.5,  0.5,  0.5,
		-0.5, -0.5, -0.5,

		//
		-0.5, -0.5,  0.5,
		-0.5,  0.5,  0.5,
		-0.5, -0.5, -0.5
	];
	this.vertexPositionBuffer.itemSize = 3;
	this.vertexPositionBuffer.numItems = 14;

	// push to GPU
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

	// vertex normals
	this.vertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
	this.vertexNormals = [
		1,0,0,
		0,1,0,
		0,0,1,
		1,0,0,
		0,1,0,
		0,0,1,
		1,0,0,
		0,1,0,
		0,0,1,
		1,0,0,
		0,1,0,
		0,0,1,
		1,0,0,
		0,1,0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexNormals), gl.STATIC_DRAW);
	this.vertexNormalBuffer.itemSize = 3;
	this.vertexNormalBuffer.numItems = 14;

}

function Grid (x, y) {
	this.pos = [0,0,0];
	
	// create vertex position buffer
	this.vertexPositionBuffer = gl.createBuffer();
	
	// bind it
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
	
	// data
	this.vertices = [];

	this.vertexPositionBuffer.itemSize = 3;
	this.vertexPositionBuffer.numItems = 0;

	function f (i,j) {
		return Math.sin(j/3);
	}

	var flip = false;
	var h = Math.sin(Math.PI/3);
	for (var i = 0; i < x; i++) {
		for (var j = 0; j < y; j++) {
			flip = !flip;
			if (flip) {
				// left
				this.vertices.push(j/2);
				this.vertices.push(i*h);
				this.vertices.push(f(i,j-1));
				this.vertexPositionBuffer.numItems++;

				// right
				this.vertices.push(j/2+1);
				this.vertices.push(i*h);
				this.vertices.push(f(i,j+1));
				this.vertexPositionBuffer.numItems++;

				// top
				this.vertices.push(j/2+.5);
				this.vertices.push((i+1)*h);
				this.vertices.push(f(i+1,j));
				this.vertexPositionBuffer.numItems++;
			} else {
				// left
				this.vertices.push(j/2);
				this.vertices.push((i+1)*h);
				this.vertices.push(f(i+1,j-1));
				this.vertexPositionBuffer.numItems++;

				// right
				this.vertices.push(j/2+1);
				this.vertices.push((i+1)*h);
				this.vertices.push(f(i+1,j+1));
				this.vertexPositionBuffer.numItems++;

				// bottom
				this.vertices.push(j/2+.5);
				this.vertices.push(i*h);
				this.vertices.push(f(i,j));
				this.vertexPositionBuffer.numItems++;
			}
		}
	}

	// push to GPU
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

	// vertex normals
	this.vertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);

	this.vertexNormals = [];

	this.vertexNormalBuffer.itemSize = 3;
	this.vertexNormalBuffer.numItems = 0;

	for (var i = 0; i < x; i++) {
		for (var j = 0; j < y; j++) {
			this.vertexNormals.push(0);
			this.vertexNormals.push(0);
			this.vertexNormals.push(1);
			this.vertexNormalBuffer.numItems++;
			this.vertexNormals.push(0);
			this.vertexNormals.push(0);
			this.vertexNormals.push(1);
			this.vertexNormalBuffer.numItems++;
			this.vertexNormals.push(0);
			this.vertexNormals.push(0);
			this.vertexNormals.push(1);
			this.vertexNormalBuffer.numItems++;
		}
	}

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexNormals), gl.STATIC_DRAW);
}
