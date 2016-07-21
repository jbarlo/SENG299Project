var b = require("board");		//placeToken(x, y, c){, readToken(x, y), readBoard()

var tokenA = "black";
var tokenB = "white";
var boardC = "white";
var board2;
var xinterface;


/*
 * Makes GET request to server.
 */
function getData(cb) {
    $.get("/data", function(data, textStatus, xhr) {
        console.log("Response for /data: " + textStatus);
        cb();
    });
}

/*
 * Gets move based on click events on the canvas.
 * Recieves updated game infomation via callback.
 */
function makeMove() {
    var turn = 1;
    drawBoard();
    if(board2.)
    $("#canvas").click(function(event) {
        getMove({x: event.offsetX, y: event.offsetY}, turn, function(data) {
            board = data.board;
            turn = data.turn;
            drawBoard();
        });
    });
}

/*
 * Draws the board and any tokens that have been stored in board.
 * Token colour is done based on player association in board.
 */
function drawBoard() {
    $("#canvas").empty();
    //$("#canvas").replaceWith(jQuery("<div>", {id: "canvas"}));
    $("#canvas").css("background-color", boardC);
    var svg = $(makeSVG(600, 600));
    var sqLen = Math.round(520 / (board.length - 1));
    
    //Draw the lines of the Go board
    for (var i = 0; i < board.length; i++) {
        svg.append(makeLine(40, i*sqLen + 40, (board.length - 1)*sqLen + 40, i*sqLen + 40, "black", 2));
        svg.append(makeLine(i*sqLen + 40, 40, i*sqLen + 40, (board.length - 1)*sqLen + 40, "black", 2));
    }

    //Draw the tokens that have been placed on the board
    for (var j = 0; j < board.length; j++) {
        for (var k = 0; k < board.length; k++) {
            if (board[j][k] !== 0) {
                svg.append(makeCircle(j * sqLen + 40, k * sqLen + 40, Math.min(Math.ceil(600 / (3 * board.length)), 39), board[j][k] > 0 ? tokenA : tokenB));
             }
        }
    }
    
    $("#canvas").append(svg);
}

/*
 * For the following 3 functions...
 *
 * Based on selection from dropdown menu, a new colour is chosen for the board,
 * or a player's tokens.
 *
 * newColour: string from a list of presets.
 */

function boardColour(newColour) {
    if (newColour === "rnd")
        boardC = "#"+((1<<24)*Math.random()|0).toString(16);
    else
        boardC = newColour;
    drawBoard();
}

function tokenAColour(newColour) {
    if (newColour === "rnd")
        tokenA = "#"+((1<<24)*Math.random()|0).toString(16);
    else
        tokenA = newColour;
    drawBoard();
}

function tokenBColour(newColour) {
    if (newColour === "rnd")
        tokenB = "#"+((1<<24)*Math.random()|0).toString(16);
    else
        tokenB = newColour;
    drawBoard();
}

/*
 * Five functions from www.w3schools.com/howto/howto_js_dropdown.asp
 *
 * Used in the creation of dropdown menus, and showing/hiding the menu content.
 */

//When the user clicks on the button, toggle between hiding/showing dropdown content
function dropBoardSizeList() {
    document.getElementById("board-size-list").classList.toggle("show");
}

function dropBoardColourList() {
    document.getElementById("board-colour-list").classList.toggle("show");
}

function dropTokenAColourList() {
    document.getElementById("tokena-colour-list").classList.toggle("show");
}

function dropTokenBColourList() {
    document.getElementById("tokenb-colour-list").classList.toggle("show");
}

//Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches(".dropbtn")) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains("show"))
                openDropdown.classList.remove("show");
        }
    }
}

/*
 * Makes POST requsets to server.
 *
 * coords: The x-y position of canvas where click occured; object with 2 integers.
 * turn: The player of the move.
 * cb: callback function (outlined in makeMove); updates game state.
 */
function getMove(coords, turn, cb) {
	board2.placeToken(coords.x, coords.y, turn);
    $.post({
        url : "/move",
        dataType : "json",
        data : JSON.stringify({
           'b' : board,
           'c' : coords,
           't' : turn
        }),
        contentType : "application/json",
        success : function(data) {
           cb(data);
        }
    });
}

/*
 * Initializes board and makes initial GET request.
 */
function init(n) {
    console.log("Initalizing Page....");
    //initialize 2 dimenstional array representing intersections on board
    for (board = []; board.length < n; board.push(Array(n).fill(0)));
	board2 = new b(n)
    getData(makeMove);
}

