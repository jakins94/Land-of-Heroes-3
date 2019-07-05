var Player = Class.extend({

	init: function(data, sprite) {
		this.name = data.name;
		this.sprite = sprite;
		this.hitArray = [];
		this.healthBar = null;

		this.path = [];

		this.pid = data.pid;
		this.target = -1;
		this.myTarget = null;
		this.recentTarget = false;
		this.canAttack = true;

		this.maxHP = 100;
		this.HP = this.maxHP;
		this.maxMP = 75;
		this.MP = this.maxMP;
		this.strength = 10;
		this.defense = 10;

		this.chatMessage = "";

		this.animationIdle = true;

		this.sprite.x = data.destX;
		this.sprite.y = data.destY;

		this.movingX = data.destX;
		this.movingY = data.destY;

		this.destX = data.destX;
		this.destY = data.destY;

		this.lastAttack = -1;

		this.newHealthBar = function(config) {
			this.healthBar = new HealthBar(game, config);
			group1.add(this.healthBar.bgSprite);
			group1.add(this.healthBar.barSprite);
		};

		this.gotHit = function(damage, enemy) {
			this.HP -= damage;

			var damageText = game.add.text(0, 0, damage, style);
			group1.add(damageText);
			damageText.setShadow(1, 1, 'rgba(0,0,0,1)', 0);
			damageText.resolution = 1;
			damageText.x = this.sprite.body.x + (this.sprite.body.width / 2);

			var hit = [damageText, 2];

			this.hitArray.push(hit);
		};

		this.stop = function() {

			this.sprite.body.velocity.x = 0;
			this.sprite.body.velocity.y = 0;
			if(!sprite.animations.currentAnim.isPlaying || sprite.animations.currentAnim.loop) {
				this.sprite.frame = 0;
				this.sprite.animations.stop();
			}
		};

		this.startAnimation = function(aName) {
			if(!sprite.animations.currentAnim.isPlaying || sprite.animations.currentAnim.loop) {
				var myAnim = this.sprite.animations.play(aName);
			}
		};

		this.startAttack = function() {
			var theEnemy = enemyById(this.target);
				if(Date.now() - this.lastAttack > 1000 && theEnemy.HP > 0) {
					var damage = 1 + Math.floor(Math.random() * 10);
					theEnemy.getHit(damage, this.pid);
					this.lastAttack = Date.now();
					this.startAnimation('attack');
				} else {
					this.stop();
				}
		};

		this.getHit = function(damage, id) {
			var attacker = enemyById(id);
			if(attacker) {

			}
			this.HP -= damage;
			var hitLength = this.hitArray.length;
			var theText = game.add.text(this.sprite.x, this.sprite.y, ""+damage, { font: "12px Arial Black", fill: "red" });
			var newHit = [theText, 10];
			this.hitArray.push(newHit);
		};

		this.addXP = function(amount) {
			this.experience += amount;
			var hitLength = this.hitArray.length;
			var theText = game.add.text(this.sprite.x, this.sprite.y, "+ "+amount, { font: "12px Arial Black", fill: "purple" });
			var newHit = [theText, 10];
			this.hitArray.push(newHit);
		};

		this.cameraFollow = function() {
			var cam = game.camera;
			var hEdge = this.sprite.x - cam.x;
			var vEdge = this.sprite.y - cam.y;

			if (hEdge < cameraDeadzone.left || hEdge > cameraDeadzone.right || vEdge < cameraDeadzone.top || vEdge > cameraDeadzone.bottom) {
				var camCenter = { x: cam.x + (cam.width / 2), y: cam.y + (cam.height / 2) };
				var diff = Phaser.Point.subtract(this.sprite, camCenter);
				cam.x += diff.x * 1.8;
				cam.y += diff.y * 1.8;
			}
		};

		//Phaser.Text.prototype.defuzz = function () {            var _this = this;            setImmediate(function () {                var dx = _.round(_this.worldPosition.x) - _this.worldPosition.x;                var dy = _.round(_this.worldPosition.y) - _this.worldPosition.y;                _this.x += dx;                _this.y += dy;            });        };

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
		var resetText;
		

		this.newMessage = function(message) {
			//chatText = game.add.text(0, 0, message, style2);
			chatText.setText(message);
			chatText.resolution = 1;
			chatText.anchor.set(.5);
			clearTimeout(resetText);
			resetText = setTimeout(function() {
				chatText.setText("");
				//chatText2.setText("");
			}, 5000)
		}

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
				this.hitArray[i][0].y = this.sprite.y - this.hitArray[i][1];
				this.hitArray[i][0].alpha = 1 - (this.hitArray[i][1] / 100);
				if(this.hitArray[i][1] > 100) {
					this.hitArray[i][0].kill();
					this.hitArray.splice(i, 1);
				}
			}
   	 		
		};

	}


});
