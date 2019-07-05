var rootRequire = require('root-require');

var EnemyHandler = 	rootRequire('EnemyHandler'),
	PathFinding = 	rootRequire('PathFinding'),
	Functions = 	rootRequire('Functions'),
	PlayerHandler = rootRequire('PlayerHandler'),
	Maps = 			rootRequire('Maps'),
	Enemy = 		rootRequire('Enemy'),
	Server = 		rootRequire('Server');


EnemyHandler.enemies = [];

var enemies = EnemyHandler.enemies;

// called when player selects an enemy as a target
EnemyHandler.playerAttackEnemy = function(data) {
	var p = PlayerHandler.playerById(data.id);
	if(typeof p !== undefined) {
		p.target = data.target;
	}
}

EnemyHandler.setPath = function(id, x, y) {

	var e = EnemyHandler.enemyById(id);

	if(e) {
		e.destX = x;
		e.destY = y;
		e.path = PathFinding.generatePath(0, Math.round(e.x/32), Math.round(e.y/32), Math.round(e.destX/32), Math.round(e.destY/32), 0);
		Server.io.to(e.mapId).emit("enemy path", { id: e.id, path: e.path, target: e.target })
	}

}

EnemyHandler.createEnemies = function() {

		//var map = require('./Map Files/testmap.json');

		var map = Maps.enemyMapList[0];

		var fs = require('fs');
		var npcList = JSON.parse(fs.readFileSync('./data/npcs.json', 'utf8'));


		var enemyID = 0;
		var type = 0;
		var mapId = 0;
		var tileSize = 32;


		//for(var i=0;i<Maps.length;i++) {
			var width = map.layers[5]["width"];
			var height = map.layers[5]["height"];
			var world = map.layers[5]["data"];
				for (var w=0; w < width; w++) {
					for (var h=0; h < height; h++) {
						type = world[w][h];
						if(type == 257) {
							var n = npcList[0]; //need to fix
							var newEnemy = new Enemy.init(h*tileSize, w*tileSize, n, enemyID, 0);
							EnemyHandler.enemies.push(newEnemy);
							enemyID++;
						}
					}
				}
		//}

}

// find enemy by id
EnemyHandler.enemyById = function(id) {
	for (var i = 0; i < enemies.length; i++) {
		if (enemies[i].id == id) {
			return enemies[i];
		}
	};
	return false;
};