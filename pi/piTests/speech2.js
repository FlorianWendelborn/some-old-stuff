var http = require('http');

var fs = require('fs');
var index = fs.readFileSync('speech2.html');
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

var sys = require('sys')
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) }

http.createServer(function (req, res) {
	
	blink = false;
	switch (req.url) {
		case "/1off":
			exec('espeak "turned the green LED off"', puts);
			led1.writeSync(1);
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(index, "binary");
			break;
		case "/1on":
			exec('espeak "turned the green LED on"', puts);
			led1.writeSync(0);
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(index, "binary");
			break;
		case "/2off":
			exec('espeak "turned the yellow LED off"', puts);
			led2.writeSync(1);
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(index, "binary");
			break;
		case "/2on":
			exec('espeak "turned the yellow LED on"', puts);
			led2.writeSync(0);
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(index, "binary");
			break;
		case "/3off":
			exec('espeak "turned the red LED off"', puts);
			led3.writeSync(1);
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(index, "binary");
			break;
		case "/3on":
			exec('espeak "turned the red LED on"', puts);
			led3.writeSync(0);
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(index, "binary");
			break;
		case "/4off":
			exec('espeak "turned the second green LED off"', puts);
			led4.writeSync(1);
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(index, "binary");
			break;
		case "/4on":
			exec('espeak "turned the second green LED on"', puts);
			led4.writeSync(0);
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(index, "binary");
			break;
		case "/5off":
			exec('espeak "turned the second yellow LED off"', puts);
			led5.writeSync(1);
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(index, "binary");
			break;
		case "/5on":
			exec('espeak "turned the second yellow LED on"', puts);
			led5.writeSync(0);
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(index, "binary");
			break;
		case "/6off":
			exec('espeak "turned the second red LED off"', puts);
			led6.writeSync(1);
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(index, "binary");
			break;
		case "/6on":
			exec('espeak "turned the second red LED on"', puts);
			led6.writeSync(0);
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(index, "binary");
			break;
		case "/ping":
			exec('ping google.de -c 1', function (error, stdout, stderr) {
				exec('espeak "your ping to google.de is ' + stdout.split("/")[stdout.split("/").length-2] + ' milliseconds"', function (a,b,c) {
					// nothing to log
				});
			});
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
			exec('espeak "404 "' + req.url, function (a,b,c) {
				// nothing to log
			});
			console.log(req.url);
			res.writeHead(404, {'Content-Type': 'text/html'});
			res.end(error, "binary");
	}
}).listen(4242);
console.log('Server running at port 4242');
