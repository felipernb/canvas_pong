var speed = 100;
var boardWidth = 800;
var boardHeight = 400;
var ballSize = 10;
var velocityX = 5;
var velocityY = 2;
var board = new Board(boardWidth, boardHeight);
var ball = new Ball(ballSize, velocityX, velocityY, boardWidth/2, boardHeight/2, board);

var boardElement = document.createElement('canvas');
boardElement.id = 'board';
boardElement.width = boardWidth;
boardElement.height = boardHeight;

var ctx = boardElement.getContext('2d');
document.body.appendChild(boardElement);

(function refresh() {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.fillRect(ball.getPosition().x, ball.getPosition().y, ballSize, ballSize);
	ball.refreshPosition();
	setTimeout(refresh, 1000/speed);
})();

