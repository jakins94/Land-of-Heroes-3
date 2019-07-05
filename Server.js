var rootRequire = require('root-require');


	var Player = rootRequire('Player'), PathFinding = rootRequire('PathFinding'), Functions = rootRequire('Functions'), PlayerHandler = rootRequire('PlayerHandler'), Connection = rootRequire('Connection'), EnemyHandler = rootRequire('EnemyHandler'), Maps = rootRequire('Maps'); 

var Server = rootRequire('Server');

var express = require('express'),
	app = express(),
	port = 8080;

app.use(express.static(__dirname + '/public'));

Server.io = require('socket.io').listen(app.listen(port));

Server.startUp = function() {

	Maps.initMaps();
	EnemyHandler.createEnemies();

	console.log("Server started... awaiting connections...");

	Server.io.on('connection', function(client) {

		client.on('player connect', Connection.playerConnect);
		client.on('heartbeat', PlayerHandler.heartbeat);
		client.on('player movement', PlayerHandler.playerMove);
		client.on('chat message', PlayerHandler.chatMessage);
		client.on('player vs enemy', EnemyHandler.playerAttackEnemy);
		client.on('disconnect', playerDisconnect);
		//client.send(client.id);

	});

var serverLoopInterval = setInterval(serverLoop, 200);
var moveSpeed = 5;

function serverLoop() {

	playerLoop();
	enemyLoop();

}

function enemyLoop() {

	for(var i=0;i<EnemyHandler.enemies.length;i++) {
		var enemy = EnemyHandler.enemies[i];

		if(enemy.path != 0) {
			enemy.movingX = (enemy.path[0][0] * 32) - 16;
			enemy.movingY = (enemy.path[0][1] * 32) - 16;

			enemy.x = enemy.movingX;
			enemy.y = enemy.movingY;

			if(Functions.distance(enemy.x, enemy.y, enemy.movingX, enemy.movingY) <= 16) {
				//enemy.path = PathFinder.generatePath(0, Math.floor(enemy.x/32), Math.floor(enemy.y/32), Math.floor(enemy.destX/32), Math.floor(enemy.destY/32))
				enemy.path.splice(0,1);
				//EnemyHandler.setPath(enemy.id, enemy.destX, enemy.destY);
			}

			console.log("enemy moving")

			if(enemy.path.length > 2) {
				//Server.io.to(enemy.mapId).emit("enemy move", { id: enemy.id, destX: enemy.path[2][0] * 32, destY: enemy.path[2][1] * 32});
			} else {
				//Server.io.to(enemy.mapId).emit("enemy move", { id: enemy.id, destX: enemy.movingX, destY: enemy.movingY});
			}
		}

		if(enemy.target > -1) {
			var target = PlayerHandler.playerByPid(enemy.target);

			if(Functions.distance(enemy.x, enemy.y, target.x, target.y) <= enemy.attackRange) {

				// TODO: Turn this into a separate method, handle damage/death server side/client side
				var damage = Math.round(Math.random() * 3) + 2;

				enemy.path = [];

				if(enemy.attackTimer == 0) {
					enemy.attackTimer = 4;
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

function playerLoop() {
	for(var i=0;i<PlayerHandler.players.length;i++) {
		var player = PlayerHandler.players[i];
		if(player.path != 0) {
			player.movingX = (player.path[0][0] * 32);
			player.movingY = (player.path[0][1] * 32);

			player.x = player.movingX;
			player.y = player.movingY;

			if(Functions.distance(player.x, player.y, player.movingX, player.movingY) <= 32) {
				//player.path = PathFinder.generatePath(0, Math.floor(player.x/32), Math.floor(player.y/32), Math.floor(player.destX/32), Math.floor(player.destY/32))
				player.path.splice(0,1);
			}
			if(player.path.length > 2) {
				Server.io.to(player.mapId).emit("player move", { pid: player.pid, destX: player.path[2][0] * 32, destY: player.path[2][1] * 32});
			} else {
				Server.io.to(player.mapId).emit("player move", { pid: player.pid, destX: player.movingX, destY: player.movingY});
			}
		}

		if(player.target > -1) {
			var target = EnemyHandler.enemyById(player.target);

			if(Functions.distance(player.x, player.y, target.x, target.y) <= player.attackRange) {

				// TODO: Turn this into a separate method, handle damage/death server side/client side
				var damage = Math.round(Math.random() * 7) + 4;

				player.path = [];

				if(target.target == -1) {
					target.target = player.pid;
				}

				if(player.attackTimer == 0) {
					player.attackTimer = 3;
					Server.io.to(player.mapId).emit("player attack", { pid: player.pid, eid: player.target, damage: damage });
				
				} else {
					player.attackTimer--;
				}

			} else if(player.path == false) {
				player.destX = target.x;
				player.destY = target.y;
				PlayerHandler.setPath(player.id, player.destX, player.destY);
			}
		}


	}
}

var playerDisconnect = function(data) {
	console.log("Player disconnected: " + data);
}

	

};