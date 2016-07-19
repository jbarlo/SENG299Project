function getMove(board, x, y, c, cb){
    var sqLen = Math.round(520 / (board.tokenSpots.length - 1));

    var x = Math.round((x - 40) / sqLen) * sqLen;
    var y = Math.round((y - 40) / sqLen) * sqLen;
    
    if (!board.tokenSpots[(x/sqLen)][(y/sqLen)]) {
        board.tokenSpots[(x/sqLen)][(y/sqLen)] = turn ? 1 : -1;
        turn = turn ? false : true;
    }
    
    var http = require("http");
    var req = http.request({port: '3000', method: 'POST'}, cb(board, turn));
    req.end();
	return board;
}
//Handles initialization of various interface components
function connect(board, colour, extra){
	return true;
}
/*
module.exports = {
    getHumanMove : getHumanMove
}*/