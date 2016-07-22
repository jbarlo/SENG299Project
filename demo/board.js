/*
 
 */
var move = require('./move');


var board = function b(s){
    this.lastMove = new move();
    this.size = s.length;
    this.id = ""+new Date().getTime();
    this.tokenSpots = s;
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