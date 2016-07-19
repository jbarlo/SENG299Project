/*

*/
var m = require("move");


constructor board(s){
	this.lastMove = new move();
	this.size = s;
	this.tokenSpots = [];
	for(n = 0; n < s; n++){
		this.tokenSpots[n] = [];
	}
	for(n = 0; n < s; n++){
		for(i = 0; i < s; i++){
			this.tokenSpots[n][i] = 0;
		}
	}
}


/*
Basic board functions
*/
function placeToken(x, y, c){
	this.tokenSpots[x][y] = c;
	this.lastMove.makeMove(x,y,c);
	return this.tokenSpots[x][y];
}
function readToken(x, y){
	return(this.tokenSpots[x][y];
}
function readBoard(){
	return this.tokenSpots;
}

/*
Clones the board for game scoring and logig functions
Also because JS is stupid
*/
function cloneBoard(){
	var array = [];
	var board2 = new board(board.size);
	
	for(n=0; n < this.size; n++){
		for(i = 0; i < this.size; i++){
			board2.placeToken(n,i, readToken(n,i);
		}
	}
	return board2;
}

module.exports = board;