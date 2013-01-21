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

	this.maxVelocityX = maxVelocityX || 20;
	this.maxVelocityY = maxVelocityY || 10;
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

	var padel = this.board.getPadel(this.velocity.x);
	var padelCoordinates = padel.getPosition();
	var ballInPadelYRange = padelCoordinates.y[0] <= Math.max(newY, 0) && padelCoordinates.y[1] >= Math.min(newY + this.size, this.board.getHeight());  /* the ball is in the Y range of the padel */ 
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

	if ((newX <= 0 || newX + this.size >= this.board.getWidth()) && !bounceX) { // Score
		this.board.score(newX <= 0 ? 0 : 1);
		this.bounce('x', true);
		this.velocity.x = this.velocity.x / Math.abs(this.velocity.x) * Math.abs(this.initialVelocity.x); //restore initial velocity modulus		
	} else {
		if (bounceX) {
			this.velocity.x *= 1.1;
			this.velocity.x = (this.velocity.x > 0 ? 1 : -1) * Math.min(Math.abs(this.velocity.x), this.maxVelocityX);
			this.bounce('x');
			this.spin(padel.getDirection());
		}
		if (bounceY) { this.bounce('y');}
	}
};

Ball.prototype.spin = function(direction) {
	var spin = Math.round(Math.random() * 2); //a bit of randomness
	if (direction < 0) { // padel moving up, ball spins down
		this.velocity.y += spin;
	} else if (direction > 0) { // padel movind down, ball spins up
		this.velocity.y -= spin;
	} else {
		this.velocity.y += (Math.round(Math.random()) ? 1 : -1) * spin;
	}
	this.velocity.y = (this.velocity.y > 0 ? 1 : -1) * Math.min(Math.abs(this.velocity.y), this.maxVelocityY);
};

Ball.prototype.draw = function(ctx) {
	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
};
