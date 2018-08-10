var doGameLoop = setInterval(gameLoop, 100);

function gameLoop() {

	playerLoop();

}

function setGameHandlers() {

	/*if(game.device.desktop) {
		chatText = game.add.text(5, this.game.camera.view.height - 40, "Name: ", chatBoxStyle);
	} else {
		chatText = game.add.text(5, 20, "Name: ", chatBoxStyle);
	}
	chatText.resolution = 1;
	chatText.fixedToCamera = true;*/

	//if(!game.device.desktop) {
	game.input.keyboard.onUpCallback = function(e) {
		console.log('keyCode: '+e.keyCode);

		if(e.keyCode == Phaser.KeyCode.ENTER) {
			if(!isTyping) {
				isTyping = true;
				chatText.setStyle(chatBoxStyle);
				chatText.setShadow(1, 1, 'rgba(0,0,0,1)', 0);
			} else {
				if(!game.device.desktop) {
					//chatText.text = chatText.text.slice(0, -1);
					chatString = chatString.slice(0, -1);
					input.blur();
				}
				socket.emit("chat message", {id: socket.id, text: chatString})
				isTyping = false;
				chatString = "";
				chatText.text = myName+": ";
				chatText.setStyle(chatBoxStyle2);
				chatText.setShadow(1, 1, 'rgba(0,0,0,1)', 0);
			}
		}

		if(isTyping) {
			if(game.device.desktop) {
				if(e.keyCode != Phaser.KeyCode.ENTER && e.keyCode != Phaser.KeyCode.SHIFT && e.keyCode != Phaser.KeyCode.BACKSPACE) {
					var letter;
					if(this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
						letter = String.fromCharCode(e.keyCode);
					} else {
						letter = String.fromCharCode(e.keyCode).toLowerCase();
					}
					chatString += letter;
					chatText.setText(myName+": " + chatString);
				} else if(e.keyCode == Phaser.KeyCode.BACKSPACE) {
					chatString = chatString.slice(0, -1);
					chatText.setText(myName+": " + chatString);
				}
			}
		} else if(!isTyping) {

			if(e.keyCode == Phaser.KeyCode.F) {
				toggleFullscreen();
			}

			if(e.keyCode == Phaser.KeyCode.Z) {
				changeMap("tilemap4", "cave", "tiles2");
			}

		}
	}

	cursors = game.input.keyboard.createCursorKeys();

	//game.input.onDown.add(onDown, this);

	// when playing on a mobile device, automatically toggle the fullscreen
	if(!game.device.desktop) {
		game.input.onTap.add(toggleFullscreen, this);
	}

	//game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
	//game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

	//game.scale.forceLandscape = true;
	//game.scale.forceOrientation(true);

	//game.scale.pageAlignHorizontally = true;
	//game.scale.pageAlignVertically = true;
	game.scale.refresh();

	game.scale.windowConstraints.bottom = "visual";

}