var speed = 100,
	boardWidth = 800,
	boardHeight = 600,
	ballSize = 10,
	initialVelocityX = 5,
	initialVelocityY = 2,
	padelSize = 100;

var board = new Board(boardWidth, boardHeight);

var ball = new Ball(ballSize, initialVelocityX, initialVelocityY, boardWidth/2, boardHeight/2);
var padel1 = new Padel(padelSize, 50, boardHeight/2 - padelSize/2);
var padel2 = new Padel(padelSize, boardWidth - 60, boardHeight/2 - padelSize/2);

board.setBall(ball);
board.setPadels(padel1, padel2);

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
			padel2.moveUp();
			break;
		case 115:
			padel1.moveDown();
			padel2.moveDown();
			break;
	}
};


(function refresh() {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	board.draw(ctx);
	setTimeout(refresh, 1000/speed);
})();


