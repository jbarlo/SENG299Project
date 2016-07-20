//If the AI cannot make a move, the AI will respond with a move placed at 0,0; with the last move color set correctly and with pass set to true

var http = require("http");
var difficulty = 4;	//difficulty set to 4. Must be changed to a valid difficulty by the connect function or an error will be thrown

//Handles initialization of various interface components
//extra should be an int from 1-3 to set the difficulty
function connect(colour, extra){
	difficulty = extra;
	var options = {
		host: 'roberts.seng.uvic.ca',
		path:'/',
		port:'30000',
		method:'POST',
		headers:{
			'Content-Type':'application/json'
		}
	}
	//JSON object to describe a pass move
	var passData = {
		"x":0,
		"y":0,
		"c":passC,
		"pass":true
	}
	var req = http.request(options,function(){
		return true;
	});
	req.write(passData);
	req.on("error",function(e){
		return false;
	});
	req.end();
	
}
//randomizes the AI type chosen to create multiple difficulties (integer from 1-3 for input. 1 is always a random move, 2 is 50% chance for a random move and 50% chance of a smart move, 3 is always a smart move). Returns a string of the path to be used
function difficultySelector(){
	if(difficulty==1){
		return '/ai/random';
	}
	else if(difficulty==2){
		return(pathSelector(Math.floor((Math.random()*6)+1)));
	}
	else if(difficulty==3){
		return(pathSelector(Math.floor((Math.random()*3)+1)));
	}
	else{
		throw 'Invalid Difficulty Selected';
	}
}

//paths to return based on random number generation from difficultySelector(). /ai/random is repeated 3 times to increase the weighting of random moves. Integer from 1-6 for input. Returns a string of the path to be used
function pathSelector(path){
	switch(path){
		case 1:
			return '/ai/maxLibs';
			break;
		case 2:
			return '/ai/attackEnemy';
			break;
		case 3:
			return '/ai/formEyes';
			break;
		case 4:
			return '/ai/random';
			break;
		case 5:
			return '/ai/random';
			break;
		case 6:
			return '/ai/random';
			break;
		default:
			throw 'Invalid Path Number selected';
			break;
	}
}

//gets a move from the AI based on the current board state. Parameters are board size(int), board state (2d array of int), last move made {x coord of last move (int), y coord of last move (int), color of the last move (int), if last move was a pass (boolean)}
//Returns a JSON object of the AI's move. If the AI is going to pass, the move is placed at 0,0; the last move color is set correctly, and pass is set to true

function getMove(board, x, y, c, cb){
    var size = board.size;
	var postData = JSON.stringify({	
		"size":size,
		"board":board,
		"last":{
			"x":x,
			"y":y,
			"c":c,
			"pass":board.lastMove.pass
		}
	});
	
	//variable to set the color of the pass move with if statements
	var passC;
	
	//if last move was black, set pass to by white
	if(c==1){
		passC = 2;
	}
	
	//if the last move is white, or if no move has been made, set pass to by black
	else{
		passC = 1;
	}
	
	//JSON object to describe a pass move
	var passData = {
		"x":0,
		"y":0,
		"c":passC,
		"pass":true
	}
	
	//choose a random path based on the difficulty selected
	var selectedPath = difficultySelector();
	
	//settings to connect to the AI
	var options = {
		host: 'roberts.seng.uvic.ca',
		path:selectedPath,
		port:'30000',
		method:'POST',
		headers:{
			'Content-Type':'application/json'
		}
	}
	
	//callback function to send an appropriate response (the move sent from the AI, or a pass if the AI is unable to move)
	var callback = function(response){
		
		//Variable used to check whether the AI sent a valid move or a pass. If the chunk sent back from the AI can be parsed into a JSON object, it is a valid move. Otherwise the AI was unable to make a move with the given board state, an error will be thrown, and the AI will pass
		var checker;
		
		response.on('data',function(chunk){
			try{
				checker = JSON.parse(chunk);
				cb(checker);
			}
			catch(err){
				cb(passData);
			}
		});
	}
	
	var req = http.request(options,callback);
	req.write(postData);
	req.on("error",function(e){
		console.log('Problem with request.');
	});
	req.end();
	
}

module.exports = {
	connect : connect,
    getMove : getMove
}
