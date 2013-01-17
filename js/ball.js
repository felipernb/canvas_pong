function Ball(size, velocityX, velocityY, positionX, positionY, board) {
	this.size = size;
	this.velocity = {
		x: velocityX,
		y: velocityY
	};
	this.position = {
		x: positionX,
		y: positionY
	};
	this.board = board;
}

Ball.prototype.bounce = function(axis) {
	this.velocity[axis] = -this.velocity[axis];
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

Ball.prototype.getPosition = function() {
	return this.position;
};
