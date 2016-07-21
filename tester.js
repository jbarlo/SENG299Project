var back = require('./back');
var size = 6;

//Have to do it like this now since Isaac needed to change the board
var arr = [];
for(n = 0; n < size; n++){
	arr[n] = [];
}
for(n = 0; n < size; n++){
	for(i = 0; i < size; i++){
		arr[n][i] = 0;
	}
}

function callback(){
	console.log(board.readBoard());
}

board = back.createGame('ai', arr);
//console.log(board.readBoard());

back.connect(1, 2);
console.log('connected');
back.getMove(board, 0, 0, 1, false, callback;
console.log('first');
back.getMove(board, 0, 1, 1, false, function callback(board){
	console.log(board.readBoard());
});
back.getMove(board, 0, 2, 1, false, function callback(board){
	console.log(board.readBoard());
});
back.getMove(board, 0, 3, 1, false, function callback(board){
	console.log(board.readBoard());
});
