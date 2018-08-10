var socket = io.connect('http://localhost:8080');
//var socket = io.connect('http://192.168.1.137:8080');
//var socket = io.connect('http://192.168.0.19:8080');
//var socket = io.connect('http://10.255.69.3:8080');
//var socket = io.connect('http://172.242.68.55:8080');

//var osz = require( 'os' );

//var networkInterfaces = os.networkInterfaces( );

//console.log( networkInterfaces );

//const SAFE_ZONE_WIDTH=400;
//const SAFE_ZONE_HEIGHT=225;
const SAFE_ZONE_WIDTH=800;
const SAFE_ZONE_HEIGHT=450;

var deltaTime;

var w = window.innerWidth * window.devicePixelRatio,
    h = window.innerHeight * window.devicePixelRatio;

var game = new Phaser.Game( SAFE_ZONE_WIDTH, SAFE_ZONE_HEIGHT, Phaser.AUTO, 'gameContainer', { preload: preload, create: create, update: update, render: render });
//var game = new Phaser.Game( w, h, Phaser.AUTO, 'gameContainer', { preload: preload, create: create, update: update, render: render });

var scaleRatio = window.devicePixelRatio / 3;
var player, myPlayer;
var cursors;
var layer, map;

var edge;
var cameraDeadzone;
var recentTarget = false;

var players = [];

var myName = sessionStorage.playerName;

var chats = [];

var isTyping = false;
var chatString = "";

var style2 = { font: "bold 12px Arial", fill: "black" };
var chatText;

var input = document.createElement("input");input.type = "text";input.style.cssText = "position:absolute; left:-1px; top: -1px; width:1px; height:1px; opacity:0";document.body.appendChild(input);

var bg;

var startGameLoop;

var poly, graphics;
var drawnObject, bmd;

var playerName = sessionStorage.playerName;
var playerPass = sessionStorage.playerPass;
$("#pName").html(playerName);
$("#pPass").html(playerPass);

function preload() {

	//game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

	this.game.load.spritesheet('man', 'assets/sprites/man.png', 128, 128);
	this.game.load.spritesheet('knight', 'assets/sprites/knight/player_walk.png', 108, 108);
	this.game.load.image('chaticon', 'assets/sprites/chaticon.png', 800, 800);
    this.game.load.tilemap('tilemap', 'assets/maps/testmap.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap('tilemap2', 'assets/maps/tutorial.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap('tilemap3', 'assets/maps/newmap.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap('tilemap4', 'assets/maps/newmap2.json', null, Phaser.Tilemap.TILED_JSON);


    this.game.load.image('tiles', 'assets/sprites/tilesets/ground.png');
    this.game.load.image('tiles2', 'assets/sprites/tilesets/cavetiles.png');

    this.game.load.image('tiles3', 'assets/sprites/tilesets/mountain.png');

    game.load.audio('bg', 'assets/sounds/bgmusic.ogg');

    this.game.time.advancedTiming = true;
    //this.game.stage.disableVisibilityChange = true;

}

function orderSprites() {
	game.world.bringToTop(group2);
	game.world.bringToTop(group1);
}

var group1, group2;

function create() {

	group1 = game.add.group();
	group2 = game.add.group();

	startSounds();

	eventHandlers();

	setGameHandlers();

	createWorld();

    //createEnemies();

    //createObjects();

    //createPlayer();

    createCamera();

    startUI();

    startGame();

    orderSprites();

	//startGameLoop = setInterval(startGame, 1000);


    //startGame();

    if(!game.device.desktop)
    	toggleFullscreen();

}

function update() {

	deltaTime = game.time.elapsed/1000;

	for(var i = 0; i < players.length; i++) {
		var player = players[i];

		if(player.sprite.body)
			player.draw();
	}

}

function render() {

	game.debug.text(game.time.fps || '--', this.game.camera.view.width - 20, 14, "#00ff00");

}