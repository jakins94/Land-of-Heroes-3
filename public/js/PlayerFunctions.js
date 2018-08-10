function movePlayer() {

	//var myTarget = enemyById(myPlayer.target);
	
	for(var i = 0; i < players.length; i++) {

		game.physics.arcade.moveToXY(players[i].sprite, players[i].destX, players[i].destY, 7000 * deltaTime);
		//myplayers[i].sprite.animations.play('walk');

		if(!recentTarget) {
			players[i].target = -1;
		}
	}
	
}

function playerMove(data) {
	var p = playerByPid(data.pid);
	p.destX = data.destX;
	p.destY = data.destY;

	if(p.destX > p.sprite.body.x) {
		p.sprite.scale.setTo(scaleRatio, scaleRatio);
		p.direction = 1;
	}
	else {
		p.sprite.scale.setTo(-scaleRatio, scaleRatio);
		p.direction = -1;
	}
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
	nplayer = game.add.sprite(108, 648, 'knight');
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
	nplayer.animations.add('attack', [6,7], 6, false);


}

function playerConnect(data) {

	//player = game.add.sprite(64, 350, 'man');
	player = game.add.sprite(108, 648, 'knight');
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
	player.animations.add('attack', [6,7], 6, false);
	//player.animations.play('walk');
	//player.body.moves = false;
	game.camera.focusOn(player);

	//if(game.device.desktop)
		game.camera.follow(player);

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

function playerLoop() {

	//if(!game.device.desktop)
		//myPlayer.cameraFollow();
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
				myPlayer.startAttack();
			} else {
				//movePlayer();
			}
		} else {
			if(distance(players[i].sprite.x, players[i].sprite.y, players[i].destX, players[i].destY) <= 15) {
				players[i].stop();
			} else {
				players[i].startAnimation('walk');
			}
		}
	}

}