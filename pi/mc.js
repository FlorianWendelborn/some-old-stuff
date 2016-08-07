var mcping = require('mc-ping'),
	gpio = require('onoff').Gpio;

var led1 = new gpio(23, 'out'), // green 1
	led2 = new gpio(22, 'out'), // yellow 1
	led3 = new gpio(25, 'out'), // red 1
	led4 = new gpio(4, 'out'), // green 2
	led5 = new gpio(17, 'out'), // yellow 2
	led6 = new gpio(18, 'out'); // red 2

var check = setInterval(function () {
	mcping('192.168.0.102', 25564, function(err, res) {
		if (err) {
			console.error(err);
		} else {
			if (res.num_players>0) led1.writeSync(0); else led1.writeSync(1);
			if (res.num_players>1) led2.writeSync(0); else led2.writeSync(1);
			if (res.num_players>2) led3.writeSync(0); else led3.writeSync(1);
			if (res.num_players>3) led4.writeSync(0); else led4.writeSync(1);
			if (res.num_players>4) led5.writeSync(0); else led5.writeSync(1);
			if (res.num_players>5) led6.writeSync(0); else led6.writeSync(1);
		}
	});
},1000);

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