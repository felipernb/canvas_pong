function Padel(size, x, y) {
	this.size = size;
	this.x = x;
	this.y = y;
	this.move = 20;
	this.width = 10;
}

Padel.prototype.setBoard = function(board) {
	this.board = board;
};

Padel.prototype.moveUp = function() {
	this.y = Math.max(0, this.y - this.move);
};

Padel.prototype.moveDown = function() {
	this.y = Math.min(board.height - this.size, this.y + this.move);
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
	document.onkeypress = function(e) {
		e = e || window.event;
		var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
		switch (charCode) {
			case 119:
				padel.moveUp();
				break;
			case 115:
				padel.moveDown();
				break;
			case 32:
				pause = !pause;
				break;
		}
	};

	padel.name = 'PLAYER 1';
	return padel;
}

function CPUPlayer(padelSize, x, y) {
	var padel = new Padel(padelSize, x, y);
	padel.updatePosition = function() {
		var ball = this.board.getBall();
		if (ball.position.y > this.y + 2*this.size/3) {
			console.info('up');
			this.moveDown();
		} else if(ball.position.y + ball.size <= this.y + this.size/3) {
			this.moveUp();
			console.info('down');
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
