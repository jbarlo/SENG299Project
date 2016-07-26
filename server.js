/*
 * This server is modified from and based on code supplied by SENG 299,
 * summer session 2016, for labs 4 and 6. Originally written by Simon Diemert.
 */

"use strict";

var express = require("express");

var humanInterface = require("./HumanInterface.js");
var back = require("./back.js");
var boardObject = require("./board.js");

var app = express();

var backs = [];


app.use(require("body-parser").json());

app.use(express.static('public'));


// script.js should make POST requests to this when it wants to play hotseat
app.post("/hotseat", function(req, res) {
	console.log(backs.length - 1);
    console.log("POST Request to: /hotseat");
	
	var ba; // This is our back end object. It will be stored in an array of back objects so multiple people can access the server at once
	var backIndex = req.body.ind; // This is the index that ba cound be found at in the array
	
	if(backIndex === null){ // This checks for if its a users first move to the board. The server needs to create a new back-end object
		var br = [];
		for (br = []; br.length < req.body.b.length; br.push(Array(req.body.b.length)));
		for (var i = 0; i < req.body.b.length; i++){
			for (br[i] = []; br[i].length < req.body.b.length; br[i].push(Array(req.body.b.length)));
		}
		for(var i = 0; i < req.body.b.length; i++){
			for(var j = 0; j < req.body.b.length; j++){
				br[i][j] = 0;
			}
		}
		ba = new back("hotseat",br,req.body.t,true); // Creating the new back-end object...
		
		backs.push(ba); // The object is pushed onto the array
		backIndex = backs.length - 1; // and the index is logged
	}else{
		ba = backs[backIndex]; // If this is a later turn by the user, the back-end object is just pulled from the array directly
		ba.turn = req.body.t; // The back-end's turn counter is updated
	}
	
	var board = ba.masterBoard; // The board state is obtained. A conceptual model could be that the MVC model lives inside the back-end object
	
	// The move is attempted, the server automatically knows if the move is black or white depending on the current turn.
	var r = ba.makeMove(ba.last[(ba.turn - 2 >= 0) ? ba.turn - 2 : 0], req.body.x, req.body.y, (ba.turn % 2 === 0) ? 2 : 1, req.body.p);

	if(req.body.p){ // If the player passes, the server responds with increasing the turn counter
		if(ba.pass){ // If they passed once before
			ba.pass = false;
			var scores = ba.endGame(board);
			console.log(scores[0] + ", " + scores[1]);
			res.json({r: 'done', blackScore: scores[0], whiteScore: scores[1], last: ba.last}); // End the game if there is two passes
		}else{
			ba.pass = true;
			res.json({turn: ba.turn + 1, r: r, ind: backIndex, last: ba.last}); // backIndex is sent so the front-end can store it. r is any sort of error message
		}
		return;
	}else{
		ba.pass = false;
	}
	
	if(r == 'success'){ // On success, the new board state is returned. An incremented turn counter is passed
		res.json({board: board.readBoard(), turn: ba.turn + 1,r: r, ind: backIndex, last: ba.last});
	}else{ // On failure, an error message is returned
		res.json({r: r, ind: backIndex});
	}
});

// script.js should make POST requests to this when it wants ai responses
app.post("/aa", function(req, res){ // This method is lighter on comments since it's very similar to the /hotseat
	console.log(backs.length - 1);
	console.log("POST Request to: /aa");
	
	var diff = req.body.diff;
	
	var ba;
	var backIndex = req.body.ind;
	if(backIndex === null){
		var br = [];
		for (br = []; br.length < req.body.b.length; br.push(Array(req.body.b.length)));
		for (var i = 0; i < req.body.b.length; i++){
			for (br[i] = []; br[i].length < req.body.b.length; br[i].push(Array(req.body.b.length)));
		}
		for(var i = 0; i < req.body.b.length; i++){
			for(var j = 0; j < req.body.b.length; j++){
				br[i][j] = 0;
			}
		}
		ba = new back("ai",br,req.body.t,true);
		
		backs.push(ba);
		backIndex = backs.length - 1;
	}else{
		ba = backs[backIndex];
		ba.turn = req.body.t;
	}
	
	var board = ba.masterBoard;
	
	ba.connect(ba.type, diff);
	
	if(ba.turn % 2 === 1){ // place a player move
		var r = ba.makeMove(ba.last[(ba.turn - 2 >= 0) ? ba.turn - 2 : 0], req.body.x, req.body.y, 1, req.body.p);

		if(req.body.p){ // If the player passes, the server responds with increasing to turn counter
			if(ba.pass){ // If they passed once before
				ba.pass = false;
				var scores = ba.endGame(board);
				res.json({r: 'done', blackScore: scores[0], whiteScore: scores[1], last: ba.last}); // End the game if there is two passes
			}else{ // If this is the first pass
				ba.pass = true;
				res.json({turn: ba.turn + 1, r: r, ind: backIndex, last: ba.last}); // backIndex is sent so the front-end can store it. r is any sort of error message
			}
			return;
		}else{ // Player didn't pass
			ba.pass = false;
		}
	
		if(r == 'success'){
			res.json({board: board.readBoard(), turn: ba.turn + 1, r: r, ind: backIndex, last: ba.last});
		}else{
			res.json({r: r, ind: backIndex});
		}
		
	}else{ // Request an AI move. This is automatically called after a delay from the front-end
		ba.getMove(ba.type, board, board.lastMove.x, board.lastMove.y, board.lastMove.c, board.lastMove.pass, ba.last, function(r,board){
			if(r == 'pass'){ // If the AI passes, the server responds with increasing to turn counter
				if(ba.pass){ // If they passed once before
					ba.pass = false;
					var scores = ba.endGame(board);
					res.json({r: 'done', blackScore: scores[0], whiteScore: scores[1], last: ba.last}); // End the game if there is two passes
				}else{ // If this is the first pass
					ba.pass = true;
					res.json({turn: ba.turn + 1, r: r, ind: backIndex, last: ba.last}); // backIndex is sent so the front-end can store it. r is any sort of error message
				}
				return;
			}else{ // If the AI didn't pass
				ba.pass = false;
			}
				
			if(r == 'success'){
				res.json({board: board.readBoard(), turn: ba.turn + 1, r: r, ind: backIndex, last: ba.last});
			}else{
				res.json({r: r, ind: backIndex});
			}
		});
	}
});

// script.js should make post requests to this when it wants pvp responses
app.post("/versus", function(req,res){
	console.log(backs.length - 1);
	if(req.body.joining){ // is a joining player
		console.log("POST Request to: /versus - Joining");
	
		if(backs[req.body.ind] == null || backs[req.body.ind].type != 'pvp' || backs[req.body.ind].full){
			res.json({r:'unavailable'});
			return;
		}
		
		backs[req.body.ind].full = true;
		
		res.json({r: 'success', ind: req.body.ind, board: backs[req.body.ind].masterBoard.readBoard(), turn: backs[req.body.ind].turn, last: backs[req.body.ind].last});
	}else{ // making a new pvp room
		console.log("POST Request to: /versus - Move / Creation");
		
		var ba; // This is our back end object. It will be stored in an array of back objects so multiple people can access the server at once
		var backIndex = req.body.ind; // This is the index that ba cound be found at in the array
		
		if(backIndex === null){ // This checks for if its a users first move to the board. The server needs to create a new back-end object
			var br = [];
			for (br = []; br.length < req.body.b.length; br.push(Array(req.body.b.length)));
			for (var i = 0; i < req.body.b.length; i++){
				for (br[i] = []; br[i].length < req.body.b.length; br[i].push(Array(req.body.b.length)));
			}
			for(var i = 0; i < req.body.b.length; i++){
				for(var j = 0; j < req.body.b.length; j++){
					br[i][j] = 0;
				}
			}
			ba = new back("pvp",br,0,false); // Creating the new back-end object...
			
			backs.push(ba); // The object is pushed onto the array
			backIndex = backs.length - 1; // and the index is logged
		}else{
			ba = backs[backIndex]; // If this is a later turn by the user, the back-end object is just pulled from the array directly
			backIndex = backs.length - 1
			ba.turn = req.body.t + 1; // The back-end's turn counter is updated
		}
		
		var board = ba.masterBoard; // The board state is obtained. A conceptual model could be that the MVC model lives inside the back-end object

		if(req.body.sc){
			res.json({ind:backIndex});
			return;
		}
		
		// The move is attempted, the server automatically knows if the move is black or white depending on the current turn.
		var r = ba.makeMove(ba.last[(ba.turn - 2 >= 0) ? ba.turn - 2 : 0], req.body.x, req.body.y, (ba.turn % 2 === 0) ? 2 : 1, req.body.p);
		
		if(req.body.p){ // If the player passes, the server responds with increasing the turn counter
			if(ba.pass){ // If they passed once before
				ba.pass = false;
				ba.done = true;
				var scores = ba.endGame(board);
				ba.bScore = scores[0];
				ba.wScore = scores[1]
				res.json({r: 'done', blackScore: scores[0], whiteScore: scores[1], last: ba.last}); // End the game if there is two passes
			}else{
				ba.pass = true;
				res.json({turn: ba.turn, r: r, ind: backIndex, last: ba.last}); // backIndex is sent so the front-end can store it. r is any sort of error message
			}
			return;
		}else{
			ba.pass = false;
		}
		
		if(r == 'success'){ // On success, the new board state is returned. An incremented turn counter is passed
			res.json({board: board.readBoard(), turn: ba.turn,r: r, ind: backIndex, last: ba.last});
		}else{ // On failure, an error message is returned
			res.json({r: r, ind: backIndex});
		}
	}
});

app.post("/pvpPing", function(req,res){
	var i = req.body.ind;
	if(backs[i] != null && backs[i].type == 'pvp'){
		if(backs[i].turn%2==(req.body.f?0:1)){
			res.json({r:'success', board: backs[i].masterBoard.readBoard(),pass: backs[i].pass, turn: backs[i].turn,
				last: backs[i].last, done: backs[i].done, bScore: backs[i].bScore, wScore: backs[i].wScore});
		}else{
			res.json({r:'pingagain'});
		}
	}else{
		res.json({r:'invalid'});
	}
});


app.listen(process.env.PORT || 30018, function () {
    console.log("Listening on port 30018");
});
