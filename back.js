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
Gets moves from interfaces
Call placeToken

cb needs to be a function that updates the board display
calls back true when the board is updated
*/
function getMove(board, x, y, c, pass, cb){

	finishMove(board, myMove)
	if(type == 'ai' || type == 'online'){
		inter.getMove(board, x, y, c, pass, finishMove, cb);  //interface calls the cb
	} 
	else if (type === 'hotseat') {
		var HI = require("./HumanInterface.js");			//if type is hotseat, inter should be HumanInterface
		HI.getMove(board, x, y, c, pass, function(b, c) {
			cb(b, c)
		});
	}
	
	else{
		console.log("something has gone horribly wrong");
	}
	cb(false);
}
/*
Function that checks and places client side moves
calls back true when the board is updated
*/
function makeMove(board, x, y, c, pass, cb){
	var myMove = new move();
	myMove.makeMove(x, y, c, pass)
	var valid = true;
	//Do move logic stuff here
	
	if(valid){
		finishMove(board, myMove, cb);
	}
	else{
		cb(false);
	}
}
/*
Updates board
Calls logger
calls back true when board is updated
*/
function finishMove(board, move, cb){
	board.placeToken(move.x, move.y, move.c, move.pass);
	
	//Do logger stuff here
	
	cb(true);
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
