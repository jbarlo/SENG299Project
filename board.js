/*

*/
var assert = require('assert');

/*
Initiate board of size s by s as an array
All tokenSpots are initiated as 0 (empty)
*/
function board(s){
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
Changes tokenSpots[x][x] to colour c
*/
function placeToken(x, y, c){
	this.tokenSpots[x][y] = c;
	return(tokenSpots[x][y]);
}

/*
Returns token value at tokenSpots[x][y]
*/
function readToken(x, y){
	return(tokenSpots[x][y]);
}

/*
Returns tokenSpots array
*/
function readBoard(){
	var str = 'Board\n';
	/*for(n = 0; n < this.size; n++){
		str += "\n"
		for(i = 0; i < this.size; i++){
			str += this.tokenSpots[n][i];
		}
	}*/
	return tokenSpots;
}