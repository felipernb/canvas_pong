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

Board.prototype.setPadels = function(padel0, padel1) {
	this.elements.padel0 = padel0;
	padel0.setBoard(this);

	this.elements.padel1 = padel1;
	padel1.setBoard(this);
};

Board.prototype.setScorePanel = function(score0, score1) {
	this.elements.score0 = score0;
	this.elements.score1 = score1;
};

Board.prototype.score = (function() {
	var sound = document.createElement('audio');
	sound.src = 'soundfx/ping_pong_8bit_peeeeeep.ogg';
	return function(padel) {
		sound.play();
		var scorer = padel ^ 1;
		if (this.elements["score" + scorer].points == 9) {
			this.gameOver(scorer);
		} else {
			this.elements["score" + scorer].points++;
			this.elements.ball.setPosition(this.width/2 - this.elements.ball.size/2, this.height/2);
			this.elements.ball.bounce('x');
		}
	};
})();

Board.prototype.gameOver = function(scorer) {
	gameOver = true;
	winner = scorer;
};

/**
 * direction < 0 means that the ball is going to the left
 * (negative velocity)
 */
Board.prototype.getPadel = function(direction) {
	return direction < 0 ? this.elements.padel0 : this.elements.padel1;
};

Board.prototype.draw = function(context) {
	for (var i in this.elements) {
		if (this.elements[i].refreshPosition) this.elements[i].refreshPosition();
		this.elements[i].draw(context);
	}
};
