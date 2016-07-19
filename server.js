/*
 * This server is modified from and based on code supplied by SENG 299,
 * summer session 2016, for labs 4 and 6. Originally written by Simon Diemert.
 */

"use strict";

var express = require("express");
var humanInterface = require("./HumanInterface.js");
/*
var aiInterface = require("./AIInterface.js");
var vsInterface = require("./VSInterface.js");
 */

var app = express();

app.use(require("body-parser").json());

app.use(express.static('public'));

app.get("/data", function (req, res) {
    console.log("GET Request to: /data");
    res.json(0);
});

app.post("/move", function(req, res) {
    console.log("POST Request to: /move");
    if(req.body.o === "ai") {
         //call ai
    } else if(req.body.o === "versus") {
         //call other player
    } else if(req.body.o === "hotseat") {
        humanInterface.getMove(req.body.b, req.body.c, req.body.t, function(b, t) {
            res.json({board: b, turn: t});
        });
    }
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Listening on port 3000");
});
