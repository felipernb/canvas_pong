function Padel(size, x, y) {
	this.size = size;
	this.x = x;
	this.y = y;
	this.move = 10;
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

Padel.prototype.draw = function(ctx) {
	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.fillRect(this.x, this.y, 10, this.size);
};
