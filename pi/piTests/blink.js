var Gpio = require('onoff').Gpio,
led1 = new Gpio(4, 'out'),
led2 = new Gpio(25, 'out');
led3 = new Gpio(17, 'out');

var frequency = 1;

function blinkNow () {
	led1.writeSync(0);
	led2.writeSync(0);
	led3.writeSync(0);
	setTimeout(function () {
		led1.writeSync(1);
		led2.writeSync(1);
		led3.writeSync(1);
	}, Math.floor(500/frequency));
	setTimeout(function () {
		blinkNow();
	}, Math.floor(1000/frequency));
}

blinkNow();

var http = require('http');

http.createServer(function (req, res) {
	frequency = req.url.replace("/","");
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.end("The frequency is now " + req.url.replace("/","") + " Hz");
}).listen(80);

console.log("visit 127.0.0.1:80/desiredFrequency to change the frequency (Hz) on-the-fly.");
console.log("currently kinda buggy...");