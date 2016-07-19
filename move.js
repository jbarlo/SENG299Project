var move = function m(){
	this.x = 0;
	this.y = 0;
	this.c = 0;
}
function makeMove(x,y,c){
	this.x=x;
	this.y=y;
	this.c=c;
}
move.prototype.makeMove = makeMove;
module.exports = move;