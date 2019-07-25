var rootRequire = require('root-require');

	var Server 		= rootRequire('Server'),
	Player 			= rootRequire('Player'),
	Connection 		= rootRequire('Connection'),
	Database 		= rootRequire('Database'),
	EnemyHandler 	= rootRequire('EnemyHandler'),
	PathFinding 	= rootRequire('PathFinding'),
	PlayerHandler 	= rootRequire('PlayerHandler')
	Functions 		= rootRequire('Functions');

// Global PlayerHandler Variables
	PlayerHandler.players = [];

// Local PlayerHandler Variables
	var players 		= PlayerHandler.players, // players can be references within this file without typing PlayerHandler.players
		pidCount 		= Math.round(Math.random() * 10000), // start with a random number for player id's on the server
		heartbeatLoop 	= setInterval(checkHeartBeats, 2000); // interval that player heartbeats are checked for disconnections

	// tilemapName: name of the tilemap in preload
	// tilesetName: name of the tileset in Tiled
	// imageName: name of the tileset image in preload
	var mapData = [
		["tilemapName",	 "tilesetName",	"imageName"],
		["tilemap3",	 "mountain",	"tiles3"],
		["tilemap4",	 "cave",		"tiles2"]
	];


// Global PlayerHandler Functions


PlayerHandler.playerLoop = function() {
	for(var i=0;i<PlayerHandler.players.length;i++) {
		var player = PlayerHandler.players[i];

		if(!player) break;

		// player goes out of combat after 15 seconds
		if(player.fighting && Date.now() - player.fightTimer >= 15000) {
			player.fighting = false;
			player.target = -1;
		}

		// player begins healing when out of combat
		if(!player.fighting && Date.now() - player.healTimer >= 1000) {
			var healAmount = Math.round(player.maxHP * 0.025);
			PlayerHandler.gotHealed(player.pid, healAmount);
			player.healTimer = Date.now();
		}

		//if(player.path != 0) {
		if(Array.isArray(player.path) && player.path.length) {

			player.movingX = (player.path[0][0] * 32);
			player.movingY = (player.path[0][1] * 32);

			player.x = player.movingX;
			player.y = player.movingY;

			if(Functions.distance(player.x, player.y, player.movingX, player.movingY) <= 16) {
				//player.path = PathFinder.generatePath(0, Math.floor(player.x/32), Math.floor(player.y/32), Math.floor(player.destX/32), Math.floor(player.destY/32))
				player.path.splice(0,1);
			}
			//if(player.path.length > 2) {
			//	Server.io.to(player.mapId).emit("player move", { pid: player.pid, destX: player.path[2][0] * 32, destY: player.path[2][1] * 32});
			//} else {
				Server.io.to(player.mapId).emit("player move", { pid: player.pid, destX: player.movingX, destY: player.movingY});
			//}
		}

		if(player.target > -1) {
			var target = EnemyHandler.enemyById(player.target);

			if(!target) {
				player.target = -1;
				break;
			}

			if(Functions.distance(player.x, player.y, target.x, target.y) <= player.attackRange) {

				// TODO: Turn this into a separate method, handle damage/death server side/client side

				player.path = [];

				if(target.target == -1) {
					target.target = player.pid;
				}

				if(player.attackTimer == 0) {
					PlayerHandler.playerAttack(player.pid);
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

	PlayerHandler.playerAttack = function(pid) {
		var p 	= PlayerHandler.playerByPid(pid);
		if(!p) return;
		var e 	= EnemyHandler.enemyById(p.target);
		if(!e) return;

		var	damage 	= Math.round(Math.random() * 7) + 4;

		p.attackTimer = 3;
		p.fightTimer = Date.now();
		p.fighting = true;

		if(e.hp > 0) {
			EnemyHandler.takeDamage(pid, p.target, 1, damage);
		}

		if(e.hp <= 0) {
			p.target = -1;
			return;
		}


		Server.io.to(p.mapId).emit("player attack", { pid: p.pid });
	}

	PlayerHandler.gotHealed = function(pid, amount) {

		var p = PlayerHandler.playerByPid(pid);
		if(!p) return;

		if(p.HP == p.maxHP) return;

		if(p.HP + amount > p.maxHP) {
			amount = p.maxHP - p.HP;
		}

		Server.io.to(p.mapId).emit("player heal", { pid: p.pid, amount: amount });
	}


// onPlayerConnect: when a client connects, begin the connection process (check username and password)
	PlayerHandler.onPlayerConnect = function(data) {

		var toClient = Server.io.sockets.connected[data.id];

		if(typeof data.playerName !== "undefined") {
			var playerName = data.playerName;
		} else {
			toClient.emit("disconnect player");
			return;
		}

		Database.db.findOne( { name: playerName.toLowerCase() }, function(err, savedUser) {

			if(err || !savedUser) {

				console.log("New user: " + data.playerName + " Password: " + data.playerPass);

				var player = new Player.init(playerName, data.playerPass, 450, 300, data.id);

				pidCount++;
				player.pid = pidCount;

				var strippedPlayer = Database.savePlayerCompress(player);

				Database.db.save(player, function(err2, savedUser2) {

					if(err2 || !savedUser2) {
							console.log("User not saved because of error" + err2);
						} else {
							PlayerHandler.addPlayer(toClient, playerName, player);
					}

				});

			} else {

				var pass = data.playerPass;
				if(pass !== savedUser.password) {
					console.log("Wrong password for "+playerName+": "+pass+" / "+savedUser.password)
					toClient.emit("disconnect player");
					return;
				}
				
				PlayerHandler.addPlayer(toClient, savedUser.name, savedUser);

				console.log(data.playerName+" has connected.");
			}

			PlayerHandler.sendEnemies(data.id); // send existing enemies to clients
		});
	};

	PlayerHandler.joinPlayer = function(client, playerName, playerData) {
		// Send existing players to client
		var existingEnemy;
		var allEnemies = [];
		var player = PlayerHandler.playerByName(playerName);


		if(!player) { // New Localplayer
			var existingPlayer;

			// Create the new player
			player = new Player.init(playerData.playerName, playerData.playerPass, playerData.x, playerData.y, client.id);
			players.push(player);

			var newPlayer = { x: player.x, y: player.y, playerName: playerData.playerName, pid: player.pid };
			client.broadcast.emit("new player", newPlayer);
		
		} else { // Existing localplayer

			// Update the old ID
			var oldID = player.id;
			console.log("Player reconnected - id: "+oldID+" --> "+client.id);
			for (var j = 0; j < players.length; j++) {
				if (players[j].id == oldID) {
						player = players[j];
						players[j].setID(client.id);
						client.broadcast.emit("player reconnected", { newId: client.id, oldId: oldID });
					} else {
						var existingPlayer = players[j];
						//client.emit("new remote player", existingPlayer);
				}
			};
		}

	};

	PlayerHandler.sendEnemies = function(id) {

		Server.io.to(id).emit("new enemies", EnemyHandler.enemies);

	}

// sends a player to a mapId for other players to see, used mainly for changing maps
	PlayerHandler.sendPlayer = function(player) {

		var newPlayerData = Object.assign({}, player);

		Server.io.to(player.mapId).emit("new player", PlayerHandler.stripPlayerData(newPlayerData));
	}

	PlayerHandler.changeMap = function(p, mapNum) {
		var player = PlayerHandler.playerById(p.id);
		if (Server.io.sockets.connected[player.id]) { // joins new room when changing maps.
			Server.io.sockets.connected[player.id].leave(player.mapId);
			Server.io.to(player.mapId).emit("remove player", { pid: player.pid });
			Server.io.sockets.connected[player.id].join(mapNum);
			player.mapId = mapNum;
			PlayerHandler.sendPlayer(player);
			Server.io.to(player.id).emit("change map", { tilemapName: mapData[mapNum][0], tilesetName: mapData[mapNum][1], imageName: mapData[mapNum][2] });
			setTimeout(function() {PlayerHandler.sendAllPlayers(player.id)}, 2000);
		}
	}

	PlayerHandler.disconnect = function(client) {

		var p = PlayerHandler.playerById(id);
		var myMapId = p.mapId;

		Server.io.to(p.mapId).emit("remove player", {pid: player.pid});
		Server.io.to(client.id).emit("disconnect player");


	}

// addPlayer gives a player a new player id (pid),
// adds the player to the player list,
// then emits the player to the clients
	PlayerHandler.addPlayer = function(client, playerName, playerData) {

		// create a variable we can use to initialize the player into the server
		var p = new Player.init(playerName, playerData.password, playerData.x, playerData.y, client.id);

		var newPlayerData = Object.assign({}, p);

		Server.io.sockets.connected[client.id].join(p.mapId);

		if(!PlayerHandler.playerByName(playerName)) {

			pidCount++;
			p.pid = pidCount;
			players.push(p);

			newPlayerData = Object.assign({}, p);
			Server.io.to(client.id).emit("player connect", PlayerHandler.stripPlayerData(newPlayerData));
			Server.io.to(p.mapId).emit("new player", PlayerHandler.stripPlayerData(newPlayerData));

			PlayerHandler.sendAllPlayers(client.id);


		} else {

			console.log("player reconnected")
			newPlayerData.pid = PlayerHandler.playerByName(playerName).pid;
			Server.io.to(client.id).emit("player connect", PlayerHandler.stripPlayerData(newPlayerData));

			PlayerHandler.sendAllPlayers(client.id);
		}

	}

// sendAllPlayers: sends all players currently on map to the player entering the map
// TODO: only show players near the new player
	PlayerHandler.sendAllPlayers = function(id) {

		var myMapId = PlayerHandler.playerById(id).mapId;

		for (var i = 0; i < players.length; i++) {
			var p = players[i];
			var newPlayerData = Object.assign({}, p);
			if(p.mapId == myMapId && p.id != id) { // if the player is on the same map and it's not yourself
				Server.io.to(id).emit("new player", PlayerHandler.stripPlayerData(newPlayerData));
			}
		}

	}

	PlayerHandler.playerMove = function(data) {
		var p = PlayerHandler.playerById(data.id);

		// removes target when player moves
		if(p) {
			p.target = -1;
		}

		PlayerHandler.setPath(data.id, data.destX, data.destY);
	}

	PlayerHandler.setPath = function(id, x, y) {

		var p = PlayerHandler.playerById(id);

		if(p) {
			p.destX = x;
			p.destY = y;
			p.path = PathFinding.generatePath(0, Math.round(p.x/32), Math.round(p.y/32), Math.round(p.destX/32), Math.round(p.destY/32), 0);
			//console.log(p.path)
		}

	}

// if server hasn't received a heartbeat in 20 seconds, disconnect and remove the player,
// as they have probably lost connection
function checkHeartBeats() {
	for (var i = 0; i < players.length; i++) {
		if(Date.now() - players[i].lastHeartBeat > 20000) {
			Database.SavePlayer(players[i]);
			Server.io.to(players[i].mapId).emit("remove player", { pid: players[i].pid });
			Server.io.to(players[i].id).emit("disconnect player");
			players.splice(i, 1);
		}
	}
}

PlayerHandler.chatMessage = function(data) {

	var p = PlayerHandler.playerById(data.id);
	if(!p) return;

	console.log(p.name + ": " + data.text)

	Server.io.to(p.mapId).emit("chat message", { pid: p.pid, text: data.text })
}

PlayerHandler.heartbeat = function(data) {
	var p = PlayerHandler.playerById(data.id);

	if(p) {
		p.lastHeartBeat = Date.now();
	}

}

PlayerHandler.playerByName = function(pname) { // Find a player by name

	for (var i = 0; i < players.length; i++) {
		if(pname) {
			if (players[i].name.toLowerCase() == pname.toLowerCase()) {
				return players[i];
			}
		}
	};
	return false;
};

PlayerHandler.playerById = function(id) { // Find a player by socket id
	for (var i = 0; i < players.length; i++) {
		if (players[i].id == id) {
			return players[i];
		}
	};
	return false;
};

PlayerHandler.playerByPid = function(id) { // Find a player by player id
	for (var i = 0; i < players.length; i++) {
		if (players[i].pid == id) {
			return players[i];
		}
	};
	return false;
};

// stripPlayerData strips unneeded and unwanted
// data from a player object before sending 
// it to the client
PlayerHandler.stripPlayerData = function(data) {

	var p = data;

	delete p.id;

	return p;

}