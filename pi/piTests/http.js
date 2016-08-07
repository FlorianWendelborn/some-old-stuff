var http = require('http');

var fs = require('fs');
var index = fs.readFileSync('index.html');
var favicon = fs.readFileSync('favicon.ico');

var Gpio = require('onoff').Gpio,
led = new Gpio(4, 'out');

var blink = false;

http.createServer(function (req, res) {
	
	blink = false;
	switch (req.url) {
		case "/off":
			console.log("off");
			led.writeSync(1);
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(index, "binary");
			break;
		case "/on":
			console.log("on");
			led.writeSync(0);
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(index, "binary");
			break;
		case "/blink1":
			blink = 1;
			console.log("blink 1");
			blinkNow();
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(index, "binary");
			break;
		case "/blink5":
			blink = 5;
			console.log("blink 5");
			blinkNow();
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(index, "binary");
			break;
		case "/blink10":
			blink = 10;
			console.log("blink 10");
			blinkNow();
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(index, "binary");
			break;
		case "/blink20":
			blink = 20;
			console.log("blink 20");
			blinkNow();
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(index, "binary");
			break;
		case "/favicon.ico":
			res.writeHead(200, {'Content-Type': 'image/x-icon'});
			res.end(favicon, "binary");
			break;
		default:
			console.log(req.url);
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(index, "binary");
	}
}).listen(4242);
console.log('Server running at port 4242');

function blinkNow () {
	led.writeSync(0);
	setTimeout(function () {
		led.writeSync(1);
	}, 500/blink);
	setTimeout(function () {
		if (blink) {
			blinkNow();
		}
	}, 1000/blink);
}
