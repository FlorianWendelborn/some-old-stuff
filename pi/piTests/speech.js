var http = require('http');

var fs = require('fs');
var index = fs.readFileSync('speech.html');
var error = fs.readFileSync('error.html');
var favicon = fs.readFileSync('favicon.ico');

var Gpio = require('onoff').Gpio,
led1 = new Gpio(23, 'out'); // green 1
led2 = new Gpio(22, 'out'); // yellow 1
led3 = new Gpio(25, 'out'); // red 1
led4 = new Gpio(4, 'out'); // green 2
led5 = new Gpio(17, 'out'); // yellow 2
led6 = new Gpio(18, 'out'); // red 2

led1.writeSync(1);
led2.writeSync(1);
led3.writeSync(1);
led4.writeSync(1);
led5.writeSync(1);
led6.writeSync(1);

http.createServer(function (req, res) {
	
	blink = false;
	switch (req.url) {
		case "/1off":
			console.log("green1 off");
			led1.writeSync(1);
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(index, "binary");
			break;
		case "/1on":
			console.log("green1 on");
			led1.writeSync(0);
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(index, "binary");
			break;
		case "/2off":
			console.log("yellow1 off");
			led2.writeSync(1);
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(index, "binary");
			break;
		case "/2on":
			console.log("yellow1 on");
			led2.writeSync(0);
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(index, "binary");
			break;
		case "/3off":
			console.log("red1 off");
			led3.writeSync(1);
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(index, "binary");
			break;
		case "/3on":
			console.log("red1 on");
			led3.writeSync(0);
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(index, "binary");
			break;
		case "/4off":
			console.log("green2 off");
			led4.writeSync(1);
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(index, "binary");
			break;
		case "/4on":
			console.log("green2 on");
			led4.writeSync(0);
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(index, "binary");
			break;
		case "/5off":
			console.log("yellow2 off");
			led5.writeSync(1);
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(index, "binary");
			break;
		case "/5on":
			console.log("yellow2 on");
			led5.writeSync(0);
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(index, "binary");
			break;
		case "/6off":
			console.log("red2 off");
			led6.writeSync(1);
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(index, "binary");
			break;
		case "/6on":
			console.log("red2 on");
			led6.writeSync(0);
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(index, "binary");
			break;
		case "/favicon.ico":
			res.writeHead(200, {'Content-Type': 'image/x-icon'});
			res.end(favicon, "binary");
			break;
		case "/":
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(index, "binary");
			break;
		default:
			console.log(req.url);
			res.writeHead(404, {'Content-Type': 'text/html'});
			res.end(error, "binary");
	}
}).listen(4242);
console.log('Server running at port 4242');
