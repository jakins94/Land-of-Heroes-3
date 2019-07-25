function moveCameraToPlayer() {
	var myPlayer = player;
	var pf = playerFollower;
	var distX = Math.floor(myPlayer.x - pf.x);
	var distY = Math.floor(myPlayer.y - pf.y);
	var moveSpeed = 20;// 20

	var camSpeed = Math.ceil(Math.abs((distX / moveSpeed + (distY / moveSpeed))));

	if(distX > camSpeed)
		pf.x += camSpeed;
	else if(distX < camSpeed)
		pf.x -= camSpeed;

	if(distY > camSpeed)
		pf.y += camSpeed;
	else if(distY < camSpeed)
		pf.y -= camSpeed;
}

function cameraFollow() {
	var camSpeed = 3;
	var cam = game.camera;
	var hEdge = player.x - cam.x;
	var vEdge = player.y - cam.y;

	if (hEdge < cameraDeadzone.left || hEdge > cameraDeadzone.right || vEdge < cameraDeadzone.top || vEdge > cameraDeadzone.bottom) {
		var camCenter = { x: cam.x + (cam.width / 2), y: cam.y + (cam.height / 2) };
		var diff = Phaser.Point.subtract(player, camCenter);
		cam.x += diff.x * camSpeed;
		cam.y += diff.y * camSpeed;
	}
}

var size = new Phaser.Rectangle();

function createCamera() {

	var edge = 150;
	var edgeY = 100;

	/*size.setTo(0, 0, 3200, 3200);

	game.camera.scale.x = 2;
    game.camera.scale.y = 2;

    game.camera.bounds.x = size.x * game.camera.scale.x;
    game.camera.bounds.y = size.y * game.camera.scale.y;
    game.camera.bounds.width = size.width * game.camera.scale.x;
    game.camera.bounds.height = size.height * game.camera.scale.y;*/


	//game.camera.deadzone = new Phaser.Rectangle(edge, edgeY, game.camera.width - edge*2, game.camera.height - edgeY*2);
	game.camera.deadzone = new Phaser.Rectangle(edge, edgeY, game.camera.width - edge*2, game.camera.height - edgeY*2);
	edge = 50;
	cameraDeadzone = new Phaser.Rectangle(edge, edge, game.camera.width - edge*2, game.camera.height - edge*2);

	game.camera.follow(player);

}