if (!process.argv[2]){console.log('no input file');process.exit(1)};
if (!process.argv[3]){console.log('no output file');process.exit(1)};

var file = JSON.parse(require('fs').readFileSync(process.argv[2])+'');

var output = new Object();
	output.layers = new Array();

// iterate through the layers and parse known layers
for (var i = 0; i < file.layers.length; i++) {
	switch (file.layers[i].name) {
		case 'background':parseLayer(i, 0);break;
		case 'foreground':parseLayer(i, 1);break;
	}
}

function parseLayer (i, l) {
	output.layers[l] = new Object();
	
	// add height & width
	output.layers[l].height = file.layers[i].height;
	output.layers[l].width = file.layers[i].width;
	
	// create the data array
	output.layers[l].data = [];
	for (var y = 0; y < file.layers[i].height; y++) {
		// create the array for current y
		output.layers[l].data[y] = [];
		
		// set the value
		for (var x = 0; x < file.layers[i].width; x++) {
			output.layers[l].data[y][x] = file.layers[i].data[y*file.layers[i].width+x];
		}
		
		// add special behavior when calling JSON.stringify
		output.layers[l].data[y].toJSON = function (e) {
			var o = '['+output.layers[l].data[e][0];
			for (var i = 1; i < output.layers[l].data[e].length; i++) {
				var el = output.layers[l].data[e][i];
				o += ',' + el;
			}
			o += ']';
			return o;
		}
	}
}

var json = JSON.stringify(output, null, '\t').split('\n');

// quick and really dirty code to cut the "" from every data: []
// will most likely cause bugs from time to time

var deleting;
var deleteIndentation; 

var finalOutput = '';

for (var i = 0; i < json.length; i++) {
	if (json[i].indexOf('"data": [') != -1) {
		// start deleting after "data": [ was found
		deleting = true;
		deleteIndentation = json[i].lastIndexOf('\t');
		
		// output original JSON
		finalOutput += json[i] + '\n';
	} else if (deleting && json[i].lastIndexOf('\t') == deleteIndentation) {
		// stop deleting
		deleting = false;
		
		// output original JSON
		finalOutput += json[i] + '\n';
	} else if (deleting) {
		// restore indentation
		var temp = json[i].split('"');
		for (var j = 0; j < deleteIndentation+2; j++) {
			finalOutput += '\t';
		}

		// writing colons
		if (json[i+1].lastIndexOf('\t') != deleteIndentation) {
			finalOutput += temp[1] + ',' + '\n';
		} else {
			finalOutput += temp[1] + '\n';
		}
	} else {
		// keep original json
		finalOutput += json[i] + '\n';
	}
}

// write to file

require('fs').writeFileSync(process.argv[3],finalOutput);