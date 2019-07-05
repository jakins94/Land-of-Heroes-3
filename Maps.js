var rootRequire = require('root-require');

var Maps = rootRequire('Maps');

Maps.mapNames = ['newmap'];
Maps.mapList = [];


Maps.enemyMapList = [];

Maps.initMaps = function() {
		var mapId = 0;
		for(var i=0; i<Maps.mapNames.length; i++) {
    		Maps.mapList[i] = require('./Map Files/'+Maps.mapNames[i]+'.json'); // Load map
    		Maps.mapList[i]["id"] = mapId;
    		// clone the map for enemy map
    		Maps.enemyMapList[i] = JSON.parse(JSON.stringify(Maps.mapList[i]));
    		createEnemyMap(i); // Create map collision array
    		createMap(i);
    		convertMap(i); // Flip collision array
    		mapId++;
    	}
    	console.log("Maps initialized")
    	//console.log(Maps.enemyMapList[0].layers[0]["data"][0])
    };

	var createEnemyMap = function(m) {
		var map = Maps.enemyMapList[m];
		var width = map.layers[5]["width"];
		var height = map.layers[5]["height"];
		var newMap = []; // Init new map

			for(var y=0;y<width;y++) { // create new map array by slicing
				newMap.push(Maps.enemyMapList[m].layers[5].data.slice(y*width,(y+1)*width));
			}

			map.layers[5]["data"] = [];

			for(var i=0;i<newMap.length;i++) { // switch map to the new array
				Maps.enemyMapList[m].layers[5]["data"].push(newMap[i]);
			}


	};

	var createMap = function(m) {
		var map = Maps.mapList[m];
		var width = map.layers[5]["width"];
		var height = map.layers[5]["height"];
		var newMap = []; // Init new map

			for(var y=0;y<width;y++) { // create new map array by slicing
				newMap.push(map.layers[5].data.slice(y*width,(y+1)*width));
			}

			Maps.mapList[m].layers[5]["data"] = [];

			for(var i=0;i<newMap.length;i++) { // switch map to the new array
				Maps.mapList[m].layers[5]["data"].push(newMap[i]);
			}

	};


	var convertMap = function(m) { // Converts the collision map backwards
		var map = Maps.mapList[m];
    	var name = map.layers[5].data; // Array
    	var name2 = map.layers[5].data; // Array
    	var name3 = map.layers[5].data; // Array
    	var width = map.layers[5]["width"];
    	var height = map.layers[5]["height"];
    	var world = [[]];
    	var collisionMapN = [];
    	var collisionMapN2 = [];

    	// check collision layer for collision tiles, 0 = clear 1 = collision tile
    	// this creates collision map for each map and goes into the layer data
		for(var x=0; x<width; x++) {
			collisionMapN[x] = [];
			for(var y=0; y<height; y++) {
				if(name[x][y] != 359) {
					collisionMapN[x][y] = 0;
				} else if(name[x][y] == 359) {
					console.log('1')
					collisionMapN[x][y] = 1;
				}
			}
		}

		for(var y=0; y<height; y++) {
			collisionMapN2[y] = [];
			for(var x=0; x<width; x++) {
				collisionMapN2[y][x] = collisionMapN[x][y];
			}
		}

		Maps.mapList[m].layers[5].data = [];
		for(var i=0;i<collisionMapN2.length;i++){
			Maps.mapList[m].layers[5].data.push(collisionMapN[i]);
		}

		/*name = [];

		for(var i=0;i<collisionMapN2.length;i++){
			name.push(collisionMapN2[i]);
		}*/

		//console.log(collisionMapN);

		/*for (var x=0; x < width; x++) {
			world[x] = [];
			for (var y=0; y < height; y++) {
				world[x][y] = 0;
			}
		}

		for(var i=0;i<name.length;i++){
			name2[i] = name[i]; // Switch it up
		}

		for(var y=0; y<height; y++) {
			for(var x=0; x<width; x++) {
				if (name[y][x] !== null) {
					if (typeof name[y][x] !== "undefined") {
						world[x][y] = name[y][x];
					}
				}
			}
		}

		for(var i=0;i<name.length;i++){
			name[i] = world[i]; // Switch it up
		}

		for(var y=0; y<height; y++) {
			for(var x=0; x<width; x++) {
				if (name2[y][x] !== null) {
					if (typeof name2[y][x] !== "undefined") {
						world[x][y] = name2[y][x];
					}
				}
			}
		}

		for(var i=0;i<name.length;i++){
			name2[i] = world[i]; // Switch it up
		}

		for(var i=0;i<collisionMapN2.length;i++){
			name3.push(collisionMapN[i]);
		}*/
    };