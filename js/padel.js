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

function CPUPlayer(padelSize, x, y) {
	var parent = new Padel(padelSize, x, y);
	parent.updatePosition = function() {
		var ball = this.board.getBall();
		if (ball.position.y > this.y + this.size) {
			this.moveDown();
		} else if(ball.position.y + ball.size < this.y) {
			this.moveUp();
		}
	};

	parent.draw = function(ctx) {
		this.updatePosition();
		ctx.fillStyle = "rgb(255, 255, 255)";
		ctx.fillRect(this.x, this.y, this.width, this.size);
	};
	return parent;
}
