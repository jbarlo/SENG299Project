function getMove(board, x, y, colour, cb){
    var sqLen = Math.round(500 / (board.length - 1));

    var row = Math.round((x - 40) / sqLen);
    var column = Math.round((y - 40) / sqLen);
    
    if (!board[row][column]) {
        board[row][column] = colour;
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
