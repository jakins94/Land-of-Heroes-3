var rootRequire = require('root-require');

var Connection;
//global.onReady(function(){
	Connection = rootRequire('Connection'); 
//});
var Player = rootRequire('Player');

Player.init = function(name, password, id) {
		this.name = name;
		this.password = password;
		this.id = id;
		this.inventory = [];
		this.x = 120;
		this.y = 240;
		this.destX = this.x;
		this.destY = this.y;
		this.target = -1;
		this.attackRange = 75;
		this.lastHeartBeat = Date.now();
		this.mapId = 1;
}

/*var cls = require('./Class').Class;
var Player = cls.extend({

	init: function(name, id) {
		this.name = name;
		this.id = id;
		this.inventory = [];
		this.x = 120;
		this.y = 240;
		this.destX = this.x;
		this.destY = this.y;
		this.target = -1;
		this.attackRange = 75;
	}

});

// Export the Player class so you can use it in
// other files by using require("Player").Player
exports.Player = Player;*/
