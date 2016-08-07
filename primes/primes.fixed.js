if (process && process.argv && process.argv[2]) {
	var max = process.argv[2];
} else {
	var max = 100000;
}

console.time('Primes 2');

var num = 3;
var primes = [2];
while (num <= max) {
	var isprime = 1;
	for (var x = 0; x < primes.length; x++) {
		if (num%primes[x] === 0) {
			isprime = 0;
			break;
		}
	}
	if (isprime) {
		primes[primes.length] = num;
	}
	num += 1;
}

process.stdout.write('Primes 2 found ' + primes.length + ' prime numbers less than ' + max);
console.timeEnd('Primes 2');
