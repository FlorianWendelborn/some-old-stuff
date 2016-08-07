var render = new Object();

var cBackground = 0
  , cGame = 1
  , cUserinterface = 2;

var lBackground = 0
  , lForeground = 1;

// namespace functions
render.run = function () {
	// update game
	game.update();

	// render everything
	render.background();
	render.sprites();
	render.userinterface();

	// clear force
	render.force = false;
	
	// queue
	window.requestNextAnimationFrame(render.run);
}

render.background = function () {
	var alwaysDrawBackground = false;

	// round scale factor to n/textureSize
	var scaleFactor = Math.round(((main.width*9 < main.height*16) ? main.width/1920 : main.height/1080)*32)/32;

	var offsetX = main.currentFrame.position[0]
	  , offsetY = 0+main.height-scaleFactor*game.map.layers[lBackground].data.length*32 + main.currentFrame.position[1];

	// draw background only after moving
	if (main.lastFrame.position[0] != main.currentFrame.position[0] || main.lastFrame.position[1] != main.currentFrame.position[1] || alwaysDrawBackground || render.dirty) {
		main.context[cBackground].clearRect(0,0,main.width,main.height);
		
		// iterate through tiles
		for (var y = 0; y < game.map.layers[lBackground].data.length ; y++) {
			for (var x = 0; x < game.map.layers[lBackground].data[y].length ; x++) {
				var tile = game.map.layers[lBackground].data[y][x];
				
				if (tile) {
					main.context[cBackground].fillStyle = 'rgb('+tile*64+','+tile*64+','+tile*64+')';
					main.context[cBackground].fillRect(offsetX + scaleFactor*x*32, offsetY + scaleFactor*y*32, scaleFactor*32, scaleFactor*32);
				}
			}
		}
	}
}

render.sprites = function () {
	for (var i = 0; i < game.entities.length; i++) {
		// render.sprite(game.entities[i]);
	}
}

render.userinterface = function () {
	main.context[cUserinterface].clearRect(0,0,main.width,main.height);
	main.context[cUserinterface].fillStyle = 'rgba(200,200,200,0.75)';
	main.context[cUserinterface].fillRect(0,0,main.width,main.height/30);
	main.context[cUserinterface].fillStyle = 'red';
	
	// calculate and render FPS
	var fps = 0;
	for (var i = 0; i < main.frameTimeList.length; i++) {
		fps += main.frameTimeList[i];
	}
	fps /= main.frameTimeList.length;
	main.context[cUserinterface].fillText(Math.floor(1000/fps) + ' FPS',main.width-50,15);
}