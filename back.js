var b = require('./board');
var m = require('./move');
var inter;
//var server = require('serverinterface');


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
	board = new b(s)
	type = t;
	return true;
}
/*
*/

/*
Attempt to create connection for ai or online game
*/
function connect(colour, extra){
	if(type == 'ai'){
		//inter = require('./aiinterface');
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
function getMove(board, x, y, c, cb){
	//Do move logic stuff here
	var valid = true;
	
	
	
	
	
	if(valid){
		var move = inter.getMove(b, x, y, c, cb);  //returns a move object
		placeToken(board, move)
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
function placeToken(b, m){
	b.placeToken(m.x, m.y, m.c);
	//logger.
}

/*
Calculate scores
*/
function endGame(){
	
}