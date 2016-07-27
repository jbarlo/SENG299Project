var b = require('./board');
var move = require('./move');
var ref = require('./referee');

var r = "default error message";

/*
* THIS IS THE CONSTRUCTOR
* If playing anything but hotseat, call the "connect" method
*/
var back = function createGame(t, s, tu, f){
	this.type = t;
	this.masterBoard = new b(s)
	this.turn = tu;
	this.pass = false;
	this.full = f;
	this.last = [];
	this.last.push(this.masterBoard);
	this.done = false; // Only used in pvp
	this.bScore; // Only used in pvp
	this.wScore; // Only used in pvp
	this.hasBlack = false;
	this.hasWhite = false;
	this.blackTimer = 0;
	this.whiteTimer = 0;
	if(this.type == 'pvp'){
		blackCountdown();
		whiteCountdown();
	}
}
/*
*/
var blackCountdown = function(){
	if(this.hasBlack){
		if(this.blackTimer > 0){
			setTimeout((function(scope){return function(){scope.blackTimer--; scope.blackCountdown();};})(this), 1000);
		}else{
			this.hasBlack = false;
			console.log("Black has left the room");
		}
	}
}

var whiteCountdown = function(){
	if(this.hasWhite){
		if(this.whiteTimer > 0){
			setTimeout((function(scope){return function(){scope.whiteTimer--; scope.whiteCountdown();};})(this), 1000)
		}else{
			this.hasWhite = false;
			console.log("White has left the room");
		}
	}
}


/*
Attempt to create connection for ai or online game

* type: the type property for this back-end object. The 'this' keyword is wrongly linked to the function in this situation.
*	e.g. When calling, just say connect(backendObject.type, [whatever extra you need for your type])
*/
var connect = function(type, extra){
	if(type == 'ai'){
		//Extra = difficulty, int from 1 to 3
        this.inter = require('./aiinterface');
        this.inter.connect(extra);
	}else if(type == 'online'){
		this.inter = require('/serverinterface');
		this.inter.connect(extra);
	}else if(type == 'replay'){ // TODO: server side replays? Front-end can already do this on its own
		
	}
	else{
		console.log("Something went wrong, type is not defined");
		return false;
	}
	return true;
}
/*
* type: the type property for this back-end object. The 'this' keyword is wrongly linked to the function in this situation.
*	e.g. When calling, just say getMove(backendObject.type, board, etc...)

Calls back with "success" when successful, otherwise calls back a variety of other humourous error messages
May sometimes pass back a board object as well, can usually be ignored
*/
var getMove = function(type, board, x, y, c, pass, last , cb){
	r = "default error message";
	if(type == 'ai' || type == 'online'){
		this.inter.getMove(board, x, y, c, pass, function(move){
			finishMove(board, move, last);
			r = "success";
			if(move.pass) r = 'pass'; // If the mvoe was a pass, send a pass message	
			cb(r,board);
		});
	}else{
		cb("something has gone horribly wrong");
	}
}
/*
Function that checks and places client side moves
calls back true when the board is updated
*/
var makeMove = function(prevBoard,x, y, c, pass){
	r = "default error message";
	
	var myMove = new move();
	myMove.makeMove(x, y, c, pass)
	var valid = ref.checkMoveValidity(myMove,this.masterBoard,prevBoard); // valid is true if move is not trying to take already occupied space, is not suicidal, is not ko
	if(valid){
		finishMove(this.masterBoard, myMove,this.last);
		if(pass){
			r = "pass";
		}
		else{
			r = "success";
		}
	}
	return(r);
}
/*
Updates board
Calls logger
calls back true when board is updated
*/
var finishMove = function(board,move,last){
	board.placeToken(move.x, move.y, move.c, move.pass);
	
	if(!move.pass){
		// The deleting logic
		if(move.x > 0) checkForDeletes(move.x - 1, move.y, move.c, board);
		if(move.x < board.size - 1) checkForDeletes(move.x + 1, move.y, move.c, board);
		if(move.y > 0) checkForDeletes(move.x, move.y - 1, move.c, board);
		if(move.y < board.size - 1) checkForDeletes(move.x, move.y + 1, move.c, board);
	}
	
	
	// TODO: Do logger stuff here
	last.push(board.cloneBoard());
}

// A helper function for finishMove. Takes advantage of referee class methods to find delete pieces
function checkForDeletes(x,y,c,board){
		var libs = ref.determineLiberties(x, y, board);
		var shouldDelete = true;
		for(var l = 0; l < libs.length; l++){
			if(board.readToken(libs[l][0],libs[l][1]) !== c){
				shouldDelete = false;
			}
		}
		
		if(shouldDelete){
			var army = ref.determineArmy(x, y, board);
			for(var a = 0; a < army.length; a++){
				board.tokenSpots[army[a][0]][army[a][1]] = 0;
			}
		}
}


/*
Checks the board for possible moves
Returns true if there are still moves that can be made
Returns false if there are no moves left to be made
*/
var checkGame = function(c, state, prevState){ // Pretty much a repackaging of the referee method
	return ref.checkForAvailableMoves(c, state, prevState);
}
/*
Calculate scores
Resets the board
Does something with the logger?
returns score
*/
var endGame = function(board){
	return ref.calculateScore(1,2,board,6.5);
}

back.prototype.connect = connect;
back.prototype.getMove = getMove;
back.prototype.makeMove = makeMove;
back.prototype.finishMove = finishMove;
back.prototype.checkGame = checkGame;
back.prototype.endGame = endGame;
back.prototype.blackCountdown = blackCountdown;
back.prototype.whiteCountdown = whiteCountdown;
module.exports = back;
