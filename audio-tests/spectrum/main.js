// create audio object
var audio = new Audio();
audio.src = location.hash.substring(1) || 'song.ogg';
audio.controls = true;
audio.loop = true;
audio.autoplay = true;
audio.volume = 0.015;

// initialize
window.addEventListener('load', init, false);

var canvas, ctx, source;
var context, analyser, fbcArray;
var bars, barX, barWidth, barHeight;

function init () {
	document.body.appendChild(audio);
	context = new AudioContext();
	analyser = context.createAnalyser();
	canvas = document.getElementsByTagName('canvas')[0];
	canvas.width = 1024;
	canvas.height = 256;

	ctx = canvas.getContext('2d');
	source = context.createMediaElementSource(audio);
	source.connect(analyser);
	analyser.connect(context.destination);
	loop();
}


function loop () {
	var cC = document.getElementById('cC').checked;
	window.requestAnimationFrame(loop);
	fbcArray = new Uint8Array(analyser.frequencyBinCount);
	analyser.getByteFrequencyData(fbcArray);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	bars = 1024;
	for (var i = 0; i < bars; i++) {
		ctx.fillStyle = 'rgb(' + Math.round(fbcArray[i])*5 + ', 0, 0)';
		barX = i;
		barWidth = 1;
		barHeight = -(fbcArray[i]);
		ctx.fillRect(barX, canvas.height, barWidth, barHeight);
		// circle
		if (cC) {
			ctx.beginPath();
			ctx.arc(i,128,fbcArray[i],0,2*Math.PI, false);
			ctx.fill();
		}
	}
}

// listen for u key
window.onkeydown = function (e) {
	switch (e.keyCode) {
		case 85:
			var url = prompt('URL? [song.ogg]')
			audio.src = url || 'song.ogg';
			location.hash = url || '';
		break;
	}
}
