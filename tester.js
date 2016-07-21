back = require('./back');

function callback(){
	console.log(board.readBoard());
}


board = back.createGame('ai', 6);
console.log(board.readBoard());

back.connect(1, 2);
back.getMove(board, 0, 0, 1, false, function callback(board){
	console.log(board.readBoard());
});