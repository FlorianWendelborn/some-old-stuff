var sys = require('sys')
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) }
exec('espeak "this is not a test"', puts);
setTimeout(function () {
	exec('espeak "this is not a test2"', puts);
},2000);