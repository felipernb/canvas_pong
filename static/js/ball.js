function Ball(size, velocityX, velocityY, positionX, positionY, maxVelocityX, maxVelocityY) {
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

	this.maxVelocityX = maxVelocityX || 15; //15px/frame = 900px/sec
	this.maxVelocityY = maxVelocityY || 4; //4px/frame = 240px/sec
}

Ball.prototype.setBoard = function(board) {
	this.board = board;
};

Ball.prototype.bounce = (function() {
	var beep = new Audio('soundfx/ping_pong_8bit_beeep.ogg');
	var plop = new Audio('soundfx/ping_pong_8bit_plop.ogg');
	var peeeeeep = new Audio('soundfx/ping_pong_8bit_peeeeeep.ogg');
	var sound;

	return function(axis, score) {
		sound = (score ? peeeeeep : (axis == 'y' ? beep : plop));
		//sound.load(); // This needs to be removed as an optimization to avoid requests
		sound.play();
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

	var paddle = this.board.getPaddle(this.velocity.x);
	var paddleCoordinates = paddle.getPosition();

	/* the ball is in the Y range of the paddle */
	var ballInPaddleYRange = paddleCoordinates.y[0] <= Math.max(newY + this.size, 0) &&
		paddleCoordinates.y[1] >= Math.min(newY, this.board.getHeight());

	var ballInLeftPaddleXRange = (this.velocity.x < 0 &&
		newX <= paddleCoordinates.x[1] &&
		newX >= paddleCoordinates.x[0]);

	var ballInRightPaddleXRange = (this.velocity.x > 0 &&
		newX + this.size >= paddleCoordinates.x[0] &&
		newX + this.size <= paddleCoordinates.x[1]);

	var bounceX = ballInPaddleYRange && (ballInLeftPaddleXRange || ballInRightPaddleXRange);
	var bounceY = (newY <= 0 || newY + this.size > this.board.getHeight());

	if (bounceX) {
		this.position.x = paddleCoordinates.x[(ballInLeftPaddleXRange ? 1:0)] - (ballInRightPaddleXRange? this.size : 0);
		this.velocity.x = (this.velocity.x > 0 ? 1 : -1) * Math.min(Math.abs(this.velocity.x) + 1, this.maxVelocityX);
		this.bounce('x');
		this.spin(paddle.getDirection());
	} else {
		this.position.x = (newX <= 0 ? 0 : (newX + this.size >= this.board.getWidth() ? this.board.getWidth() - this.size : newX));
		if (this.position.x <= 0 || this.position.x + this.size >= this.board.getWidth()) {
			this.board.score(this.position.x <= 0 ? 0 : 1);
			this.bounce('x', true);
			this.velocity.x = this.velocity.x / Math.abs(this.velocity.x) * Math.abs(this.initialVelocity.x); //restore initial velocity modulus		
		}
	}

	this.position.y = (newY <= 0 ? 0 : (newY + this.size >= this.board.getHeight() ? this.board.getHeight() - this.size : newY));
	if (bounceY) { this.bounce('y'); }
};

Ball.prototype.spin = function(direction) {
	// If the paddle is stoped, it doesn't add any spin.
	// If it's moving up, spin down and vice-versa
	var spin = (direction ? (direction < 0 ? 1 : -1) : 0);
	this.velocity.y = (this.velocity.y >= 0 ? 1 : -1) * Math.min(Math.abs(this.velocity.y) + spin, this.maxVelocityY);
};

Ball.prototype.draw = function(ctx) {
	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
};
