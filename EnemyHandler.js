var rootRequire = require('root-require');

var EnemyHandler = 	rootRequire('EnemyHandler'),
	PathFinding = 	rootRequire('PathFinding'),
	Functions = 	rootRequire('Functions'),
	PlayerHandler = rootRequire('PlayerHandler'),
	Maps = 			rootRequire('Maps'),
	Enemy = 		rootRequire('Enemy'),
	SpawnHandler = 	rootRequire('SpawnHandler'),
	Server = 		rootRequire('Server'),
	Functions = 	rootRequire('Functions');


EnemyHandler.enemies = [];

var enemies 	= EnemyHandler.enemies;


EnemyHandler.enemyLoop = function() {

	// check if any enemies need to respawn
	if(Math.random(500) < 2) {
		EnemyHandler.createEnemies();
	}

	for(var i=0;i<EnemyHandler.enemies.length;i++) {
		var enemy = EnemyHandler.enemies[i];

		if(!enemy || typeof enemy === undefined) break;

		if(!Array.isArray(enemy.path) || typeof enemy.path === undefined) {
			enemy.path = [];
		}

		if(enemy.path.length == 0 && (Math.random() * 100) < 2) {
			enemy.destX = enemy.startX + (Math.round((Math.random() * 10) - 5)*32);
			enemy.destY = enemy.startY + (Math.round((Math.random() * 10) - 5)*32);

			// prevent invalid paths
			if(enemy.destX >= 32 && enemy.destY >= 32 && enemy.destY <= 3160 && enemy.destX <= 3160)
				EnemyHandler.setPath(enemy.id, enemy.destX, enemy.destY);
		}

		// If enemy has a path start moving
		if(Array.isArray(enemy.path) && enemy.path.length) {

			if(typeof enemy.path === undefined) {
				enemy.path = [];
				break;
			}

			enemy.movingX = (enemy.path[0][0] * 32);
			enemy.movingY = (enemy.path[0][1] * 32);

			enemy.x = enemy.movingX;
			enemy.y = enemy.movingY;

			if(Functions.distance(enemy.x, enemy.y, enemy.movingX, enemy.movingY) <= 16) {
				//enemy.path = PathFinder.generatePath(0, Math.floor(enemy.x/32), Math.floor(enemy.y/32), Math.floor(enemy.destX/32), Math.floor(enemy.destY/32))
				enemy.path.splice(0,1);
				//EnemyHandler.setPath(enemy.id, enemy.destX, enemy.destY);
			}

			Server.io.to(enemy.mapId).emit("enemy move", { id: enemy.id, destX: enemy.movingX, destY: enemy.movingY});

		}

		// Enemy has a target
		if(enemy.target > -1 && enemy.hp > 0) {
			var target = PlayerHandler.playerByPid(enemy.target);

			// if enemy moves too far from start position while fighting, move back and heal
			if(!target || Functions.distance(enemy.x, enemy.y, enemy.startX, enemy.startY) >= 500) {
				enemy.destX = enemy.startX;
				enemy.destY = enemy.startY;
				EnemyHandler.setPath(enemy.id, enemy.destX, enemy.destY);

				EnemyHandler.gotHealed(enemy.id, enemy.maxhp);
				enemy.target = -1;
				break;
			}

			if(Functions.distance(enemy.x, enemy.y, target.x, target.y) <= enemy.attackRange) {

				// TODO: Turn this into a separate method, handle damage/death server side/client side
				var damage = Math.round(Math.random() * 3) + 2;

				enemy.path = [];

				if(enemy.attackTimer == 0) {
					enemy.attackTimer = 4;
					target.HP -= damage;
					Server.io.to(enemy.mapId).emit("enemy attack", { pid: enemy.target, eid: enemy.id, damage: damage });
				
				} else {
					enemy.attackTimer--;
				}

			} else if(enemy.path == false) {
				enemy.destX = target.x;
				enemy.destY = target.y;
				EnemyHandler.setPath(enemy.id, enemy.destX, enemy.destY);
			}
		}

	}

}

EnemyHandler.handleDeath = function(eid) {
	var e = EnemyHandler.enemyById(eid);
	if(!e) return;

	// lower amount currently spawned so more can spawn
	var thisSpawn = SpawnHandler.spawnById(e.spawnerId);
		thisSpawn.currSpawned--;

	for(var i=0;i<enemies.length;i++) {
		if(enemies[i].id == eid) {
			enemies.splice(i, 1);
		}
	}

}

EnemyHandler.gotHealed = function(eid, amount) {

	var e = EnemyHandler.enemyById(eid);
	if(!e) return;

	if(e.hp == e.maxhp) return;

	if(e.hp + amount > e.maxhp) {
		amount = e.maxhp - e.hp;
	}

	Server.io.to(e.mapId).emit("enemy heal", { eid: e.id, amount: amount });
}


// when enemy takes damage from any source
// TODO: Sort exp/loot based on damage percentages of each player
EnemyHandler.takeDamage = function(pid, eid, type, damage) {

	var e = EnemyHandler.enemyById(eid);
	var p = PlayerHandler.playerByPid(pid);
	if(!e) return;
	if(!p) return;

	var hit = damage; // hit variable will be the adjusted damage after calculations

	if(type == 0) { // true damage

		e.hp -= damage;
		hit = damage;

	} else if(type == 1) { // physical damage

		e.hp -= damage;
		hit = damage;

	}

	// TODO: add damage per player

	if(e.hp <= 0) {
		EnemyHandler.handleDeath(e.id);
	}

	Server.io.to(e.mapId).emit("enemy take damage", { pid: pid, eid: eid, type: type, damage: hit });

}

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
		//Server.io.to(e.mapId).emit("enemy path", { id: e.id, path: e.path, target: e.target })
	}

}

var fs = require('fs');
var npcList = JSON.parse(fs.readFileSync('./data/npcs.json', 'utf8'));

var enemyId = 0;

EnemyHandler.createEnemies = function() {

	var spawners = SpawnHandler.spawners;

	for(var i=0;i<spawners.length;i++) {
		var spawn = spawners[i];

		if(spawn.timeSpawned == -1 || Date.now() - spawn.timeSpawned >= spawn.respawnTime) {
			spawn.timeSpawned = Date.now();
			var enemiesToAdd = [];
			// choose amount to spawn somewhere between min and max amount
			var amountToSpawn = spawn.minSpawn + Math.round(Math.random() * (spawn.maxSpawn - spawn.minSpawn));
			while(spawn.currSpawned < amountToSpawn) {
				if(spawn.eid == 257) {
					var n = npcList[0]; //need to fix
					var spawnX = Math.round(spawn.x / 32);
					var spawnY = Math.round(spawn.y / 32);
					var newX = spawnX + (Math.round(Math.random() * 5) - 5); // within 5 squares either side
					var newY = spawnY + (Math.round(Math.random() * 5) - 5); // within 5 squares either side
					var newEnemy = new Enemy.init(newX * 32, newY * 32, n, enemyId, 0);

					//	set spawn id for death handling
					newEnemy.spawnerId = spawn.id;
					EnemyHandler.enemies.push(newEnemy);
					enemiesToAdd.push(newEnemy);
					enemyId++;
					spawn.currSpawned++;
				}
			}
			// send new enemies
			if(enemiesToAdd != 0)
				EnemyHandler.sendEnemiesToMap(0, enemiesToAdd);
		}

	}
}

// send new enemies to every player on map
EnemyHandler.sendEnemiesToMap = function(mapId, newEnemies) {

	Server.io.to(mapId).emit("new enemies", newEnemies);

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