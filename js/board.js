function Board(width, height) {
	this.width = width;
	this.height = height;
}

Board.prototype.getWidth = function() {
	return this.width;
};

Board.prototype.getHeight = function() {
	return this.height;
};
