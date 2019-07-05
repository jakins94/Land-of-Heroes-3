var enemies = []; // local enemies


function enemyLoop() {
	for(var i=0;i<enemies.length;i++) {
		var e = enemies[i];

		if(typeof e.path != undefined && e.path != 0 && e.path != []) {
			if(!e.moving) {
				e.moving = true;
				e.destX = e.path[0][0] * 32;
				e.destY = e.path[0][1] * 32;
				enemyMoveTo(e.id, e.path[0][0], e.path[0][1]);
			} else {
				if(distance(e.sprite.x, e.sprite.y, e.movingX, e.movingY) <= 16) {
					e.path.splice(0, 1);
					enemyMoveTo(e.id, e.path[0][0], e.path[0][1]);
				}
			}
		}

		if(distance(enemies[i].sprite.x, enemies[i].sprite.y, enemies[i].destX, enemies[i].destY) <= 32) {
			enemies[i].stop();
			enemies[i].moving = false;

			// unsure if this is correct
			enemies[i].path = [];
			e.startAnimation('idle');
		}

		if(!e.moving)
			e.startAnimation('idle');


	}
}

function enemyMoveTo(id, x, y) {

	var e = enemyById(id);

	e.movingX = x * 32;
	e.movingY = y * 32;

	game.physics.arcade.moveToXY(e.sprite, e.movingX, e.movingY, 250, 0); //240

	if(e.destX > e.sprite.body.x) {
		e.sprite.scale.setTo(scaleRatio, scaleRatio);
		e.direction = 1;
	} else {
		e.sprite.scale.setTo(-scaleRatio, scaleRatio);
		e.direction = -1;
	}
}

// 'enemy path' from server: sets new enemy path
function enemyPath(data) {
	var e = enemyById(data.id);

	console.log(data.path)

	if(e) {
		e.path = data.path;
		e.target = data.target;
	}
}

// when client receives "enemy move" data from server

function enemyMove(data) {
	var e = enemyById(data.id);

	// change enemy's destination coords
	e.destX = data.destX;
	e.destY = data.destY;

	// tells enemy to move
	game.physics.arcade.moveToXY(e.sprite, e.destX, e.destY,250,0); //240

	// changes enemy's facing direction
	if(e.destX > e.sprite.body.x) {
		e.sprite.scale.setTo(scaleRatio, scaleRatio);
		e.direction = 1;
	} else {
		e.sprite.scale.setTo(-scaleRatio, scaleRatio);
		e.direction = -1;
	}

}

function enemyAttack(data) {

	var player = playerByPid(data.pid);
	var enemy = enemyById(data.eid);
	var damage = data.damage;

	enemy.startAnimation('attack');

	player.gotHit(damage, enemy);

}

var enemyAnims =
	{ 
		"slime": {
			"idle": {
				"frames": [ 21, 20, 19, 18, 17],
				"speed": 3,
				"loop": true
			},
			"walk": {
				"frames": [ 0, 1, 2],
				"speed": 6,
				"loop": false
			},
			"attack": {
				"frames": [ 13, 12, 11, 10, 9 ],
				"speed": 6,
				"loop": false
			}
		}
	};

function newEnemies(data) {

	var newEnemy, enemy;


	for(var i=0;i < data.length;i++) {
		newEnemy = data[i];
		enemy = game.add.sprite(newEnemy.x, newEnemy.y, newEnemy.spriteName);

		if(enemyAnims[newEnemy.spriteName]) {
			Object.keys(enemyAnims[newEnemy.spriteName]).forEach(function(a) {

				// name, frames, speed, loop (t/f)
				enemy.animations.add(a, enemyAnims[newEnemy.spriteName][a].frames, enemyAnims[newEnemy.spriteName][a].speed, enemyAnims[newEnemy.spriteName][a].loop);

			});
		}


		enemy.scale.setTo(scaleRatio, scaleRatio);
		enemy.anchor.setTo(.5,.5);
		group2.add(enemy);

		var createEnemy = new Enemy(data[i], enemy);



		enemies.push(createEnemy);

		var barConfig = {
    		width: 40, height: 5, x: createEnemy.sprite.x, y: createEnemy.sprite.y + createEnemy.sprite.height / 2,
			bg: {
	            color: '#FF0000'
	        },
	        bar: {
	            color: '#24FF00'
        	},
        	animationDuration: 50
    	}

		createEnemy.newHealthBar(barConfig);
		game.physics.arcade.enable(enemy);
	}

	console.log(enemies)

}