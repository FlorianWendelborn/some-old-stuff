var main = new Object();
	main.canvas = [];
	main.context = [];
	main.lastFrame = {};
	main.currentFrame = {
		position: [0,0]
	};
	main.frameTimeList = [];
	main.frameTimePointer = 0;

// namespace functions
main.init = function () {
	for (var i = 0; i < document.getElementsByTagName('canvas').length; i++) {
		main.canvas[i] = document.getElementsByTagName('canvas')[i];
		main.context[i] = main.canvas[i].getContext('2d');
	}

	main.loadTextures();
	main.updateResolution();
	game.run();
	
	// force rendering
	render.dirty = true;

	render.run(true);
}

main.loadTextures = function () {
	console.log('#todo - main.loadTextures');
	// var img1 = new Image();

	// img1.onload = function () {
	// 	ctx.drawImage(img1, 0, 0);
	// };

	// img1.src = 'img/Home.jpg';
}

main.nextFrame = function () {
	main.frameTimeList[main.frameTimePointer++] = (main.currentFrame.time-main.lastFrame.time);
	if (main.frameTimePointer === 60) main.frameTimePointer = 0;
	
	main.lastFrame = cloneObject(main.currentFrame);
	main.currentFrame = {};
}

main.updateResolution = function () {
	main.height = window.innerHeight;
	main.width = window.innerWidth;
	for (var i = 0; i < main.canvas.length; i++) {
		main.canvas[i].height = main.height;
		main.canvas[i].width = main.width;
	}

	// force re-render
	render.dirty = true;
}

//global functions
window.requestNextAnimationFrame = (function(){
	return window.requestAnimationFrame    ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		window.oRequestAnimationFrame      ||
		window.msRequestAnimationFrame     ||
		function(callback){
			console.error('window.requestAnimationFrame not available, use a better browser, falling back to static 40 FPS');
			window.setTimeout(callback, 1000 / 40);
		};
})();

function cloneObject(obj){
	if(obj == null || typeof(obj) != 'object')
		return obj;

	var temp = obj.constructor();

	for(var key in obj)
		temp[key] = cloneObject(obj[key]);
	return temp;
}