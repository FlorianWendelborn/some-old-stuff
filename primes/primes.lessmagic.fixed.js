if (process && process.argv && process.argv[2]) {
	var max = process.argv[2];
} else {
	var max = 100000;
}

console.time('LessMagic 2');

var num = 3;
var primes = [2];
while (num <= max) {
	var broken = false;

	var magicValue = Math.sqrt(num);

	for (var x = 0; x < primes.length; x++) {
		if (primes[x] > magicValue) break;
		if (num%primes[x] === 0) {
			broken = true;
			break;
		}
	}
	if (!broken) {
		primes.push(num);
	}
	num++;
}

process.stdout.write('LessMagic 2 found ' + primes.length + ' prime numbers less than ' + max);
console.timeEnd('LessMagic 2');
