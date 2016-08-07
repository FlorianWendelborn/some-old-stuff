window.onresize = main.updateResolution;
window.onload = main.init;

window.onkeydown = function (e) {
	events.keyAction(e.keyCode, true);
}

window.onkeyup = function (e) {
	events.keyAction(e.keyCode, false);
}

var events = new Object();
	events.keyPressed = new Object();

events.keyAction = function (key, state) {
	switch (key) {
		case 87: /*w*/ events.keyPressed['moveUp'] = state; break;
		case 65: /*a*/ events.keyPressed['moveLeft'] = state; break;
		case 83: /*s*/ events.keyPressed['moveDown'] = state; break;
		case 68: /*d*/ events.keyPressed['moveRight'] = state; break;
		case 32: /*space*/ events.keyPressed['jump'] = state; break;
		case 116: /*F5*/ break;
		case 123: /*F12*/ break;
		default:
			console.log('events.keyAction - unbound key pressed: ' +  key);
	}
}