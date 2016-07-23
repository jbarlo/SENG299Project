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
    console.log("POST Request to: /hotseat");
	
	var ba;
	var backIndex = req.body.ind;
	if(backIndex === null){
		var br;
		for (br = []; br.length < req.body.b.length; br.push(Array(req.body.b.length).fill(0)));
		ba = new back("hotseat",br,req.body.t);
		
		backs.push(ba);
		
		backIndex = backs.length - 1;
	}else{
		ba = backs[backIndex];
		ba.turn = req.body.t;
	}
	if(req.body.p){
		res.json({turn: ba.turn + 1, });
		return;
	}
	
	var board = ba.masterBoard;
	
	var r = ba.makeMove(board, req.body.x, req.body.y, (ba.turn % 2 === 0) ? 2 : 1, req.body.p);
	if(r == 'success'){
		res.json({board: board.readBoard(), turn: ba.turn + 1,r: r, ind: backIndex});
	}else{
		res.json({r: r, ind: backIndex});
	}
});

// script.js should make POST requests to this when it wants ai responses
app.post("/aa", function(req, res){
	console.log("POST Request to: /aa");
	
	var diff = 3; //  should probably be controlled by something on the front end, but that doesn't exist yet
	
	var ba;
	var backIndex = req.body.ind;
	if(backIndex === null){
		var br;
		for (br = []; br.length < req.body.b.length; br.push(Array(req.body.b.length).fill(0)));
		ba = new back("ai",br,req.body.t);
		
		backs.push(ba);
		
		backIndex = backs.length - 1;
	}else{
		ba = backs[backIndex];
		ba.turn = req.body.t;
	}
	
	var board = ba.masterBoard;
	
	ba.connect(ba.type, diff);
	
	if(ba.turn % 2 === 1){ // place a player move
		var r = ba.makeMove(board, req.body.x, req.body.y, 1, req.body.p);
		if(r == 'success'){
			res.json({board: board.readBoard(), turn: ba.turn + 1, r: r, ind: backIndex});
		}else{
			res.json({r: r, ind: backIndex});
		}
	}else{ // request an ai move
		console.log(board.lastMove);
		ba.getMove(ba.type, board, board.lastMove.x, board.lastMove.y, board.lastMove.c, board.lastMove.pass, function(r){
			if(r == 'success'){
				res.json({board: board.readBoard(), turn: ba.turn + 1, r: r, ind: backIndex});
			}else{
				res.json({r: r, ind: backIndex});
			}
		});
	}
});

// script.js should make post requests to this when it wants pvp responses
app.post("/versus", function(req,res){
	
});


app.listen(process.env.PORT || 3000, function () {
    console.log("Listening on port 3000");
});
