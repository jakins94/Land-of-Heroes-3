var rootRequire = require('root-require'),
	fs 			= require('fs');

var SpawnHandler 	= rootRequire('SpawnHandler'),
	Spawn 			= rootRequire('Spawn'),
	Maps 			= rootRequire('Maps');


SpawnHandler.spawners = []; // contains spawners for each map

var spawners 		= SpawnHandler.spawners, // reference the spawners
	spawnList 		= JSON.parse(fs.readFileSync('./data/spawns.json', 'utf8')), // load spawner data
	spawnId 		= 0; // start spawner id at 0


// create enemy spawns when server starts
SpawnHandler.createEnemySpawns = function() {

		var map = Maps.enemyMapList[0];


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
							var spawnData = spawnList[0]; //need to fix
							var newSpawn = new Spawn.init(h*tileSize, w*tileSize, spawnData, spawnId, 0);
							spawners.push(newSpawn);
							spawnId++;
						}
					}
				}
		//}

		console.log(spawnId + " enemy spawns initialized");

}

SpawnHandler.spawnById = function(id) {

	for(var i=0;i<spawners.length;i++) {
		if(spawners[i].id == id) {
			return spawners[i];
		}
	}

}