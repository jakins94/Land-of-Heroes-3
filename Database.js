var rootRequire = require('root-require');

var Database = rootRequire('Database');

Database.db;

Database.init = function() {
	var MongoClient = require('mongodb').MongoClient;

	var url = "mongodb://myUserAdmin:abc123@127.0.0.1:27017/test";
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  Database.db = db.collection('player');
	});
}

Database.SavePlayer = function(key){
	var player = key;
	player = Database.Saveplayercompress(player);
   // var toSave = ['playerName','playerPass','x','absX','y','absY','maxhp','money'];
   // var save = {};
   var save = player;
    var i;
    //for(var i in toSave){	save[toSave[i]] = player[toSave[i]]; console.log(save[toSave[i]]); }
	
   // if(updateDb !== false) db.update('player',{username:player.username},save,db.err);
	Database.update('player',{playerName:player.name},save,Database.err);
	//DB.update('player',{username:player.playerName},save);
   //	return save;	//when sign up
}

Database.Saveplayercompress = function(p){
	//p = deepClone(p);

	p.x = Math.round(p.x);
	p.absX = Math.round(p.absX);
	p.y = Math.round(p.y);
	p.absY = Math.round(p.absY);
	
    return p;
}

Database.update = function(name,searchInfo,updateInfo,cb){
	if(arguments.length === 3) return Database.db.player.update(searchInfo,updateInfo);
	else return Database.db.update(searchInfo,updateInfo,cb);
}

//Old auto-reconnect
/*setInterval(function(){	
	db = require("mongojs").connect(databaseURI, collections, MONGO.options);
},60000);*/