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

app.get("/data", function (req, res) {
    console.log("GET Request to: /data");
    res.json(0);
});

app.post("/move", function(req, res) {
    console.log("POST Request to: /move");
    back.getMove(new boardObject(req.body.b), req.body.x, req.body.y, req.body.t, req.body.p, function(newb, newt) {
                        res.json({board: newb.readBoard(), turn: newt});
                    });
});

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
	
	ba.makeMove(board, req.body.x, req.body.y, (ba.turn % 2 === 0) ? 2 : 1, req.body.p, function(r){
		if(r == 'success'){
			res.json({board: board.readBoard(), turn: ba.turn + 1,r: r, ind: backIndex});
		}else{
			res.json({r: r, ind: backIndex});
		}
	});
});

app.post("/aa", function(req, res){
	console.log("POST Request to: /aa");
	
	var diff = 1;
	
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
	
	ba.makeMove(board, req.body.x, req.body.y, (ba.turn % 2 === 0) ? 2 : 1, req.body.p, function(r){
		if(r !== 'success'){
			res.json({r: r, ind: backIndex});
		}
	});
	
	ba.getMove(ba.type, board, req.body.x, req.body.y, (ba.turn % 2 === 0) ? 2 : 1, req.body.p, function(r){
		if(r == 'success'){
			res.json({board: board.readBoard(), turn: ba.turn + 2, r: r, ind: backIndex});
		}else{
			res.json({r: r, ind: backIndex});
		}
	});
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Listening on port 3000");
});
