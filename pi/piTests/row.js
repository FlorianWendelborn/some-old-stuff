var Gpio = require('onoff').Gpio,
led1 = new Gpio(4, 'out'),
led2 = new Gpio(25, 'out');
led3 = new Gpio(17, 'out');

var step = 0;
var map = [[0,1,1],[1,0,1],[1,1,0]];

setInterval(function () {
	led1.writeSync(map[step][0]);
	led2.writeSync(map[step][1]);
	led3.writeSync(map[step][2]);
	step++;
	if (step >= map.length) {
		step = 0;
	}
}, 333);