if (process && process.argv && process.argv[2]) {
	var max = process.argv[2];
} else {
	var max = 100000;
}

console.time('LessMagic');

var num = 3;
var primes = [2];
while (num <= max) {
	var broken = false;

	var magicValue = Math.sqrt(num);

    for (var x in primes) {
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

process.stdout.write('LessMagic found ' + primes.length + ' prime numbers less than ' + max);
console.timeEnd('LessMagic');
