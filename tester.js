back = require('./back');

board = back.createGame('ai', 6);
console.log(board.readBoard());

back.connect(1, 2);
back.getMove(board, 2, 2, 1, function n(){});
back.getMove(board, 1, 2, 2, function n(){});
back.getMove(board, 2, 5, 1, function n(){});
back.getMove(board, 3, 2, 2, function n(){});
back.getMove(board, 2, 2, 1, function n(){});
back.getMove(board, 2, 0, 2, function n(){});

console.log(board.readBoard());

console.log('all tests pass :D');