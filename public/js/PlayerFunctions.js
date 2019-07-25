
function playerLoop() {
	for(var i=0;i<players.length;i++) {
		var p = players[i];

		if(typeof p.path != undefined && p.path != 0 && p.path != []) {
			if(!p.moving) {
				p.moving = true;
				p.startAnimation('walk');

				console.log(p.path.length)
				p.destX = p.path[p.path.length-1][0] * 32;
				p.destY = p.path[p.path.length-1][1] * 32;
				playerMoveTo(p.pid, p.path[0][0], p.path[0][1]);
			} else {
				if(distance(p.sprite.x, p.sprite.y, p.movingX, p.movingY) <= 16) {
					p.path.splice(0, 1);
					if(p.path.length > 0) {
						playerMoveTo(p.pid, p.path[0][0], p.path[0][1]);
					} else {
						p.stop();
						p.moving = false;
						p.path = [];
					}
				} else {
					playerMoveTo(p.pid, p.movingX, p.movingY);
				}
			}
		}

		// stop attacking animation if target's HP below 0
		if(p.target != -1) {
			var e = enemyById(p.target);
			if(e) {
				if(e.HP <= 0) {
					p.target = -1;
					p.startAnimation("idle");
				}
			}
		}

		if(distance(p.sprite.x, p.sprite.y, p.destX, p.destY) <= 45) {
			p.stop();
			p.moving = false;

			// unsure if this is correct
			p.path = [];
		} else {
		}


	}
}

function playerHeal(data) {
	var p = playerByPid(data.pid);
	if(!p) return;

	p.gotHealed(data.amount);
}


// potentially dead code?
function movePlayer() {

	//var myTarget = enemyById(myPlayer.target);
	
	for(var i = 0; i < players.length; i++) {

		//game.physics.arcade.moveToXY(players[i].sprite, players[i].destX, players[i].destY, 7000 * deltaTime);

		//myplayers[i].sprite.animations.play('walk');

		/*if(!recentTarget) {
			players[i].target = -1;
		}*/
	}
	
}

// 'player path' from server: sets new enemy path
function playerPath(data) {
	var p = playerByPid(data.pid);

	console.log(data.path[0][0], data.path[0][1])

	if(p) {
		p.path = data.path;
		p.target = data.target;
	}
}

function playerMoveTo(pid, x, y) {

	var p = playerByPid(pid);

	p.movingX = x * 32;
	p.movingY = y * 32;

	game.physics.arcade.moveToXY(p.sprite, p.movingX, p.movingY, 150, 0); //240

	if(p.destX > p.sprite.body.x) {
		p.sprite.scale.setTo(scaleRatio, scaleRatio);
		p.direction = 1;
	} else {
		p.sprite.scale.setTo(-scaleRatio, scaleRatio);
		p.direction = -1;
	}
}

// when client receives "player move" data from server
function playerMove(data) {
	var p = playerByPid(data.pid);

	// change player's destination coords
	p.destX = data.destX;
	p.destY = data.destY;

	// tells player to move

		game.physics.arcade.moveToXY(p.sprite, p.destX, p.destY,150,0); //240
		p.startAnimation('walk');

		// changes player's facing direction
		if(p.destX > p.sprite.body.x) {
			p.sprite.scale.setTo(scaleRatio, scaleRatio);
			p.direction = 1;
		} else {
			p.sprite.scale.setTo(-scaleRatio, scaleRatio);
			p.direction = -1;
		}

}

function disconnectPlayer() {
	console.log("disconnected");
	window.location = "login.html";
}

function removePlayer(data) {
	for(var i = 0; i < players.length; i++) {
		if(players[i] == playerByPid(data.pid)) {
			players[i].sprite.destroy();
			players[i].draw();
			players.splice(i, 1);
		}
	}
}

function newPlayer(data) {

	if(data.name.toLowerCase() == myName.toLowerCase()) {
		console.log('same name')
		return;
	}
	nplayer = game.add.sprite(108, 1080, 'knight');
	nplayer.scale.setTo(scaleRatio, scaleRatio);

    nplayer.anchor.setTo(.5,.5);
    group2.add(nplayer);
    game.physics.arcade.enable(nplayer);
    
    myPlayer2 = new Player(data, nplayer);

    players.push(myPlayer2);

    var barConfig = {
    		width: 40, height: 5, x: myPlayer2.sprite.x, y: myPlayer2.sprite.y + myPlayer2.sprite.height / 2,
			bg: {
	            color: '#FF0000'
	        },
	        bar: {
	            color: '#24FF00'
        	},
        	animationDuration: 50
    }
    myPlayer2.newHealthBar(barConfig);


    

    //nplayer.body.x = data.x;
	//nplayer.body.y = data.y;

    nplayer.animations.add('walk', [0, 1, 2, 3, 4, 5], 10, true);
	nplayer.animations.add('idle', [10, 11, 12, 13], 6, true);
	nplayer.animations.add('attack', [6,7,8,9], 6, false);



}

function playerAttack(data) {

	var player = playerByPid(data.pid);

	player.startAnimation('attack');

}

function playerConnect(data) {

	player = game.add.sprite(108, 1080, 'knight');
	group2.add(player);
	player.scale.setTo(scaleRatio, scaleRatio);

	console.log(data.x)
	

    player.anchor.setTo(.5,.5);

    game.physics.arcade.enable(player);
    player.body.x = data.x;
	player.body.y = data.y;

    player.animations.add('walk', [0, 1, 2, 3, 4, 5], 10, true);
	player.animations.add('idle', [10, 11, 12, 13], 6, true);
	player.animations.add('attack', [6,7,8,9], 6, false);

	game.camera.focusOn(player);

	game.camera.follow(player);
	game.camera.lerp = new Phaser.Point(0.1, 0.1);

    myPlayer = new Player(data, player);

    players.push(myPlayer);

    var barConfig = {
    		width: 40, height: 5, x: myPlayer.sprite.x, y: myPlayer.sprite.y + myPlayer.sprite.height / 2,
			bg: {
	            color: '#FF0000'
	        },
	        bar: {
	            color: '#24FF00'
        	},
        	animationDuration: 50
    }
    myPlayer.newHealthBar(barConfig);


}