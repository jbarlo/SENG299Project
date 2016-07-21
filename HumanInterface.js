function getMove(b, x, y, colour, pass, cb){
    var board = b.readBoard();
    if (!pass) {
        if (!b.readToken(x, y)) {
            b.placeToken(x, y, colour);
        }
    }
    
    var http = require("http");
    var req = http.request({port: '3000', method: 'POST'}, cb(b, -1 * colour));
    req.end();
}

function connect(colour, extra) {
    return true;
}

module.exports = {
    getMove : getMove
}
