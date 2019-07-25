var rootRequire = require('root-require');

var Database = rootRequire('Database');

Database.db;

Database.init = function() {
	var MongoClient = require('mongodb').MongoClient;

	var url = "mongodb://myUserAdmin:abc123@127.0.0.1:27017/test";
	//var url = "mongodb://admin:Testabcd2@127.0.0.1:27017/test";
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  Database.db = db.collection('player');
	});
}

Database.SavePlayer = function(key){

	var player = key;
	var strippedPlayer = Database.savePlayerCompress(player);

	Database.update('player',{name: player.name.toLowerCase}, strippedPlayer, Database.err);

}

// compress player data before it enters the database
// delete unnecessary data when saving
Database.savePlayerCompress = function(p){

	p.x = Math.round(p.x);
	p.y = Math.round(p.y);

	p.name = p.name.toLowerCase();

	delete p.pid;
	delete p.id;
	delete p.attackRange;
	delete p.movingX;
	delete p.movingY;
	delete p.destX;
	delete p.destY;
	delete p.path;
	delete p.moving;
	delete p.fighting;
	delete p.fightTimer;
	delete p.attackTimer;
	delete p.target;
	delete p.lastHeartBeat;
	
    return p;
}

Database.update = function(name,searchInfo,updateInfo,cb){
	Database.db.update(searchInfo, updateInfo);
}

//Old auto-reconnect
/*setInterval(function(){	
	db = require("mongojs").connect(databaseURI, collections, MONGO.options);
},60000);*/