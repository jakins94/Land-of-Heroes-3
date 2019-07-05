var rootRequire = require('root-require');

var Player, PlayerHandler;
	Player = rootRequire('Player');
	PlayerHandler = rootRequire('PlayerHandler');
	
var Server = rootRequire('Server');

var Connection = rootRequire('Connection');

// for handling a player connection
Connection.playerConnect = function(data) {

	// add player to the global players
	//PlayerHandler.addPlayer(data);
	PlayerHandler.onPlayerConnect(data);

}