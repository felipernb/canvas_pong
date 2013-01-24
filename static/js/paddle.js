function Paddle(size, x, y) {
	this.size = size;
	this.x = x;
	this.y = y;
	this.move = 20;
	this.width = 20;
	this.direction = 0;
}

Paddle.prototype.setBoard = function(board) {
	this.board = board;
};

Paddle.prototype.moveUp = function() {
	this.y = Math.max(0, this.y - this.move);
	this.direction = -1;
};

Paddle.prototype.moveDown = function() {
	this.y = Math.min(board.height - this.size, this.y + this.move);
	this.direction = 1;
};

Paddle.prototype.getDirection = function() {
	return this.direction;
};

Paddle.prototype.getPosition = function() {
	return { x: [this.x, this.x + this.width], y: [this.y, this.y + this.size]};
};

Paddle.prototype.draw = function(ctx) {
	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.fillRect(this.x, this.y, this.width, this.size);
};

function HumanPlayer(paddleSize, x, y) {
	var paddle = new Paddle(paddleSize, x, y);
	document.onkeydown = function(e) {
		e = e || window.event;
		var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
		switch (charCode) {
			case 38:
				e.preventDefault();
				paddle.moveUp();
				break;
			case 40:
				e.preventDefault();
				paddle.moveDown();
				break;
			case 32:
				pause = !pause;
				break;
		}
	};

	document.onkeyup = function(e) {
		e = e || window.event;
		var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
		switch (charCode) {
			case 38:
			case 40:
				paddle.direction = 0;
				break;
		}
	};
	paddle.name = 'PLAYER 1';
	return paddle;
}

function CPUPlayer(paddleSize, x, y) {
	var paddle = new Paddle(paddleSize, x, y);
	var difficulty = 9/10;
	paddle.updatePosition = function() {
		var ball = this.board.getBall();
		if (ball.position.y > this.y + difficulty * this.size) {
			this.moveDown();
		} else if(ball.position.y + ball.size <= this.y + this.size * (1-difficulty)) {
			this.moveUp();
		} else {
			this.direction = 0;
		}
	};
	paddle.move = 4;
	paddle.draw = function(ctx) {
		this.updatePosition();
		ctx.fillStyle = "rgb(255, 255, 255)";
		ctx.fillRect(this.x, this.y, this.width, this.size);
	};

	paddle.name = 'CPU';
	return paddle;
}
