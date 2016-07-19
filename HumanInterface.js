const assert = require("assert");

function getMove(board, x, y, colour, cb){
    var sqLen = Math.round(500 / (board.length - 1));

    var newX = Math.round((x - 40) / sqLen) * sqLen;
    var newY = Math.round((y - 40) / sqLen) * sqLen;
    
    assert(newX/sqLen < board.length && newX % 1 === 0);
    assert(newY/sqLen < board.length && newY % 1 === 0);
    
    if (!board[(newX/sqLen)][(newY/sqLen)]) {
        board[(newX/sqLen)][(newY/sqLen)] = colour;
        colour *= -1;
    }

    var http = require("http");
    var req = http.request({port: '3000', method: 'POST'}, cb(board, colour));
    req.end();
}

function connect() {
    return true;
}

module.exports = {
    getMove : getMove
}
