var speed = 50,
	boardWidth = 800,
	boardHeight = 600,
	ballSize = 10,
	initialVelocityX = 5,
	initialVelocityY = 2,
	padelSize = 100,
	pause = false,
	pauseText = false,
	gameOver = false,
	winner;

var board = new Board(boardWidth, boardHeight);
var ball = new Ball(ballSize, initialVelocityX, initialVelocityY, boardWidth/2, boardHeight/2);
var human = new HumanPlayer(padelSize, 50, boardHeight/2 - padelSize/2);
var cpu = new CPUPlayer(padelSize, boardWidth - 60, boardHeight/2 - padelSize/2);

board.setBall(ball);
board.setPadels(human, cpu);
board.setScorePanel(new Score(boardWidth/2 - 100,100), new Score(boardWidth/2 + 60, 100));
var boardElement = document.createElement('canvas');
boardElement.id = 'board';
boardElement.width = boardWidth;
boardElement.height = boardHeight;

var ctx = boardElement.getContext('2d');
document.body.appendChild(boardElement);

(function refresh() {
	if (!pause) {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
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
		ctx.fillText((winner === 0 ? human : cpu).name + " wins", 300, 300);
	}
})();


