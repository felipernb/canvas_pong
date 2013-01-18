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
var padel1 = new Padel(padelSize, 50, boardHeight/2 - padelSize/2);
var cpuPlayer = new CPUPlayer(padelSize, boardWidth - 60, boardHeight/2 - padelSize/2);

board.setBall(ball);
board.setPadels(padel1, cpuPlayer);
board.setScorePanel(new Score(boardWidth/2 - 100,100), new Score(boardWidth/2 + 60, 100));
var boardElement = document.createElement('canvas');
boardElement.id = 'board';
boardElement.width = boardWidth;
boardElement.height = boardHeight;

var ctx = boardElement.getContext('2d');
document.body.appendChild(boardElement);
document.onkeypress = function(e) {
	e = e || window.event;
	var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
	switch (charCode) {
		case 119:
			padel1.moveUp();
			break;
		case 115:
			padel1.moveDown();
			break;
		case 32:
			pause = !pause;
			break;
	}
};

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
		ctx.fillText("GAME OVER\n PLAYER " + (winner+1) + " WINS!", 200, 250);
	}
})();


