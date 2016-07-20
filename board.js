/*

*/
var move = require('./move');


var board = function b(s){
	this.lastMove = new move();
	this.size = s;
	this.id = s+""+new Date().getTime();
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
function placeToken(x, y, c, pass){
	if(!pass){
		this.tokenSpots[x][y] = c;
	}
	this.lastMove.makeMove(x,y,c, pass);
	return this.tokenSpots[x][y];
}
function readToken(x, y){
	return this.tokenSpots[x][y];
}
function readBoard(){
	return this.tokenSpots;
}
function getID(){
	return this.id;
}
/*
Returns a duplicate of this board
*/
function cloneBoard(){
	var array = [];
	var board2 = new board(this.size);
	
	for(n=0; n < this.size; n++){
		for(i = 0; i < this.size; i++){
			board2.placeToken(n,i, this.readToken(n,i));
		}
	}
	return board2;
};

board.prototype.getID = getID;
board.prototype.placeToken = placeToken;
board.prototype.readToken = readToken;
board.prototype.readBoard = readBoard;
board.prototype.cloneBoard = cloneBoard
module.exports = board;