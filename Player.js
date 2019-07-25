var rootRequire = require('root-require');

var Connection 	= 	rootRequire('Connection'),
	Player		=	rootRequire('Player');

Player.init = function(name, password, x, y, id) {
		this.name = name;
		this.password = password;
		this.id = id;
		this.inventory = [];
		this.maxHP = 100;
		this.HP = this.maxHP;
		this.x = x;
		this.y = y;
		this.destX = this.x;
		this.destY = this.y;
		this.movingX = 0;
		this.movingY = 0;
		this.path = [];
		this.moving = false;
		this.fighting = false;
		this.fightTimer = Date.now();
		this.healTimer = Date.now();
		this.target = -1;
		this.attackRange = 45;
		this.lastHeartBeat = Date.now();
		this.mapId = 0;
		this.attackTimer = 0;
}
