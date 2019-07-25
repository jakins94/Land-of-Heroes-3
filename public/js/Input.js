
// when a player clicks down or taps on the screen
function onDown() {

	var clickX = game.input.activePointer.worldX;
	var clickY = game.input.activePointer.worldY;

	myPlayer.target = -1;

	// check if player is attempting to attack an enemy
	for(var i=0;i<enemies.length;i++) {
		var enemy = enemies[i];

		// if click is in enemy radius, make the enemy your target
		if((clickX >= enemy.sprite.body.x - 40 && clickX <= enemy.sprite.body.x + 40) && (clickY >= enemy.sprite.body.y - 40 && clickY <= enemy.sprite.body.y + 40)) {
			
			myPlayer.target = enemy.id;
			console.log(myPlayer.target)
			socket.emit("player vs enemy", { id: socket.id, target: myPlayer.target });
		}
	}

	// if a target wasn't clicked, player is moving
	if(myPlayer.target == -1) {
		myPlayer.moveX = game.input.activePointer.worldX;
		myPlayer.moveY = game.input.activePointer.worldY;

		socket.emit("player movement", { id: socket.id, destX: myPlayer.moveX, destY: myPlayer.moveY });
	}
}

// when a player presses chat button
function openChat() {
		inputBox.focus();
		inputBox.click();
		isTyping = true;
}