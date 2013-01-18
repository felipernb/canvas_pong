function Ball(size, velocityX, velocityY, positionX, positionY) {
	this.size = size;
	this.initialVelocity = {
		x: velocityX,
		y: velocityY
	};
	this.velocity = {
		x: this.initialVelocity.x,
		y: this.initialVelocity.y
	};
	this.position = {
		x: positionX,
		y: positionY
	};
}

Ball.prototype.setBoard = function(board) {
	this.board = board;
};

Ball.prototype.bounce = (function() {
	var beep = document.createElement('audio');
	beep.src = 'soundfx/ping_pong_8bit_beeep.ogg';

	var plop = document.createElement('audio');
	plop.src = 'soundfx/ping_pong_8bit_plop.ogg';

	var peeeeeep = document.createElement('audio');
	peeeeeep.src = 'soundfx/ping_pong_8bit_peeeeeep.ogg';

	return function(axis, score) {
		if (axis == 'y') {
			beep.play();
		} else if (score) {
			peeeeeep.play();
		} else {
			plop.play();
		}

		this.velocity[axis] *= -1;
	};
})();

Ball.prototype.setPosition = function(x, y) {
	this.position.x = x;
	this.position.y = y;
};

Ball.prototype.refreshPosition = function() {
	var newX = this.position.x + this.velocity.x;
	var newY = this.position.y + this.velocity.y;

	var padelCoordinates = this.board.getPadel(this.velocity.x).getPosition();
	var ballInPadelYRange = padelCoordinates.y[0] <= newY && padelCoordinates.y[1] >= newY + this.size;  /* the ball is in the Y range of the padel */ 
	var ballInLeftPadelXRange = this.velocity.x < 0 && newX <= padelCoordinates.x[1] && this.position.x >= padelCoordinates.x[0];
	var ballInRightPadelXRange = this.velocity.x > 0 && newX + this.size >= padelCoordinates.x[0] && this.position.x + this.size <= padelCoordinates.x[1];
	var bounceX = ballInPadelYRange && (ballInLeftPadelXRange || ballInRightPadelXRange);

	var bounceY = (newY < 0 || newY + this.size > this.board.getHeight());

	if (bounceX) {
		this.position.x = padelCoordinates.x[(ballInLeftPadelXRange ? 1:0)] - (ballInRightPadelXRange? this.size : 0);
	} else {
		this.position.x = (newX < 0 ? 0 : (newX + this.size >= this.board.getWidth() ? this.board.getWidth() - this.size : newX));
	}

	this.position.y = (newY < 0 ? 0 : (newY + this.size >= this.board.getHeight() ? this.board.getHeight() - this.size : newY));

	if (newX <= 0 || newX + this.size >= this.board.getWidth()) {
		this.board.score(newX <= 0 ? 0 : 1);
		this.bounce('x', true);
		this.velocity.x = this.velocity.x / Math.abs(this.velocity.x) * Math.abs(this.initialVelocity.x); //restore initial velocity modulus		
	} else {
		if (bounceX) {
			this.velocity['x'] *= 1.1;
			this.bounce('x');
		}
		if (bounceY) { this.bounce('y');}
	}
};

Ball.prototype.draw = function(ctx) {
	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
};
