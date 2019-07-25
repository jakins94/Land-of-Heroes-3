// UI.js handles all basic UI that is always displayed on-screen
// Example: Chat buttons, Inventory/Stats/Character buttons, Mobile chat button



function startUI() {

	var chatBoxWidth = 300,
	chatBoxHeight = (startChatBoxY + 30);

	if(!game.device.desktop) {
		var chatButton = game.add.sprite(5, this.game.camera.view.height - 60, 'chaticon');
		chatButton.inputEnabled = true;
		chatButton.scale.setTo(.25, .25);
		chatButton.input.priorityID = 1; 
		chatButton.events.onInputDown.add(openChat, this);
		chatButton.fixedToCamera = true;
		group1.add(chatButton);

		var invButton = game.add.sprite(chatBoxWidth + 10, 5, 'inventoryicon');
		invButton.inputEnabled = true;
		invButton.scale.setTo(1.75, 1.75);
		invButton.input.priorityID = 1; 
		invButton.events.onInputDown.add(toggleInventory, this);
		invButton.fixedToCamera = true;
		group1.add(invButton);
	}

	bmd = game.add.bitmapData(chatBoxWidth, chatBoxHeight);

	bmd.ctx.beginPath();
	bmd.ctx.rect(0, 0, chatBoxWidth, chatBoxHeight);
	bmd.ctx.fillStyle = '#000000';
	bmd.ctx.fill();
	drawnObject = game.add.sprite(0, 0, bmd);
	drawnObject.alpha = chatAlpha;
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