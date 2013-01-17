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
	var sound = document.createElement('audio');
	sound.src='soundfx/ping_pong_8bit_plop.ogg';
	return function(axis) {
		sound.play();
		this.boostVelocity(axis, -1);
	};
})();

Ball.prototype.boostVelocity = function(axis, factor) {
	this.velocity[axis] *= factor;
};

Ball.prototype.refreshPosition = function() {
	var newX = this.position.x + this.velocity.x;
	var newY = this.position.y + this.velocity.y;
	var bounceX = (newX < 0 || newX + this.size > this.board.getWidth());
	var bounceY = (newY < 0 || newY + this.size > this.board.getHeight());

	this.position.x = (newX < 0 ? 0 : (newX + this.size > this.board.getWidth() ? this.board.getWidth() - this.size : newX));
	this.position.y = (newY < 0 ? 0 : (newY + this.size > this.board.getHeight() ? this.board.getHeight() - this.size : newY));

	if (bounceX) { this.bounce('x');}
	if (bounceY) { this.bounce('y');}
};

Ball.prototype.draw = function(ctx) {
	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
};
