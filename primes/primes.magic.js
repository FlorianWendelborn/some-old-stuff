if (process && process.argv && process.argv[2]) {
	var max = process.argv[2];
} else {
	var max = 100000;
}

console.time('MagicPrimes');

var num = 2;
var primes = [false,false];
while (num <= max) {
	var isPrime = true;

	var magicValue = Math.sqrt(num);

	for (var x = 2; x <= magicValue; x++) {
		if (primes[x] === true && num%x === 0) {
			isPrime = false;
			break;
		}
	}
	primes[num] = isPrime;

	num++;
}

var realPrimes = [];
for (var i = 0; i < primes.length; i++) {
	if (primes[i] === true) realPrimes.push(i);
}

process.stdout.write('MagicPrimes found ' + realPrimes.length + ' prime numbers less than ' + max);
console.timeEnd('MagicPrimes');
