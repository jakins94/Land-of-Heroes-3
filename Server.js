var rootRequire = require('root-require');


var Player 			= rootRequire('Player'),
	PathFinding 	= rootRequire('PathFinding'),
	Functions 		= rootRequire('Functions'),
	PlayerHandler 	= rootRequire('PlayerHandler'),
	Connection 		= rootRequire('Connection'),
	EnemyHandler 	= rootRequire('EnemyHandler'),
	Maps 			= rootRequire('Maps'),
	SpawnHandler 	= rootRequire('SpawnHandler'); 

var Server = rootRequire('Server');

var express = require('express'),
	app = express(),
	port = 8080;

app.use(express.static(__dirname + '/public'));

Server.io = require('socket.io').listen(app.listen(port));

Server.startUp = function() {

	Maps.initMaps();
	SpawnHandler.createEnemySpawns();
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

	PlayerHandler.playerLoop();
	EnemyHandler.enemyLoop();

}

var playerDisconnect = function(data) {
	console.log("Player disconnected: " + data);
}

	

};