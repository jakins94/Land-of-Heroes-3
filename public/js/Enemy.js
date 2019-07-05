var Enemy = Class.extend({

	init: function(data, sprite) {
		this.name = data.name;
		this.id = data.id;
		this.target = -1;
		this.maxHP = data.maxhp;
		this.HP = data.maxhp;
		this.strength = 1;
		this.startX = data.x;
		this.startY = data.y;
		this.x = data.x;
		this.y = data.y;
		this.destX = this.x;
		this.destY = this.y;
		this.lastAttack = 0;
		this.attackRange = 60;
		this.followDistance = 500;
		this.speed = 2;
		this.alive = true;
		this.attackSpeed = 750;
		this.healthBar = null;

		this.sprite = sprite;

		this.hitArray = [];

		this.num1 = 1.15, this.num2 = 2.15;

		this.newHealthBar = function(config) {
			this.healthBar = new HealthBar(game, config);
			group1.add(this.healthBar.bgSprite);
			group1.add(this.healthBar.barSprite);
		};

		var style = { font: "16px Impact", fill: "#ff0044", /*wordWrap: true, wordWrapWidth: sprite.width,*/ align: "center" };

		var style2 = { font: "16px Impact", fill: "#74c61a", wordWrap: true, wordWrapWidth: sprite.width * 5, align: "center" };
		//var style3 = { font: "12px Impact", fill: "black", wordWrap: true, wordWrapWidth: sprite.width * 5, align: "center" };


		var nameText = game.add.text(0, 0, this.name, style);
		group1.add(nameText);
		nameText.setShadow(1, 1, 'rgba(0,0,0,1)', 0);
		nameText.resolution = 1;
		nameText.anchor.set(.5);

		var chatText = game.add.text(0, 0, "", style2);
		group2.add(chatText);
		chatText.setShadow(1, 1, 'rgba(0,0,0,1)', 0);
		chatText.resolution = 1;
		//var chatText2 = game.add.text(0, 0, "", style3);

		this.startAnimation = function(aName) {
			if(!sprite.animations.currentAnim.isPlaying || sprite.animations.currentAnim.loop) {
				var myAnim = this.sprite.animations.play(aName);
			}
		};

		this.draw = function() {

			if(!this.sprite.body) {
				nameText.destroy();
				this.healthBar.kill();
				return;
			}
			
			nameText.x = Math.floor(this.sprite.body.x + this.sprite.body.width / 2);
			nameText.y = Math.floor(this.sprite.body.y - 18);

			chatText.x = Math.floor(this.sprite.body.x + this.sprite.body.width / 2);
			chatText.y = Math.floor(this.sprite.body.y - 30);

			if(this.healthBar != null) {
				var healthPercent = (this.HP / this.maxHP) * 100;
				this.healthBar.setPosition(Math.floor(this.sprite.body.x + (this.sprite.body.width / 2)), Math.floor(this.sprite.body.y - 10));
				this.healthBar.setPercent(healthPercent);
			}


			for(var i=0;i<this.hitArray.length;i++) {
				this.hitArray[i][1]*=1.05;
				this.hitArray[i][0].y = this.sprite.body.y - this.hitArray[i][1];
				this.hitArray[i][0].alpha = 1 - (this.hitArray[i][1] / 100);
				if(this.hitArray[i][1] > 100) {
					this.hitArray[i][0].destroy();
					this.hitArray.splice(i, 1);
				}
			}
   	 		
		};

		this.stop = function() {

			this.sprite.body.velocity.x = 0;
			this.sprite.body.velocity.y = 0;
			
		};

		this.gotHit = function(damage, player) {
			this.HP -= damage;

			var damageText = game.add.text(0, 0, damage, style);
			group1.add(damageText);
			damageText.setShadow(1, 1, 'rgba(0,0,0,1)', 0);
			damageText.resolution = 1;
			damageText.x = this.sprite.body.x + (this.sprite.body.width / 2);

			var hit = [damageText, 2];

			this.hitArray.push(hit);
		};

		this.onDeath = function() {
			this.name = 'Dead';
			this.alive = false;
			this.fighting = false;
			this.target = -1;
		};

		this.draw2 = function(ctx, bgX, bgY) {

			//ctx.fillStyle = 'red';
			//ctx.fillRect(this.x+bgX-16, this.y+bgY-16, 32, 32);
			ctx.drawImage(this.sprite, this.x+bgX-48, this.y+bgY-48);

			ctx.fillStyle = 'red';
			ctx.fillRect(this.x+bgX-38, this.y+bgY+18, 48 * (this.hp / this.maxhp), 3);
			ctx.strokeStyle = '#000';
			ctx.strokeRect(this.x+bgX-38, this.y+bgY+18, 48, 3);

			ctx.fillStyle = '#000';
			ctx.textAlign = 'center';
			ctx.font = 'bold 15px Arial';
			ctx.fillStyle = '#000';
			ctx.fillText(this.name, this.x+bgX-15, this.y+bgY-39);
			ctx.fillStyle = '#e6e6e6';
			ctx.fillText(this.name, this.x+bgX-16, this.y+bgY-40);

			ctx.fillStyle = 'orange';
			ctx.strokeStyle = 'black';

			for(let i=0;i<this.hitArray.length;i++) {
				ctx.save();
				this.hitArray[i][1] = this.hitArray[i][1] * 1.090;
				this.hitArray[i][2] = this.hitArray[i][2] * 1.125;
				this.hitArray[i][3] = this.hitArray[i][3] * 1.055;
				console.log(this.hitArray[i][1], this.hitArray[i][2], this.hitArray[i][3]);
				ctx.globalAlpha = 1 - (this.hitArray[i][2] / 1000);
				ctx.font = 'bold 30px Acknowledge';
				ctx.fillText(this.hitArray[i][0], this.x+bgX-16 + this.hitArray[i][3], this.y+bgY - this.hitArray[i][1]);
				ctx.font = '30px Acknowledge';
				ctx.strokeText(this.hitArray[i][0], this.x+bgX-16 + this.hitArray[i][3], this.y+bgY - this.hitArray[i][1]);
				ctx.restore();

				/*if(this.hitArray[i][1] / 1000 >= 1)
					this.hitArray.splice(i, 1);*/

					if(this.hitArray[i][2] / 950 >= 1)
						delete this.hitArray[i];
			}

			for(let i=0;i<this.hitArray.length;i++) {
				if(typeof this.hitArray[i] == "undefined")
					this.hitArray.splice(i, 1);
			}

		};

		//this.spriteId = spriteId;
	}

});
