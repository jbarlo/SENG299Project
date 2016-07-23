/*

*/
var move = require('./move');


var board = function b(s){
	this.lastMove = new move();
	this.size = s.length;
	this.id = s+""+new Date().getTime();
	this.tokenSpots = s;
}

/*
Basic board functions
*/
var placeToken = function(x, y, c, pass){
	if(!pass){
		this.tokenSpots[x][y] = c;
	}
	this.lastMove.makeMove(x,y,c, pass);
	return this.tokenSpots[x][y];
}
var readToken = function(x, y){
	return this.tokenSpots[x][y];
}
var readBoard = function(){
	return this.tokenSpots;
}
var getID = function(){
	return this.id;
}
/*
Returns a duplicate of this board
*/
var cloneBoard = function(){
	var array = [this.size];
	
	for(n=0; n < this.size; n++){
		array[n] = [this.size];
		for(i = 0; i < this.size; i++){
			array[n][i] = this.readToken(n,i);
		}
	}
	return new board(array);
};

board.prototype.getID = getID;
board.prototype.placeToken = placeToken;
board.prototype.readToken = readToken;
board.prototype.readBoard = readBoard;
board.prototype.cloneBoard = cloneBoard
module.exports = board;
