"use strict"

var tokenA = "black";
var tokenB = "white";
var boardC = "white";
var board;
var lastGame;
var opponent;
var turn;
var backIndex;

/*
 * Initializes board and makes initial GET request.
 */
function init(n) {
    initOpponent(n,"hotseat");
}

function initOpponent(n,opp){
	backIndex = null;
	for (board = []; board.length < n; board.push(Array(n).fill(0)));
    lastGame = [board];
    opponent = opp;
    turn = 1;
    makeMove();
}

/*
 * Gets move based on click events on the canvas.
 * Recieves updated game infomation via callback.
 */
function makeMove() {
    drawBoard();
    $("#canvas").off();
    
    $("#canvas").click(function(e) {
        var sqLen = Math.round(500 / (board.length - 1));
        sendMove("/"+opponent,
				{x: Math.round((e.pageX - $(this).offset().left - 40) / sqLen),
                 y: Math.round((e.pageY - $(this).position().top - 40) / sqLen)},
                 turn,
                 false,
                 function(data) {
					if(data.r == 'success'){ // data should be some sort of error message or something
						board = data.board;
						turn = data.turn;
						backIndex = data.ind;
						lastGame.push(board);
						drawBoard();
						
						if(opponent == 'aa'){ // added for a short wait before ai responds, if in 'aa' mode
							setTimeout(function(){
							var sqLen = Math.round(500 / (board.length - 1));
							sendMove("/"+opponent,
										{x: 0,
										 y: 0},
										 turn,
										 false,
										 function(data) {
											if(data.r == 'success'){ // data should be some sort of error message or something
												board = data.board;
												turn = data.turn;
												backIndex = data.ind;
												lastGame.push(board);
												drawBoard();
											}else{
												console.log(data.r); // display error somehow
											}
										 });
							},750);
						}
					}else{
						console.log(data.r); // display error somehow
					}
                 });
	});
}

/*
 * Makes POST requests to server.
 *
 * url: the url to send a POST request to
 * coords: The x-y position of canvas where click occured; object with 2 integers.
 * turn: The player of the move.
 * cb: callback function (outlined in makeMove); updates game state.
 */
function sendMove(url,coords, turn, pass, cb) {
    $.post({
           url: url,
           dataType: "json",
           data: JSON.stringify({
                                'b': board,
                                'x': coords.x,
                                'y': coords.y,
                                't': turn,
								'prev': lastGame,
                                'p': pass,
								'ind': backIndex
                                }),
			contentType: "application/json",
			success: function(data) {
				cb(data);
			}
		});
}

/*
 * Draws the board and any tokens that have been stored in board.
 * Token colour is done based on player association in board.
 */
function drawBoard() {
    $("#canvas").empty();
    
    $("#canvas").css("background-color", boardC);
    var svg = $(makeSVG(580, 580));
	
    var sqLen = Math.round(500 / (board.length - 1));
    
    //Draw the lines of the Go board
    for (var i = 0; i < board.length; i++) {
        svg.append(makeLine(40, i*sqLen + 40, (board.length - 1)*sqLen + 40, i*sqLen + 40, "black", 2));
        svg.append(makeLine(i*sqLen + 40, 40, i*sqLen + 40, (board.length - 1)*sqLen + 40, "black", 2));
    }
    
    //Draw the tokens that have been placed on the board
    for (var j = 0; j < board.length; j++) {
        for (var k = 0; k < board.length; k++) {
            if (board[j][k] !== 0) {
                svg.append(makeCircle(j * sqLen + 40, k * sqLen + 40, Math.min(Math.ceil(580 / (3 * board.length)), 39), board[j][k] > 1 ? tokenB : tokenA));
            }
        }
    }
    
    $("#canvas").append(svg);
}

/*
 * makes POST request without altering board state
 */
function pass() {
    sendMove("/"+opponent,
			{x: 0,
            y: 0},
            turn,
            true,
            function(data) {
                turn = data.turn;
				backIndex = data.ind;
                lastGame.push(board);
            });
}

/*
 * Replays the last game. Resets the game state to an empty board.
 */
function replay(i) {
    if (i === 0) {
        lastGame.push(lastGame[0]);
        board = lastGame[i++];
        drawBoard();
    }
    setTimeout(function () {
                board = lastGame[i++];
                drawBoard();
                if (i < lastGame.length) {
                    replay(i);
                }
               }, 1000);
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
 *
 */
function gameMode(mode) {
	initOpponent(board.length,mode);
}

/*
 *Function to popup the rules of go as a pdf
 */
function popup(url) {
    newwindow=window.open(url,'name','height=500,width=650');
    if (window.focus) {newwindow.focus()}
    return false;
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

function dropGameModeList() {
    document.getElementById("game-mode-list").classList.toggle("show");
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
