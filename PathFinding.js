var rootRequire = require('root-require');
var PF = require('pathfinding');

var PathFinding = rootRequire('PathFinding'), Maps = rootRequire('Maps');

var gridClone;

var grid;
var gridBackup;
var finder = new PF.AStarFinder();
var worldSize = 100;
var tileSize = 32;

PathFinding.init = function() {


}

PathFinding.generatePath = function(pid, x1, y1, x2, y2, mapId) {

	var myMap = Maps.mapList[0].layers[5].data;
	var grid = new PF.Grid(myMap);
	var pfinder = new PF.AStarFinder({
		diagonalMovement: PF.DiagonalMovement.OnlyWhenNoObstacles
	});

	var path = pfinder.findPath(x1, y1, x2, y2, grid);

	return path;
	/*if(typeof path !== "undefined" && path.length > 0) {
		var newPath = PF.Util.smoothenPath(grid, path);
			console.log(newPath);
			return newPath;
	}*/

}