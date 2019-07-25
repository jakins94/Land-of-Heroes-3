// Chat.js controls the chat UI that is displayed on-screen

var chatAlpha = 0.4;

function chatMessage(data) {
	var p = playerByPid(data.pid);

	p.newMessage(data.text);

	chatBoxMessage(data.text, p.name);
}

function chatBoxMessage(text, name) {
	var messageLength = text.length + name.length;
	var maxLength = 100;
	var message = name + ": " + text;
	if(messageLength > maxLength) {
		message = message.slice(0, maxLength);
	}
	if(messageLength <= maxLength/2) {
		chats.unshift(message);
	} else if(messageLength > maxLength/2){
		var message1 = message.slice(0, maxLength/2);
		var message2 = message.slice(maxLength/2, message.length);
		var lastLetter = message1[maxLength/2 - 1], firstLetter = message2[0];
		if(lastLetter != " " && firstLetter != " ") {
			message1 += "-";
		}
		chats.unshift(message1);
		chats.unshift(message2);
	}
	updateChatBox();
}

var chatBoxChats = {};

var maxChatStrings = 10;

var chatBoxStyle = { font: "bold 12px Arial", fill: "#ff0044", /*wordWrap: true, wordWrapWidth: sprite.width,*/ align: "center" };
var chatBoxStyle2 = { font: "bold 12px Arial", fill: "#14ba19", /*wordWrap: true, wordWrapWidth: sprite.width,*/ align: "center" };

var startChatBoxY = (maxChatStrings * 9.25);

function createChatBox() {
	for(var i = 0; i < maxChatStrings; i++) {
		chatBoxChats["chat"+i] = game.add.text(3, startChatBoxY - (i * 11), "", chatBoxStyle);
		group1.add(chatBoxChats["chat"+i]);
		chatBoxChats["chat"+i].fixedToCamera = true;
		chatBoxChats["chat"+i].setShadow(1, 1, 'rgba(0,0,0,1)', 0);
	}
}

function updateChatBox() {

	var chatBoxText;
	for(var i = 0; i < maxChatStrings; i++) {
		if(chats[i]) {
			chatBoxChats["chat"+i].text = chats[i]; 
		}
	}

}