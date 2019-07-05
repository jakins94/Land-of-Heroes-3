var rootRequire = require('root-require');

var Player, Connection;

	Player = rootRequire('Player'); Connection = rootRequire('Connection');
	var Server = rootRequire('Server'), Database = rootRequire('Database'), EnemyHandler = rootRequire('EnemyHandler'), PathFinding = rootRequire('PathFinding');

var PlayerHandler = rootRequire('PlayerHandler'); 



PlayerHandler.players = [];

var players = PlayerHandler.players;

var pidCount = Math.round(Math.random() * 10000);

var heartbeatLoop = setInterval(checkHeartBeats, 2000);

PlayerHandler.onPlayerConnect = function(data) {
	var toClient = Server.io.sockets.connected[data.id];
	if(typeof data.playerName !== "undefined")
		var playerName = data.playerName;

	//Database.db.player.findOne( { name: playerName }, function(err, savedUser) {
	Database.db.findOne( { name: playerName }, function(err, savedUser) {
		if(err || !savedUser) {
			console.log("User "+data.playerName+" not in db");

			console.log("pass "+data.playerPass)

			var player = new Player.init(playerName, data.playerPass, data.id);
			pidCount++;
			player.pid = pidCount;
			//playerNumber++;
			Database.db.save(player, function(err2, savedUser2) {
				if(err2 || !savedUser2) {
						console.log("User not saved because of error" + err2);
					} else {
						console.log("User saved");
						//this is needed
						//toClient.emit("validated");
						PlayerHandler.addPlayer(toClient, playerName, player);

				}
			});
			//onLogout(data);
		} else {

			//if(!savedUser) return socket.emit('signIn', { 'success':0,'message':'<font color="red">Wrong Password or Username.</font>' });
		
		//if(account.banned) return socket.emit('signIn', { 'success':0, 'message':'<font color="red">This account is banned.</font>' });
		
			var pass = data.playerPass;
			if(pass !== savedUser.password) {
				console.log("Wrong pass for "+playerName+": "+pass+" / "+savedUser.password)
				toClient.emit("disconnect player");
				return;
			}
			
			/*if(account.online){
				if(List.nameToKey[user]) Sign.off(List.nameToKey[user]);
				db.update('account',{playerName:user},{'$set':{online:0}},db.err);
				return socket.emit('signIn', { 'success':0, 'message':'<font color="red">This account was online.<br>We just logged it off.<br>Try connecting again.</font>' });
			}*/
			//Success!
			//socket.emit('signIn', { 'success':1,'message':'Loading account...' });
			
			
			//var key = "P" + Math.randomId();
			//Load(key,account,socket);
			//
			//var player = PlayerHandler.playerByName(data.playerName);

			//needed
			//toClient.emit("new player", player);
			//toClient.emit("validated");
			
			PlayerHandler.addPlayer(toClient, savedUser.name, savedUser);

			//console.log(savedUser)
			console.log(data.playerName+" has connected.");
			PlayerHandler.sendEnemies(data.id);
		}
	});
};

PlayerHandler.joinPlayer = function(client, playerName, playerPass) {
	// Send existing players to client
	var existingEnemy;
	var allEnemies = [];
	var player = PlayerHandler.playerByName(playerName);


	if(!player) { // New Localplayer
		var existingPlayer;

		// Create the new player
		player = new Player.init(playerPass.playerName, playerPass.playerPass, client.id);
		players.push(player);

		var newPlayer = { x: player.absX, y: player.absY, playerName: playerPass.playerName, pid: player.pid };
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

	//client.join(player.mapId); //join socket channel for map id
	//client.emit("new message", {player: "Server", text: "Welcome to the game! 'WASD' to move, 'i' for inventory, 'k' for abilities, 'q' for quests.", mode: "s"});
};

// tilemapName: name of the tilemap in preload
// tilesetName: name of the tileset in Tiled
// imageName: name of the tileset image in preload
var mapData = [
["tilemapName",	 "tilesetName",	"imageName"],
["tilemap3",	 "mountain",	"tiles3"],
["tilemap4",	 "cave",		"tiles2"]];

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
PlayerHandler.addPlayer = function(client, playerName, playerPass) {

	// create a variable we can use to initialize the player into the server
	var p = new Player.init(playerName, playerPass.password, client.id);
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

		console.log(PlayerHandler.players)

	} else {

		console.log("player reconnected")
		newPlayerData.pid = PlayerHandler.playerByName(playerName).pid;
		Server.io.to(client.id).emit("player connect", PlayerHandler.stripPlayerData(newPlayerData));

		PlayerHandler.sendAllPlayers(client.id);

		console.log(PlayerHandler.players)

	}

}

PlayerHandler.sendAllPlayers = function(id) {

	var myMapId = PlayerHandler.playerById(id).mapId;

	for (var i = 0; i < players.length; i++) {
		var p = players[i];
		var newPlayerData = Object.assign({}, p);
		console.log(p.mapId, myMapId)
		if(p.mapId == myMapId) {
			Server.io.to(id).emit("new player", PlayerHandler.stripPlayerData(newPlayerData));
		}
	}

}

PlayerHandler.setPath = function(id, x, y) {

	var p = PlayerHandler.playerById(id);

	if(p) {
		p.destX = x;
		p.destY = y;
		p.path = PathFinding.generatePath(0, Math.round(p.x/32), Math.round(p.y/32), Math.round(p.destX/32), Math.round(p.destY/32), 0);
		console.log(p.path)
		//Server.io.to(p.mapId).emit("player path", { pid: p.pid, path: p.path, target: p.target })
		
		//Server.io.to(p.mapId).emit("player move", { pid: p.pid, destX: data.destX, destY: data.destY})
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

// if server hasn't received a heartbeat in 20 seconds, disconnect and remove the player,
// as they have probably lost connection
function checkHeartBeats() {
	for (var i = 0; i < players.length; i++) {
		if(Date.now() - players[i].lastHeartBeat > 20000) {
			Database.SavePlayer(players[i]);
			Server.io.to(players[i].mapId).emit("remove player", { pid: players[i].pid });
			Server.io.to(players[i].id).emit("disconnect player");
			players.splice(i, 1);
			console.log(players)
		}
	}
}

PlayerHandler.chatMessage = function(data) {
	var p = PlayerHandler.playerById(data.id);
	console.log(data.text)
	if(p) {
		Server.io.to(p.mapId).emit("chat message", { pid: p.pid, text: data.text })
	}
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