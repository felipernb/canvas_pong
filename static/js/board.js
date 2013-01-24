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

Board.prototype.getBall = function() {
	return this.elements.ball;
};

Board.prototype.setPaddles = function(paddle0, paddle1) {
	this.elements.paddle0 = paddle0;
	paddle0.setBoard(this);

	this.elements.paddle1 = paddle1;
	paddle1.setBoard(this);
};

Board.prototype.setScorePanel = function(score0, score1) {
	this.elements.score0 = score0;
	this.elements.score1 = score1;
};

Board.prototype.score = function(paddle) {
	var scorer = paddle ^ 1;
	if (this.elements["score" + scorer].points == 9) {
		this.gameOver(scorer);
	} else {
		this.elements["score" + scorer].points++;
	}
};

Board.prototype.gameOver = function(scorer) {
	gameOver = true;
	winner = scorer;
};

/**
 * direction < 0 means that the ball is going to the left
 * (negative velocity)
 */
Board.prototype.getPaddle = function(direction) {
	return direction < 0 ? this.elements.paddle0 : this.elements.paddle1;
};

Board.prototype.draw = function(context) {
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	context.fillStyle = "rgba(255, 255, 255, 0.5)";
	var i;
	for(i = 0; i < this.height; i += this.height / 30) {
		context.fillRect(this.width/2 - 1, i, 2, this.height/40);
	}

	for (i in this.elements) {
		if (this.elements[i].refreshPosition) this.elements[i].refreshPosition();
		this.elements[i].draw(context);
	}
};

