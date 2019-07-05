var Db = exports.Db = function(){ return exports; }
var Init = exports.Init = {};
var cls = require("./Class").Class;

var MONGO = {
		username: "admin",
		password: "Testabcd",
		server: '127.0.0.1',
		port: '27017',
		db: 'test',
		connectionString: function(){return 'mongodb://'+this.username+':'+this.password+'@'+this.server+':'+this.port+'/'+this.db;},
		options: {server:{auto_reconnect: true,socketOptions:{connectTimeoutMS:60000,keepAlive:60000,socketTimeoutMS:60000}}}
	};
	var databaseURI = MONGO.connectionString();
	
	var collections = ["player"];
	
	//real direct db
	var DB = require("mongojs").connect(databaseURI, collections, MONGO.options);
	setInterval(function(){	
		DB = require("mongojs").connect(databaseURI, collections, MONGO.options);
	},60000);

var Db = cls.extend({
Init: function(data){
	data = data || {};
	
		//refresh connection
	
	//intermediare db
	
	
	//db.deleteAll();
	//db.filterDb();
	
	//Init.db.rscalc(); //rs
}
});

	exports.find = function(name,searchInfo,wantedData,cb){
		if(arguments.length === 3) return DB[name].find(searchInfo,wantedData);
		else return DB[name].find(searchInfo,wantedData,cb);
	}
	exports.findOne = function(name,searchInfo,wantedData,cb){
		//var DB = new Db();
		if(arguments.length === 3) return DB[name].findOne(searchInfo,{_id:0},wantedData);
		else {	wantedData._id = 0; return DB[name].findOne(searchInfo,wantedData,cb); }
	}
	exports.save = function(name,info,cb){
		return DB[name].save(info,cb);
	}
	exports.update = function(name,searchInfo,updateInfo,cb){
		if(arguments.length === 3) return DB.player.update(searchInfo,updateInfo);
		else return DB.player.update(searchInfo,updateInfo,cb);
	}
	exports.upsert = function(name,searchInfo,updateInfo,cb){	
		if(arguments.length === 3) return DB[name].update(searchInfo,updateInfo,{upsert:true});
		else return DB[name].update(searchInfo,updateInfo,{upsert:true},cb);
	}
	exports.insert = function(name,updateInfo,cb){
		return DB[name].insert(updateInfo,cb);
	}
	exports.remove = function(name,searchInfo,cb){
		return DB[name].remove(searchInfo,cb);
	}
	
	exports.count = function(name,query,cb){
		return DB.runCommand({count:name,query: query},cb);
	}
	

	
	
	//delete everything in db
	exports.deleteAll = function(rscalc){
		for(var i in collections){
			if(i === 'rscalc' && rscalc !== false) continue;
			DB[collections[i]].remove();
		}
		INFO('DELETED EVERYTHING IN DATABASE!');
	}

	//Clear Db of useless info. ex: weapon dropped by player
	//TOFIX
	exports.filterDb = function(){
		//fill bigList
		var bigList = {};	//list of all equip used
		exports.find('main',{},function(er,main){ if(er) throw er;
			for(var i in main){
				for(var j in main[i].invList) bigList[main[i].invList[j][0]] = 1;
				for(var j in main[i].bankList) bigList[main[i].bankList[j][0]] = 1;
			}
			exports.find('player',{},function(er,act){ if(er) throw er;
				for(var i in act){
					for(var j in act[i].equip) bigList[act[i].equip[j]] = 1;
				}
			
				INFO('list of used equip:\n',Object.keys(bigList));
				
				//fill equipList
				var equipList = {};	//list of all equip
				exports.find('equip',{},function(er,res){ if(er) throw er;
					for(var i in res)	equipList[res[i].id] = 1;
					for(var i in bigList)	delete equipList[i];
					
					INFO(Object.keys(equipList).length + 'unused equip\n',Object.keys(equipList));
					for(var i in equipList) exports.remove('equip',{'id':i});
				});
			});
		});


	}

	exports.err = function(err){ if (err) throw err; }