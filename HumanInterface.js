function getMove(board, coords, turn, cb){
    var sqLen = Math.round(520 / (board.length - 1));

    var x = Math.round((coords.x - 40) / sqLen) * sqLen;
    var y = Math.round((coords.y - 40) / sqLen) * sqLen;
    
    if (!board[(x/sqLen)][(y/sqLen)]) {
        board[(x/sqLen)][(y/sqLen)] = turn ? 1 : -1;
        turn = turn ? false : true;
    }
    
    var http = require("http");
    var req = http.request({port: '3000', method: 'POST'}, cb(board, turn));
    req.end();
}

module.exports = {
    getMove : getMove
}
