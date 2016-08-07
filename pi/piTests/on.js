// var http = require('http');
// var gpio = require("rpi-gpio");
			
// http.createServer(function (req, res) {
// 	res.writeHead(200, {'Content-Type': 'text/plain'});
// 	switch (req.url) {
// 		case "/gpio7":
// 			gpio.setup(7, gpio.DIR_OUT, write);
// 			function write() {
// 				gpio.write(7, true, function(err) {
// 					if (err) throw err;
// 					console.log('Written to pin');
// 				});
// 			}
// 			res.end('Blink');
// 			break;
// 		default:
// 			res.end('Hello World');
// 	}
// }).listen(666);
// console.log('Server running at :666');

var Gpio = require('onoff').Gpio,
    led = new Gpio(4, 'out');

led.writeSync(0);