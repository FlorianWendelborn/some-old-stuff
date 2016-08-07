function initHUD () {
	createHUDSprites();
}


function createHUDSprites ( texture ) {
	var texture = THREE.ImageUtils.loadTexture('png/resources/metal.png', {}, function () {
		var material = new THREE.SpriteMaterial( { map: texture } );

		var width = material.map.image.width;
		var height = material.map.image.height;
		
		spriteTL = new THREE.Sprite( material );
		spriteTL.scale.set( width, height, 1 );
		sceneOrtho.add( spriteTL );

		spriteTR = new THREE.Sprite( material );
		spriteTR.scale.set( width, height, 1 );
		sceneOrtho.add( spriteTR );

		spriteBL = new THREE.Sprite( material );
		spriteBL.scale.set( width, height, 1 );
		sceneOrtho.add( spriteBL );

		spriteBR = new THREE.Sprite( material );
		spriteBR.scale.set( width, height, 1 );
		sceneOrtho.add( spriteBR );
		
		spriteC = new THREE.Sprite( material );
		spriteC.scale.set( width, height, 1 );
		sceneOrtho.add( spriteC );

		updateHUDSprites();
	});
};

function updateHUDSprites () {

	var width = window.innerWidth / 2;
	var height = window.innerHeight / 2;

	var material = spriteTL.material;

	var imageWidth = material.map.image.width / 2;
	var imageHeight = material.map.image.height / 2;

	spriteTL.position.set( - width + imageWidth,   height - imageHeight, 1 ); // top left
	spriteTR.position.set(   width - imageWidth,   height - imageHeight, 1 ); // top right
	spriteBL.position.set( - width + imageWidth, - height + imageHeight, 1 ); // bottom left
	spriteBR.position.set(   width - imageWidth, - height + imageHeight, 1 ); // bottom right
	spriteC.position.set( 0, 0, 1 ); // center

};
