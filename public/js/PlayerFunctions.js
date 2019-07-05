
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

	game.physics.arcade.moveToXY(p.sprite, p.movingX, p.movingY, 250, 0); //240

	if(p.destX > p.sprite.body.x) {
		p.sprite.scale.setTo(scaleRatio, scaleRatio);
		p.direction = 1;
	} else {
		p.sprite.scale.setTo(-scaleRatio, scaleRatio);
		p.direction = -1;
	}
}

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


		if(distance(p.sprite.x, p.sprite.y, p.destX, p.destY) <= 16) {
			p.stop();
			p.moving = false;

			// unsure if this is correct
			p.path = [];
		} else {
		}


	}
}

// when client receives "player move" data from server
function playerMove(data) {
	var p = playerByPid(data.pid);

	console.log('this should not be appearing')

	// change player's destination coords
	p.destX = data.destX;
	p.destY = data.destY;

	// tells player to move
	game.physics.arcade.moveToXY(p.sprite, p.destX, p.destY,250,0); //240

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
	//console.log(data)
	if(data.name.toLowerCase() == myName.toLowerCase()) {
		console.log('same name')
		return;
	}
	//nplayer = game.add.sprite(64, 350, 'man');
	nplayer = game.add.sprite(108, 1080, 'knight');
	nplayer.scale.setTo(scaleRatio, scaleRatio);
	//player.animations.add('walk', ['sprite2', 'sprite3'], 6, true);
	//player.animations.add('attack', ['sprite7', 'sprite8'], 6, false);

    nplayer.anchor.setTo(.5,.5);
    group2.add(nplayer);
    //player.inputEnabled = true;
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


    game.physics.arcade.enable(nplayer);

    nplayer.animations.add('walk', [0, 1, 2, 3, 4, 5], 10, true);

	nplayer.animations.add('walk2', [0, 1, 2], 10, true);
	nplayer.animations.add('attack', [6,7,8,9], 6, false);


}

function playerAttack(data) {

	var player = playerByPid(data.pid);
	var enemy = enemyById(data.eid);
	var damage = data.damage;

	player.startAnimation('attack');
	enemy.gotHit(damage, player);

}

function playerConnect(data) {

	//player = game.add.sprite(64, 350, 'man');
	player = game.add.sprite(108, 1080, 'knight');
	group2.add(player);
	player.scale.setTo(scaleRatio, scaleRatio);
	//player.animations.add('walk', ['sprite2', 'sprite3'], 6, true);
	//player.animations.add('attack', ['sprite7', 'sprite8'], 6, false);

    player.anchor.setTo(.5,.5);
    //player.inputEnabled = true;
    //
    game.physics.arcade.enable(player);

    player.animations.add('walk', [0, 1, 2, 3, 4, 5], 10, true);
	player.animations.add('walk2', [0, 1, 2], 10, true);
	player.animations.add('attack', [6,7,8,9], 6, false);
	//player.animations.play('walk');
	//player.body.moves = false;
	game.camera.focusOn(player);

	//if(game.device.desktop)
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



/*function playerLoop() {

	//if(!game.device.desktop)
	//	myPlayer.cameraFollow();


	if(!player)
		return;

	//if (game.input.activePointer.isDown) {
        movePlayer();
	//}
	for(var i = 0; i < players.length; i++) {
		if(myPlayer.target >= 0) {
			var myTarget = enemyById(myPlayer.target);

			if(myTarget) {
				player.destX = myTarget.sprite.x;
				player.destY = myTarget.sprite.y;
			}
			
			if(distance(player.x, player.y, player.destX, player.destY) <= 50) {
				player.body.velocity.x = 0;
				player.body.velocity.y = 0;
				//myPlayer.startAttack();
			} else {
				//movePlayer();
			}
		} else {
			if(distance(players[i].sprite.x, players[i].sprite.y, players[i].destX, players[i].destY) <= 32) {
				players[i].stop();
			} else {
				players[i].startAnimation('walk');
			}
		}
	}

}*/