var b = require('./board');
var move = require('./move');
var inter = require('./aiinterface');

var r = "default error message";
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
Gets moves from interfaces
Call placeToken

cb needs to be a function that updates the board display
calls back true when the board is updated
*/
function getMove(board, x, y, c, pass, cb){
	r = "default error message";
	if(type == 'hotseat'){
		r = 'hotseat swap';
	}
	if(type == 'ai' || type == 'online'){
		inter.getMove(board, x, y, c, pass, callback(move){
				finishMove(board, move);
				cb(r);
		});
	} 
	
	else{
		console.log("something has gone horribly wrong");
	}
	cb("default error message");
}
/*
Function that checks and places client side moves
calls back true when the board is updated
*/
function makeMove(board, x, y, c, pass, cb){
	r = "default error message";
	
	var myMove = new move();
	myMove.makeMove(x, y, c, pass)
	var valid = true;
	//Do move logic stuff here
	
	
	//
	if(valid){
		finishMove(board, myMove);
	}
	cb(r);
}
/*
Updates board
Calls logger
calls back true when board is updated
*/
function finishMove(board, move){
	board.placeToken(move.x, move.y, move.c, move.pass);
	r = "success";
	//Do logger stuff here
}
/*
Checks the board for possible moves
Returns true if there are still moves that can be made
Returns false if there are no moves left to be made
*/
function checkGame(){
	
	return true;
}
/*
Calculate scores
Resets the board
Does something with the logger?
returns score
*/
function endGame(){
	var score = 0;
	return score
}
module.exports = {
	createGame : createGame,
	makeMove : makeMove,
    getMove : getMove,
	checkGame : checkGame,
	endGame : endGame,
	connect : connect
}
