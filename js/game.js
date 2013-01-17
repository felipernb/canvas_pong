var speed = 100;
var boardWidth = 800;
var boardHeight = 400;
var ballSize = 10;
var velocityX = 5;
var velocityY = 2;
var board = new Board(boardWidth, boardHeight);
var ball = new Ball(ballSize, velocityX, velocityY, boardWidth/2, boardHeight/2, board);

var boardElement = document.createElement('div');
boardElement.id = 'board';
boardElement.style.width = boardWidth + "px";
boardElement.style.height = boardHeight + "px";

var ballElement = document.createElement('div');
ballElement.id = 'ball';
ballElement.style.width = ballSize + "px";
ballElement.style.height = ballSize + "px";

boardElement.appendChild(ballElement);
document.body.appendChild(boardElement);

(function refresh() {
	ball.refreshPosition();
	ballElement.style.left = ball.getPosition().x +"px";
	ballElement.style.top = ball.getPosition().y + "px";
	setTimeout(refresh, 1000/speed);
})();

