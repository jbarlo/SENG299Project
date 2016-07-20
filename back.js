var board = require('./board');
var move = require('./move');
var inter;
//var server = require('serverinterface');


var type = 'ai';
var masterBoard;
/*
Initiate game
Create board
Call:
	Connect (if ai/online)
	startGame
Returns true if game created
*/
function createGame(t, s){
	masterBoard = new board(s);
	type = t;
	return masterBoard;
}
/*
*/

/*
Attempt to create connection for ai or online game
*/
function connect(colour, extra){
	if(type == 'ai'){
		inter = require('./aiinterface');
		inter.connect(colour, extra);
	}
	else if(type == 'online'){
		inter = require('/serverinterface');
		inter.connect(colour, extra);
	}
	else if(type == 'hotseat'){
		inter = require('./HumanInterface');	
	}
	else if(type == 'replay'){
		
	}
	else{
		console.log("Something went wrong, type is not defined");
		return false;
	}
	return true;
}
/*
Check move logic
Send valid moves to interfaces
Call placeToken
*/
function getMove(board, x, y, c, pass){
	//Do move logic stuff here
	var valid = true;
	/*
	if(board.lastMove.c == c) valid = false;
	*/
	
	if(valid){
		//Place the move
		var m = new move();
		m.makeMove(x, y, c, pass);
		finishMove(board, m);
		console.log(""+JSON.stringify(m.getMove()) + "   "+m.x);
		
		
		//Check for external response
		if(type == 'ai' || type == 'online'){
			inter.getMove(board, x, y, c, pass, function cb(response){
				finishMove(board, response);
				console.log("Got a response");
			});  //returns a move object
		}
		else{
			return board;
		}
	}
}
/*
Updates board
Calls logger
*/
function finishMove(board, move){
	if(!move.pass){
		board.placeToken(move.x, move.y, move.c, move.pass);
	}
	//logger.
}

/*
Calculate scores
*/
function endGame(){
	
}
module.exports = {
	createGame : createGame,
    getMove : getMove,
	connect : connect
}