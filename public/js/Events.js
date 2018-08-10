var eventHandlers = function eventHandlers() {

	socket.on('player connect', playerConnect);
	socket.on('new player', newPlayer);
	socket.on('player move', playerMove);
	socket.on('remove player', removePlayer);
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