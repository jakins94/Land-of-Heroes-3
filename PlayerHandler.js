var rootRequire = require('root-require');

var Player, Connection;

	Player = rootRequire('Player'); Connection = rootRequire('Connection');
	var Server = rootRequire('Server'), Database = rootRequire('Database');

var PlayerHandler = rootRequire('PlayerHandler'); 



PlayerHandler.players = [];

var players = PlayerHandler.players;

var pidCount = Math.round(Math.random() * 10000);

var heartbeatLoop = setInterval(checkHeartBeats, 2000);

PlayerHandler.onPlayerConnect = function(data) {
	var toClient = Server.io.sockets.connected[data.id];
	if(typeof data.playerName !== "undefined")
		var playerName = data.playerName.toLowerCase();

	//Database.db.player.findOne( { name: playerName }, function(err, savedUser) {
	Database.db.findOne( { name: playerName }, function(err, savedUser) {
		if(err || !savedUser) {
			console.log("User "+data.playerName+" not in db");

			console.log("pass"+data.playerPass)

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
		//initEquips(player.getID()); // Don't remove
		//initItems(player.getID());
		var newPlayer = { x: player.absX, y: player.absY, playerName: playerPass.playerName, pid: player.pid };
		client.broadcast.emit("new player", newPlayer);
		//client.broadcast.emit("new message", {player: playerName, text: "joined the game", mode: "s"});

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

	//moveMaps(player, 580, 168, 2);
};

// tilemapName: name of the tilemap in preload
// tilesetName: name of the tileset in Tiled
// imageName: name of the tileset image in preload
var mapData = [
["tilemapName",	 "tilesetName",	"imageName"],
["tilemap3",	 "mountain",	"tiles3"],
["tilemap4",	 "cave",		"tiles2"]];

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

PlayerHandler.playerMove = function(data) {
	var p = PlayerHandler.playerById(data.id);
	if(p) {
		p.destX = data.destX;
		p.destY = data.destY;
		console.log(p.destX, p.destY)
		Server.io.to(p.mapId).emit("player move", { pid: p.pid, destX: data.destX, destY: data.destY})
	}

	if(p.destX > 840 && p.destX < 900 && p.destY > 1000 && p.destY < 1050) {
		PlayerHandler.changeMap(p, 2);
	}
}

function checkHeartBeats() {
	for (var i = 0; i < players.length; i++) {
		if(Date.now() - players[i].lastHeartBeat > 10000) {
			Database.SavePlayer(players[i]);
			Server.io.to(players[i].mapId).emit("remove player", { pid: players[i].pid });
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

PlayerHandler.playerById = function(id) { // Find a player by name
	for (var i = 0; i < players.length; i++) {
		if (players[i].id == id) {
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