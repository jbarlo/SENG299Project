var tokenA = "black";
var tokenB = "white";
var boardC = "white";
var board;
var tokenSize;
var squareLength;
var turn;

function getData(cb, n) {
    $.get("/data", function(data, textStatus, xhr) {
        console.log("Response for /data: " + textStatus);

        cb(n);
    });
}

function makeMove(boardSize) {
    turn = true;
    for (board = []; board.length < boardSize; board.push(Array(boardSize + 1).fill(0)));

    tokenSize = Math.min(Math.ceil(600 / (3 * boardSize)), 39);
    squareLength = Math.round(520 / (boardSize - 1));

    drawBoard();
    
    $("#canvas").click(function(event) {
        getMove(getRelativeCoords(event));
    });
}

function drawBoard() {
    document.getElementById("canvas").innerHTML = "";

    var svg = $(makeSVG(600, 600));
    $("#canvas").css("height", 600);
    $("#canvas").css("width", 600);
    
    $("#canvas").css("background-color", boardC);
    for (var i = 0; i < board.length; i++) {
        svg.append(makeLine(40, i*squareLength + 40, (board.length - 1)*squareLength + 40, i*squareLength + 40, "black", 2));
        svg.append(makeLine(i*squareLength + 40, 40, i*squareLength + 40, (board.length - 1)*squareLength + 40, "black", 2));
    }

    for (var j = 0; j < board.length; j++) {
        for (var k = 0; k < board.length; k++) {
            if (board[j][k] !== 0) {
                svg.append(makeCircle(j * squareLength + 40, k * squareLength + 40, tokenSize, board[j][k] > 0 ? tokenA : tokenB));
             }
        }
    }
    
    $("#canvas").append(svg);
}

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
 * From stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element
 */
function getRelativeCoords(event) {
    return {x: event.offsetX, y: event.offsetY};
}

/*
 * Two functions from www.w3schools.com/howto/howto_js_dropdown.asp
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
            if (openDropdown.classList.contains("show")) {
                openDropdown.classList.remove("show");
            }
        }
    }
}

function getMove(coords) {
    $.post({
        type: 'POST',
        url : '/move',
        dataType : "json",
        data : JSON.stringify({
           'b' : board,
           'c' : coords,
           't' : turn
        }),
        contentType : "application/json",
        async: false,
        success : function(data) {
           board = data.board;
           turn = data.turn;
           drawBoard();
        }
    });
}

function init(n) {
    console.log("Initalizing Page...."); 
    getData(makeMove, n);
}
