var tokenA;
var tokenB;
var squares;
var tokenSize;
var squareLength;

/**
 * Draws the board to the #canvas element on the page. 
 *
 * @param state {object} - an object representing the state of the board.  
 */ 
function makeMove(boardSize) {
    var turn = true;
    for (squares = []; squares.length < boardSize + 1;)
        squares.push(Array(boardSize + 1).fill(0));
    
    tokenSize = Math.min(Math.ceil(600 / (3 * boardSize)), 39);
    squareLength = Math.round(520 / boardSize);
    tokenA = "black";
    tokenB = "white";
    
    drawBoard();
    
    $("#canvas").click(function(event) {
        var coords = getRelativeCoords(event);
        var x = Math.round((coords.x - 40) / squareLength) * squareLength;
        var y = Math.round((coords.y - 40) / squareLength) * squareLength;
        
        if (!squares[(x/squareLength)][(y/squareLength)]) {
            squares[(x/squareLength)][(y/squareLength)] = turn ? 1 : -1;
            turn = turn ? false : true;
            drawBoard();
        }
    });
}

function drawBoard() {
    document.getElementById("canvas").innerHTML = "";

    var svg = $(makeSVG(600, 600));
    $("#canvas").css("height", 600);
    $("#canvas").css("width", 600);
    
    $("#canvas").css("background-color", "white");
    for (var i = 0; i < squares.length; i++) {
        svg.append(makeLine(40, i*squareLength + 40, (squares.length - 1)*squareLength + 40, i*squareLength + 40, "black", 2));
        svg.append(makeLine(i*squareLength + 40, 40, i*squareLength + 40, (squares.length - 1)*squareLength + 40, "black", 2));
    }

    for (var j = 0; j < squares.length; j++) {
        for (var k = 0; k < squares.length; k++) {
            if (squares[j][k] !== 0) {
                svg.append(makeCircle(j * squareLength + 40, k * squareLength + 40, tokenSize, squares[j][k] > 0 ? tokenA : tokenB));
             }
        }
    }
    
    $("#canvas").append(svg);
}

function boardColour(newColour) {
    if (newColour === "rnd")
        $("#canvas").css("background-color", "#"+((1<<24)*Math.random()|0).toString(16));
    else
        $("#canvas").css("background-color", newColour);
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
