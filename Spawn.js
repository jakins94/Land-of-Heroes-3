var rootRequire = require('root-require');

var Spawn = rootRequire('Spawn');

	Spawn.init = function(x, y, data, id, mapId) {
		this.mapId = mapId;
		this.id = id; // spawner id
		this.eid = data.id; // enemy id
		this.respawnTime = data.stats.respawn;
		this.minSpawn = data.stats.minSpawn;
		this.maxSpawn = data.stats.maxSpawn;
		this.currSpawned = 0;
		this.timeSpawned = -1;
		this.x = x;
		this.y = y;
	}