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
	
	// vertex normals
	this.vertexNormals = [];
	this.vertexNormalBuffer = gl.createBuffer();
	this.vertexNormalBuffer.itemSize = 3;
	this.vertexNormalBuffer.numItems = 0;

	this.vertexPositionBuffer.itemSize = 3;
	this.vertexPositionBuffer.numItems = 0;

	function f (i,j) {
		return Math.sin(j/3)+Math.cos(i/3);
	}

	function n (i,j) {
		return [-Math.cos(i/3),-Math.cos(j/3),1];
	}

	var flip = false;
	var n0 = 0;
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
				
				n0 = n(j/2,i*h);
				this.vertexNormals.push(n0[0]);
				this.vertexNormals.push(n0[1]);
				this.vertexNormals.push(n0[2]);
				this.vertexNormalBuffer.numItems++;

				// right
				this.vertices.push(j/2+1);
				this.vertices.push(i*h);
				this.vertices.push(f(i,j+1));
				this.vertexPositionBuffer.numItems++;
				
				n0 = n(j/2+1,i*h);
				this.vertexNormals.push(n0[0]);
				this.vertexNormals.push(n0[1]);
				this.vertexNormals.push(n0[2]);
				this.vertexNormalBuffer.numItems++;
				
				// top
				this.vertices.push(j/2+.5);
				this.vertices.push((i+1)*h);
				this.vertices.push(f(i+1,j));
				this.vertexPositionBuffer.numItems++;

				n0 = n(j/2+.5,(i+1)*h);
				this.vertexNormals.push(n0[0]);
				this.vertexNormals.push(n0[1]);
				this.vertexNormals.push(n0[2]);
				this.vertexNormalBuffer.numItems++;
			} else {
				// left
				this.vertices.push(j/2);
				this.vertices.push((i+1)*h);
				this.vertices.push(f(i+1,j-1));
				this.vertexPositionBuffer.numItems++;

				n0 = n(j/2,(i+1)*h);
				this.vertexNormals.push(n0[0]);
				this.vertexNormals.push(n0[1]);
				this.vertexNormals.push(n0[2]);
				this.vertexNormalBuffer.numItems++;

				// right
				this.vertices.push(j/2+1);
				this.vertices.push((i+1)*h);
				this.vertices.push(f(i+1,j+1));
				this.vertexPositionBuffer.numItems++;

				n0 = n(j/2+1,(i+1)*h);
				this.vertexNormals.push(n0[0]);
				this.vertexNormals.push(n0[1]);
				this.vertexNormals.push(n0[2]);
				this.vertexNormalBuffer.numItems++;

				// bottom
				this.vertices.push(j/2+.5);
				this.vertices.push(i*h);
				this.vertices.push(f(i,j));
				this.vertexPositionBuffer.numItems++;

				n0 = n(j/2+.5,i*h);
				this.vertexNormals.push(n0[0]);
				this.vertexNormals.push(n0[1]);
				this.vertexNormals.push(n0[2]);
				this.vertexNormalBuffer.numItems++;
			}
		}
	}
	// scale
	for (var i = 0; i < this.vertices.length; i++) {
		this.vertices[i] /= 10;
	}

	// push to GPU
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

	// vertex normals
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexNormals), gl.STATIC_DRAW);
}
