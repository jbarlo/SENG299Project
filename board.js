/*
*/
var m = require("move");


function board(s){
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
function cloneBoard(){
	var array = [];
	for(n=0; n < this.size; n++){
		array[n] = []
		for(i = 0; i < this.size; i++){
			array[n][i] = readToken(n,i);
		}
	}
	return array;
}

