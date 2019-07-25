function playerById(id) {
	for(var i=0;i<players.length;i++) {
		if(players[i].id == id) {
			return players[i];
		}
	}
	return null;
}

function playerByPid(id) {
	for(var i=0;i<players.length;i++) {
		if(players[i].pid == id) {
			return players[i];
		}
	}
	return null;
}

function enemyById(id) {
	for(var i=0;i<enemies.length;i++) {
		if(enemies[i].id == id) {
			return enemies[i];
		}
	}
	return null;
}

function distance(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

game.keyPressHandler = function(lastKey, keyCode) {

	if(!game.device.desktop) {
			chatString += lastKey;
			chatText.setText(myName+": " + chatString);
	}

}

function startGame() {
	if(socket.id && socket.id !== undefined) {
		socket.emit('player connect', { id: socket.id, playerName: playerName, playerPass: playerPass });
		console.log("Connected with " + socket.id)
		//clearInterval(startGameLoop);
	}
}

function startGame2() {
	if(socket.id && socket.id !== undefined) {
		socket.emit('player connect', { id: socket.id, name: myName });
		console.log("Connected with " + socket.id)
		clearInterval(startGameLoop);
	}
}

function toggleFullscreen() {

	// fullscreen the game if it is not already fullscreened
    if (!this.game.scale.isFullScreen) {
        this.game.scale.startFullScreen(true);
    }

}