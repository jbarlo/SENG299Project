var b = require('./board');
var move = require('./move');
var ref = require('./referee');

var r = "default error message";

/*
Initiate game
Create board
Call:
	Connect (if ai/online)
	startGame
Returns the board if game created
*/
var back = function createGame(t, s, tu){
	this.type = t;
	this.masterBoard = new b(s)
	this.turn = tu;
}
/*
*/

/*
Attempt to create connection for ai or online game
*/
var connect = function(type, extra){
	if(type == 'ai'){
		//Extra = difficulty, int from 1 to 3
        this.inter = require('./aiinterface');
        this.inter.connect(extra);
	}else if(type == 'online'){
		this.inter = require('/serverinterface');
		this.inter.connect(extra);
	}else if(type == 'replay'){
		
	}
	else{
		console.log("Something went wrong, type is not defined");
		return false;
	}
	return true;
}
/*
Gets moves from interfaces
Call placeToken

cb needs to be a function that updates the board display
calls back true when the board is updated
*/
var getMove = function(type, board, x, y, c, pass, cb){
	r = "default error message";
	if(type == 'ai' || type == 'online'){
		this.inter.getMove(board, x, y, c, pass, function(move){
			finishMove(board, move);
			r = "success";
			cb(r);
		});
	}else{
		cb("something has gone horribly wrong");
	}
}
/*
Function that checks and places client side moves
calls back true when the board is updated
*/
var makeMove = function(prevBoard,x, y, c, pass, cb){
	r = "default error message";
	
	var myMove = new move();
	myMove.makeMove(x, y, c, pass)
	var valid = ref.checkMoveValidity(myMove,this.masterBoard,prevBoard); // NEEDS PREV STATE       <-----
	if(valid){
		finishMove(this.masterBoard,myMove);
		r = "success";
	}
	cb(r);
}
/*
Updates board
Calls logger
calls back true when board is updated
*/
var finishMove = function(board,move){
	board.placeToken(move.x, move.y, move.c, move.pass);
	
	if(move.x > 0) checkForDeletes(move.x - 1, move.y, move.c, board);
	if(move.x < board.size - 1) checkForDeletes(move.x + 1, move.y, move.c, board);
	if(move.y > 0) checkForDeletes(move.x, move.y - 1, move.c, board);
	if(move.y < board.size - 1) checkForDeletes(move.x, move.y + 1, move.c, board);
	
	
	
	//Do logger stuff here
}

function checkForDeletes(x,y,c,board){
		var libs = ref.determineLiberties(x, y, board);
		var shouldDelete = true;
		for(l of libs){
			if(board.readToken(l[0],l[1]) !== c){
				shouldDelete = false;
			}
		}
		
		if(shouldDelete){
			var army = ref.determineArmy(x, y, board);
			for(a of army){
				board.tokenSpots[a[0]][a[1]] = 0;
			}
		}
}


/*
Checks the board for possible moves
Returns true if there are still moves that can be made
Returns false if there are no moves left to be made
*/
var checkGame = function(){
	return ref.checkForAvailableMoves();   //              NEEDS SOME PARAMETERS     <-------
}
/*
Calculate scores
Resets the board
Does something with the logger?
returns score
*/
var endGame = function(){
	var score = 0;
	return score
}

back.prototype.connect = connect;
back.prototype.getMove = getMove;
back.prototype.makeMove = makeMove;
back.prototype.finishMove = finishMove;
back.prototype.checkGame = checkGame;
back.prototype.endGame = endGame;
module.exports = back;
