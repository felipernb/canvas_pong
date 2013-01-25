function Game(player1, player2, p1Observer, p2Observer) {
	var speed = 60, //fps
		boardWidth = 800,
		boardHeight = 600,
		ballSize = 15,
		initialVelocityX = 5, // 5px/frame = 300px/sec
		initialVelocityY = 2, // 2px/frame = 120px/sec
		paddleSize = 100,
		pauseText = false;

	var board = new Board(boardWidth, boardHeight);
	var ball = new Ball(ballSize, initialVelocityX, initialVelocityY, boardWidth/2, boardHeight/2);
	var p1 = new player1(paddleSize, 40, boardHeight/2 - paddleSize/2, p1Observer);
	var p2 = new player2(paddleSize, boardWidth - 60, boardHeight/2 - paddleSize/2, p2Observer);

	board.setBall(ball);
	board.setPaddles(p1, p2);
	board.setScorePanel(new Score(boardWidth/2 - 100,100), new Score(boardWidth/2 + 60, 100));
	var boardElement = document.createElement('canvas');
	boardElement.id = 'board';
	boardElement.width = boardWidth;
	boardElement.height = boardHeight;

	var ctx = boardElement.getContext('2d');
	document.body.appendChild(boardElement);
	this.ball = ball;
	this.p1 = p1;
	this.p2 = p2;
	(function refresh() {
		if (!pause) {
			board.draw(ctx);
			pauseText = false;
		} else {
			if (!pauseText) {
				ctx.font = "24pt Courier";
				ctx.fillText("PAUSE", 350, 250);
				pauseText = true;
			}
		}
		if (!gameOver) {
			setTimeout(refresh, 1000/speed);
		} else {
			ctx.font = "24pt Courier";
			ctx.fillText("GAME OVER", 300, 250);
			ctx.fillText((winner === 0 ? p1 : p2).name + " wins", 300, 300);
		}
	})();
}
var pause = false,
	gameOver = false,
	winner;

