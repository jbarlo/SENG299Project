var back = require('./back');
var size;

//Have to do it like this now since Isaac needed to change the board
var arr = [];
for(var x=0; x < size; x++){
	arr[x] = []
	for(var y = 0; y<size;y++){
		arr[x][y] = 0;
	}
}
console.log(' '+ arr);



function callback(){
	console.log(board.readBoard());
}


board = back.createGame('ai', arr);
console.log(board.readBoard());

back.connect(1, 2);
back.getMove(board, 0, 0, 1, false, function callback(board){
	console.log(board.readBoard());
});
