var rootRequire = require('root-require');

var Functions = rootRequire('Functions');

Functions.distance = function(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}