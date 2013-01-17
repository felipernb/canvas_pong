function Board(width, height) {
	this.width = width;
	this.height = height;
	this.elements = {};
}

Board.prototype.getWidth = function() {
	return this.width;
};

Board.prototype.getHeight = function() {
	return this.height;
};

Board.prototype.setBall = function(ball) {
	this.elements.ball = ball;
	ball.setBoard(this);
};

Board.prototype.setPadels = function(padel1, padel2) {
	this.elements.padel1 = padel1;
	padel1.setBoard(this);

	this.elements.padel2 = padel2;
	padel2.setBoard(this);
};

/**
 * direction < 0 means that the ball is going to the left
 * (negative velocity)
 */
Board.prototype.getPadel = function(direction) {
	return direction < 0 ? padel1 : padel2;
};

Board.prototype.draw = function(context) {
	for (var i in this.elements) {
		if (this.elements[i].refreshPosition) this.elements[i].refreshPosition();
		this.elements[i].draw(context);
	}
};
