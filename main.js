var rootRequire = require('root-require');

var Player, Connection, PlayerHandler;
	Player = rootRequire('Player'); Connection = rootRequire('Connection'); PlayerHandler = rootRequire('PlayerHandler');
	var Database = rootRequire('Database');

var Server = rootRequire('Server');

global.rootRequire = function(){}
global.onReady = function(){}

Database.init();

Server.startUp();

//var conn = require('./Connection');