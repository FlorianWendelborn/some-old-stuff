// argv[2] = max, argv[3] = scripts used, argv[4] = log stdout

var path = require('path')
  , childProcess = require('child_process');

var max = process.argv[2] || 100000;

console.log('running tests for ~10^' + Math.round(Math.log(max) / Math.LN10*100)/100);

var scripts = [];

switch (process.argv[3]*1 || 0) {
	case 0: scripts = ['primes.js', 'primes.magic.js', 'primes.lessmagic.js', 'primes.fixed.js', 'primes.lessmagic.fixed.js'];break;
	case 1: scripts = ['primes.magic.js', 'primes.fixed.js', 'primes.lessmagic.fixed.js'];break;
	case 2: scripts = ['primes.magic.js', 'primes.lessmagic.fixed.js'];break;
	default: scripts = ['primes.lessmagic.fixed.js'];
}

var currentScript = 0;

function test () {
	var startTime = new Date().getTime()
	  , child = childProcess.exec('node ' + path.join(__dirname, scripts[currentScript]) + ' ' + max, function (err, stdout, stderr) {
	  	if (process.argv[4]) console.log(stdout);
	});
	
	child.on('exit', function () {
		var duration = new Date().getTime() - startTime
		console.log(scripts[currentScript] + ' finished after ' + duration + ' ms.');
		currentScript++;
		if (currentScript < scripts.length) {
			process.nextTick(function () {
				test();
			});
		} else {
			console.log('all tests finished');
		}
	});
}

test();
