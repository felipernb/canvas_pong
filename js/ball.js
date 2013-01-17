function Ball(size, velocityX, velocityY, positionX, positionY) {
	this.size = size;
	this.velocity = {
		x: velocityX,
		y: velocityY
	};
	this.position = {
		x: positionX,
		y: positionY
	};
}

Ball.prototype.setBoard = function(board) {
	this.board = board;
};

Ball.prototype.bounce = (function() {
	var beep = document.createElement('audio');
	beep.src = 'soundfx/ping_pong_8bit_beeep.ogg';

	var plop = document.createElement('audio');
	plop.src = 'soundfx/ping_pong_8bit_plop.ogg';
	return function(axis) {
		if (axis == 'y') beep.play();
		else plop.play();

		this.boostVelocity(axis, -1);
	};
})();

Ball.prototype.boostVelocity = function(axis, factor) {
	this.velocity[axis] *= factor;
};

Ball.prototype.setPosition = function(x, y) {
	this.position.x = x;
	this.position.y = y;
};

Ball.prototype.refreshPosition = function() {
	var newX = this.position.x + this.velocity.x;
	var newY = this.position.y + this.velocity.y;

	var padelCoordinates = this.board.getPadel(this.velocity.x).getPosition();

	var bounceX = (padelCoordinates.y[0] < newY && padelCoordinates.y[1] >= newY + this.size) /* the ball is in the Y range of the padel */ && (
		(this.velocity.x < 0 && padelCoordinates.x[1] == newX) ||
		(this.velocity.x > 0 && padelCoordinates.x[0] == newX + this.size));

	var bounceY = (newY < 0 || newY + this.size > this.board.getHeight());

	this.position.x = (newX < 0 ? 0 : (newX + this.size >= this.board.getWidth() ? this.board.getWidth() - this.size : newX));
	this.position.y = (newY < 0 ? 0 : (newY + this.size >= this.board.getHeight() ? this.board.getHeight() - this.size : newY));

	if (newX <= 0 || newX + this.size >= this.board.getWidth()) {
		this.board.score(newX <= 0 ? 0 : 1);
	} else {
		if (bounceX) { this.bounce('x');}
		if (bounceY) { this.bounce('y');}
	}
};

Ball.prototype.draw = function(ctx) {
	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
};
