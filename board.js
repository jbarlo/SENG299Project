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
	return(tokenSpots[x][y]);
}
function readToken(x, y){
	return(tokenSpots[x][y]);
}
function readBoard(){
	return this.tokenSpots;
}