if (process && process.argv && process.argv[2]) {
	var max = process.argv[2];
} else {
	var max = 100000;
}

var magicStart = new Date().getTime();


// LessMagic 2
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

// result of LessMagic 2
var magicEnd = new Date().getTime();
var magicTime = magicEnd-magicStart;
console.log('LessMagic 2 found ' + primes.length + ' prime numbers less than ' + max + ' in ' + magicTime + 'ms');


// Primes.js
var primesStart = new Date().getTime();

var num = 3;
var primes = [2];
while (num <= max) {
    var isprime = 1;
    for (var x in primes) {
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

// result of Primes.js
var primesEnd = new Date().getTime();
var time = primesEnd-primesStart;
console.log('Primes.js found ' + primes.length + ' prime numbers less than ' + max + ' in ' + time + 'ms');

// comparison
console.log('Therefore LessMagic 2 is ' + Math.round(time/magicTime*100)/100 + ' times faster than primes.js.');
