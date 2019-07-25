var rootRequire = require('root-require');

var Player 			= rootRequire('Player'),
	PlayerHandler 	= rootRequire('PlayerHandler'),
	Server 			= rootRequire('Server'),
	Connection 		= rootRequire('Connection');
	

// for handling a player connection
Connection.playerConnect = function(data) {

	PlayerHandler.onPlayerConnect(data);

}