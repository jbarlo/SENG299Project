var move = function m(){
	this.x = 0;
	this.y = 0;
	this.c = 0;
	this.pass = false;
}
function makeMove(x,y,c,pass){
	this.x=x;
	this.y=y;
	this.c=c;
	this.pass=pass;
}
move.prototype.makeMove = makeMove;
module.exports = move;
