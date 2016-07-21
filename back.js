var b = require('./board');
var move = require('./move');
var inter = require('./aiinterface');;
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
	masterBoard = new b(s)
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
		//Extra = difficulty, int from 1 to 3
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

cb needs to be a function that updates the board display
*/
function getMove(board, x, y, c, pass, cb){
	//Do move logic stuff here
	var myMove = new move();
	myMove.makeMove(x, y, c, pass)
	var valid = true;
	
	
	
	
	
	if(valid){
		finishMove(board, myMove)
		if(type == 'ai' || type == 'online'){
			inter.getMove(board, x, y, c, pass, finishMove, cb);  //returns a move object
		} else if (type === 'hotseat') {
            		var HI = require("./HumanInterface.js");
        		 HI.getMove(board, x, y, c, pass, function(b, c) {
                       		cb(b, c)
            		});
		}
		return board;
	}
	else{
		return board;
	}
}
/*
Updates board
Calls logger
*/
function finishMove(board, move, cb){
	board.placeToken(move.x, move.y, move.c, move.pass);
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
