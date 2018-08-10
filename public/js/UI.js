function startUI() {
	if(!game.device.desktop) {
		var chatButton = game.add.sprite(5, this.game.camera.view.height - 60, 'chaticon');
		chatButton.inputEnabled = true;
		chatButton.scale.setTo(.25, .25);
		chatButton.input.priorityID = 1; 
		chatButton.events.onInputDown.add(openChat, this);
		chatButton.fixedToCamera = true;
		group1.add(chatButton);
	}

	var dWidth = 300, dHeight = startChatBoxY + 30;
	bmd = game.add.bitmapData(dWidth, dHeight);

	bmd.ctx.beginPath();
	bmd.ctx.rect(0, 0, dWidth, dHeight);
	bmd.ctx.fillStyle = '#000000';
	bmd.ctx.fill();
	drawnObject = game.add.sprite(0, 0, bmd);
	drawnObject.alpha = .3;
	drawnObject.fixedToCamera = true;
	group1.add(drawnObject);

	createChatBox();

	chats.push("Server: Welcome to Land of Heroes!");
	chatText = game.add.text(3, startChatBoxY + 12, myName+": ", chatBoxStyle2);
	group1.add(chatText);
	chatText.setShadow(1, 1, 'rgba(0,0,0,1)', 0);
	chatText.resolution = 1;
	chatText.fixedToCamera = true;
	updateChatBox();

}