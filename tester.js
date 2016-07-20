back = require('./back');

function callback(){
	console.log(board.readBoard());
}


board = back.createGame('ai', 6);
console.log(board.readBoard());

back.connect(1, 2);
back.getMove(board, 0, 0, 0, false, callback());
back.getMove(board, 1, 2, 0, false, callback());
back.getMove(board, 2, 5, 1, false, callback());
back.getMove(board, 3, 2, 2, false, callback());
back.getMove(board, 2, 2, 1, false, callback());
back.getMove(board, 2, 0, 2, false, callback());

console.log(board.readBoard());

console.log('all tests pass :D');