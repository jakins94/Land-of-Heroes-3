var rootRequire = require('root-require');

var Enemy = rootRequire('Enemy');


	Enemy.init = function(x, y, data, id, mapId) {
		this.mapId = mapId;
		this.spawnerId = -1;
		this.name = data.name;
		this.spriteName = data.spriteName;
		this.id = id;
		this.maxhp = data.stats.maxhp;
		this.hp = data.stats.maxhp;
		this.x = x;
		this.y = y;
		this.startX = x;
		this.startY = y;
		this.movingX = x;
		this.movingY = y;
		this.destX = x;
		this.destY = y;
		this.attackRange = 45;
		this.attackTimer = 0;
		this.path = [];
		this.target = -1;
	}


// Export the Player class so you can use it in
// other files by using require("Player").Player
//exports.Enemy = Enemy;
