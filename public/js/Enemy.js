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
		this.destroyTimer = -1;

		this.sprite = sprite;

		this.hitArray = [];

		this.num1 = 1.15, this.num2 = 2.15;

		this.newHealthBar = function(config) {
			this.healthBar = new HealthBar(game, config);
			group2.add(this.healthBar.bgSprite);
			group2.add(this.healthBar.barSprite);
		};

		// name text
		var style = { font: "16px Impact", fill: "#ff0044", align: "center" };

		// chat text
		var style2 = { font: "16px Impact", fill: "#74c61a", wordWrap: true, wordWrapWidth: sprite.width * 5, align: "center" };

		// damage text
		var style3 = { font: "12px Impact", fill: "#ff0044", align: "center" };

		// heal text
		var style5 = { font: "14px Impact", fill: "#36ff00", align: "center" };

		var nameText = game.add.text(0, 0, this.name, style);
		group2.add(nameText);
		nameText.setShadow(1, 1, 'rgba(0,0,0,1)', 0);
		nameText.resolution = 1;
		nameText.anchor.set(.5);

		var chatText = game.add.text(0, 0, "", style2);
		group2.add(chatText);
		chatText.setShadow(1, 1, 'rgba(0,0,0,1)', 0);
		chatText.resolution = 1;
		//var chatText2 = game.add.text(0, 0, "", style3);

		this.startAnimation = function(aName) {
			if(!this.sprite.body) return;

			if(((!sprite.animations.currentAnim.isPlaying || sprite.animations.currentAnim.loop)
				&& (!sprite.animations.currentAnim.name != "death"))
				|| aName == "death") {
				var myAnim = this.sprite.animations.play(aName);
			}
		};

		this.gotHealed = function(amount) {

			if(this.HP == this.maxHP) return;
			
			if(this.HP + amount >= this.maxHP)
				amount = this.maxHP - this.HP;

			this.HP += amount;

			var healText = game.add.text(0, 0, amount, style5);
			group1.add(healText);
			healText.setShadow(1, 1, 'rgba(0,0,0,1)', 0);
			healText.resolution = 1;
			healText.x = this.sprite.body.x + (this.sprite.body.width / 2);
			healText.y = this.sprite.body.y;

			var hit = [healText, 2];

			this.hitArray.push(hit);
		};

		this.draw = function() {

			if(!this.sprite.body) {
				nameText.destroy();
				this.healthBar.kill();
				return;
			}
			
			nameText.x = Math.floor(this.sprite.body.x + this.sprite.body.width / 2);
			nameText.y = Math.floor(this.sprite.body.y - 18);

			if(this.destroyTimer != -1) {
				var newAlpha = this.destroyTimer * .1;
				if(newAlpha > 1) newAlpha = 1;
				if(newAlpha < 0.5) newAlpha = 0.5;
				nameText.alpha = newAlpha;
				this.sprite.alpha = newAlpha;
				this.healthBar.setAlpha(newAlpha);
			}

			chatText.x = Math.floor(this.sprite.body.x + this.sprite.body.width / 2);
			chatText.y = Math.floor(this.sprite.body.y - 30);

			if(this.healthBar != null) {
				var healthPercent = (this.HP / this.maxHP) * 100;
				this.healthBar.setPosition(Math.floor(this.sprite.body.x + (this.sprite.body.width / 2)), Math.floor(this.sprite.body.y - 10));
				this.healthBar.setPercent(healthPercent);
			}


			for(var i=0;i<this.hitArray.length;i++) {
				this.hitArray[i][1]*=1.05;
				this.hitArray[i][0].y -= this.hitArray[i][1] / 20;
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

			if(this.alive) {
				this.HP -= damage;

				var damageText = game.add.text(0, 0, damage, style3);
				group1.add(damageText);
				damageText.setShadow(1, 1, 'rgba(0,0,0,1)', 0);
				damageText.resolution = 1;
				damageText.x = this.sprite.body.x + (this.sprite.body.width / 2);
				damageText.y = this.sprite.body.y;

				var hit = [damageText, 2];

				this.hitArray.push(hit);

				if(this.HP <= 0) {
					this.die();
				}
			}

		};

		this.die = function() {
			this.startAnimation("death");
			this.alive = false;
			this.target = -1;
			this.destroyTimer = 15;
		};

		this.remove = function() {
			this.stop();
			nameText.destroy();
			this.healthBar.kill();
			for(var i=0;i<this.hitArray.length;i++) {
				this.hitArray[i][0].destroy();
			}
			this.sprite.destroy();
		};

	}

});
