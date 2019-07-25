var groundLayer, layer1, layer2, layer3, objectLayer;

function createWorld() {

	// adds a transparent sprite so when we click other sprites it will not move player
	bg = game.add.sprite(0, 0);
	bg.fixedToCamera = true;
	bg.scale.setTo(game.width, game.height);
	bg.inputEnabled = true;
	bg.input.priorityID = 0; // lower priority
	bg.events.onInputDown.add(onDown, this);
    group1.add(bg);

	game.time.deltaCap = 0.025;

	game.forceSingleUpdate = true;
	game.renderer.renderSession.roundPixels = true;

//Change the background colour
    this.game.stage.backgroundColor = "#ffffff";
 
    //Add the tilemap and tileset image. The first parameter in addTilesetImage
    //is the name you gave the tilesheet when importing it into Tiled, the second
    //is the key to the asset in Phaser
    /*this.map = this.game.add.tilemap('tilemap2');
    this.map.addTilesetImage('MWground', 'tiles');
 
    //Add both the background and ground layers. We won't be doing anything with the
    //GroundLayer though
    this.groundLayer = this.map.createLayer('ground');
    this.secondLayer = this.map.createLayer('layer2');
    this.objectLayer = this.map.createLayer('objects');
 
    //Change the world size to match the size of this layer
    this.groundLayer.resizeWorld();*/

    map = game.add.tilemap('tilemap3');

    map.addTilesetImage('mountain', 'tiles3');
    
    test = map.createBlankLayer('test', 100, 100, 32, 32);
    test.enableScrollDelta = true;
    test.resizeWorld();

    //groundLayer = map.createLayer('ground');
    //groundLayer.enableScrollDelta = true;
    //groundLayer.resizeWorld();
    //groundLayer.scale.set(2);
    //groundLayer.resizeWorld();
    /*layer1 = map.createLayer('layer1');
    layer1.enableScrollDelta = true;
    layer2 = map.createLayer('layer2');
    layer2.enableScrollDelta = true;
    layer3 = map.createLayer('layer3');
    layer3.enableScrollDelta = true;
    objectLayer = map.createLayer('objects');
    objectLayer.enableScrollDelta = true;
    group1.add(objectLayer);
    objectLayer.resizeWorld();*/

}