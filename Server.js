var rootRequire = require('root-require');

var Player, PlayerHandler;
	Player = rootRequire('Player'); PlayerHandler = rootRequire('PlayerHandler'); var Connection = rootRequire('Connection'); 

var Server = rootRequire('Server');

var express = require('express'),
	app = express(),
	port = 8080;

app.use(express.static(__dirname + '/public'));

Server.io = require('socket.io').listen(app.listen(port));

Server.startUp = function() {

	console.log("Server started... awaiting connections...");

	Server.io.on('connection', function(client) {

		client.on('player connect', Connection.playerConnect);
		client.on('heartbeat', PlayerHandler.heartbeat);
		client.on('player movement', PlayerHandler.playerMove);
		client.on('chat message', PlayerHandler.chatMessage);
		client.on('disconnect', playerDisconnect);
		//client.send(client.id);

	});

var playerDisconnect = function(data) {
	console.log("Player disconnected: " + data);
}

	

};