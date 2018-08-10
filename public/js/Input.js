function onDown() {
	//myPlayer.destX = game.input.activePointer.worldX;
	//myPlayer.destY = game.input.activePointer.worldY;

	myPlayer.moveX = game.input.activePointer.worldX;
	myPlayer.moveY = game.input.activePointer.worldY;

	socket.emit("player movement", { id: socket.id, destX: myPlayer.moveX, destY: myPlayer.moveY });
}

function openChat() {
		input.focus();
		isTyping = true;
}