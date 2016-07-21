back = require('./back');

function callback(board){
	console.log(board.readBoard());
	console.log('move returned was');
	console.log(board.lastMove);
}


board = back.createGame('ai', 6);

back.connect(1, 2);
console.log(':D making moves liek a bawss :D');
back.getMove(board, 0, 0, 0, false, callback);
back.getMove(board, 1, 2, 0, false, callback);
back.getMove(board, 2, 5, 1, false, callback);
back.getMove(board, 3, 2, 2, false, callback);
back.getMove(board, 2, 2, 1, false, callback);
back.getMove(board, 2, 0, 2, false, callback);


console.log('all tests pass :D');