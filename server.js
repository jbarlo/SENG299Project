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

app.listen(process.env.PORT || 3000, function () {
    console.log("Listening on port 3000");
});
