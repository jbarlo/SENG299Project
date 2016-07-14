var board = require('board');
var ai = require('aiinterface');
var server = require('serverinterface');
var type = 'ai';



/*
Initiate game
Create board
Call:
	Connect (if ai/online)
	startGame
Returns true if game created
*/
function createGame(t, s){
	board.board(s);
	type = t;
	return true;
}
/*

*/


function startGame(type){
	
}
/*
Attempt to create connection for ai or online game
*/
function connect(colour){
	
}
/*
Check move logic
Send valid moves to interfaces
Call placeToken
*/
function makeMove(x, y, c){
	
}
/*
Alter board state
Return updated board
*/
function placeToken(x, y, c){
	//front.updateBoard(board);
}
/*
Calculate scores
Update front end display
Close connections
*/
function endGame(){
	
}
