// changeMap:
// tilemapName: name of the tilemap in preload
// tilesetName: name of the tileset in Tiled
// imageName: name of the tileset image in preload

function changeMap(tilemapName, tilesetName, imageName) {

	console.log(tilemapName, tilesetName, imageName)

	clearPlayers();

	var layers = [ groundLayer, layer1, layer2, layer3, objectLayer ];

	layers.forEach(destroyMap);

	function destroyMap(item, index) {
		item.destroy();
	}

	//map = game.add.tilemap('tilemap4');
    //map.addTilesetImage('cave', 'tiles2');
    map = game.add.tilemap(tilemapName);
    map.addTilesetImage(tilesetName, imageName);

    groundLayer = map.createLayer('ground');
    groundLayer.enableScrollDelta = false;
    layer1 = map.createLayer('layer1');
    layer1.enableScrollDelta = false;
    layer2 = map.createLayer('layer2');
    layer2.enableScrollDelta = false;
    layer3 = map.createLayer('layer3');
    layer3.enableScrollDelta = false;
    objectLayer = map.createLayer('objects');
    objectLayer.enableScrollDelta = false;
    group1.add(objectLayer);
    objectLayer.resizeWorld();

    orderSprites();

}

function clearPlayers() {
	for(var i = 0; i < players.length; i++) {
		if(players[i].pid != myPlayer.pid) {
			var data = { pid: players[i].pid };
			removePlayer(data);
		}
	}
}