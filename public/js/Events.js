var eventHandlers = function eventHandlers() {

	socket.on('player connect', playerConnect);
	socket.on('new player', newPlayer);
	socket.on('player move', playerMove);
	socket.on('remove player', removePlayer);
	socket.on('disconnect player', disconnectPlayer);
	socket.on('player attack', playerAttack);
	socket.on('player path', playerPath);

	socket.on('new enemies', newEnemies);
	socket.on('enemy attack', enemyAttack);
	socket.on('enemy move', enemyMove);
	socket.on('enemy path', enemyPath);


	socket.on('chat message', chatMessage);
	socket.on('change map', eventChangeMap);

};

var heartBeatLoop = setInterval(sendHeartBeat, 2000);

function sendHeartBeat() {
	socket.emit("heartbeat", { id: socket.id });
}

function eventChangeMap(data) {
	var tilesetName = data.tilesetName,
		tilemapName = data.tilemapName,
		imageName = data.imageName;

		console.log(data)

	changeMap(tilemapName, tilesetName, imageName);
}