function Padel(size, x, y) {
	this.size = size;
	this.x = x;
	this.y = y;
	this.move = 20;
	this.width = 10;
	this.direction = 0;
}

Padel.prototype.setBoard = function(board) {
	this.board = board;
};

Padel.prototype.moveUp = function() {
	this.y = Math.max(0, this.y - this.move);
	this.direction = -1;
};

Padel.prototype.moveDown = function() {
	this.y = Math.min(board.height - this.size, this.y + this.move);
	this.direction = 1;
};

Padel.prototype.getDirection = function() {
	return this.direction;
};

Padel.prototype.getPosition = function() {
	return { x: [this.x, this.x + this.width], y: [this.y, this.y + this.size]};
};

Padel.prototype.draw = function(ctx) {
	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.fillRect(this.x, this.y, this.width, this.size);
};

function HumanPlayer(padelSize, x, y) {
	var padel = new Padel(padelSize, x, y);
	document.onkeydown = function(e) {
		e = e || window.event;
		var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
		switch (charCode) {
			case 38:
				e.preventDefault();
				padel.moveUp();
				break;
			case 40:
				e.preventDefault();
				padel.moveDown();
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
				padel.direction = 0;
				break;
		}
	};
	padel.name = 'PLAYER 1';
	return padel;
}

function CPUPlayer(padelSize, x, y) {
	var padel = new Padel(padelSize, x, y);
	var difficulty = 9.5/10;
	padel.updatePosition = function() {
		var ball = this.board.getBall();
		if (ball.position.y > this.y + difficulty * this.size) {
			this.moveDown();
		} else if(ball.position.y + ball.size <= this.y + this.size * (1-difficulty)) {
			this.moveUp();
		} else {
			this.direction = 0;
		}
	};

	padel.draw = function(ctx) {
		this.updatePosition();
		ctx.fillStyle = "rgb(255, 255, 255)";
		ctx.fillRect(this.x, this.y, this.width, this.size);
	};

	padel.name = 'CPU';
	return padel;
}
