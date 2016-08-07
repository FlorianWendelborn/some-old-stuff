function Pyramid (x, y, z) {
	function n (A, B, C) {
		//Set Vector U to (Triangle.p2 minus Triangle.p1)
		// var U = [B.x-A.x,B.y-A.y,B.z-A.z];
		
		//Set Vector V to (Triangle.p3 minus Triangle.p1)
		// var V = [C.x-A.x,C.y-A.y,C.z-A.z];

		// var result = [0,0,0];
		//Set Normal.x to (multiply U.y by V.z) minus (multiply U.z by V.y)
		// result[0] = (B.y-A.y)*(C.z-A.z)-(B.z-A.z)*(C.y-A.y);

		//Set Normal.y to (multiply U.z by V.x) minus (multiply U.x by V.z)
		// result[1] = (B.z-A.z)*(C.x-A.x)-(B.x-A.x)*(C.z-A.z);

		// Set Normal.z to (multiply U.x by V.y) minus (multiply U.y by V.x)
		// result[2] = (B.x-A.x)*(C.y-A.y)-(B.y-A.y)*(C.x-A.x);

		return [(B[1]-A[1])*(C[2]-A[2])-(B[2]-A[2])*(C[1]-A[1]),(B[2]-A[2])*(C[0]-A[0])-(B[0]-A[0])*(C[2]-A[2]),(B[0]-A[0])*(C[1]-A[1])-(B[1]-A[1])*(C[0]-A[0])];
	}
	
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
		-0.5,  0.5, -0.5,
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
	this.vertexNormals = [];
	this.vertexNormalBuffer.itemSize = 3;
	this.vertexNormalBuffer.numItems = 0;
	for (var i = 0; i < 6; i++) {
		var n0 = n([this.vertices[i*9],this.vertices[i*9+1],this.vertices[i*9+2]],[this.vertices[i*9+3],this.vertices[i*9+4],this.vertices[i*9+5]],[this.vertices[i*9+6],this.vertices[i*9+7],this.vertices[i*9+8]]);
		for (var j = 0; j < 3; j++) {
			this.vertexNormals.push(n0[0]);
			this.vertexNormals.push(n0[1]);
			this.vertexNormals.push(n0[2]);
			this.vertexNormalBuffer.numItems++;
		}
	}
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexNormals), gl.STATIC_DRAW);
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
