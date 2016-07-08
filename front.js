var boardSize = 4;
for(var squares = []; squares.length < boardSize + 1;)
    squares.push(Array(boardSize + 1).fill(0));

/**
 * Draws the board to the #canvas element on the page. 
 *
 * @param state {object} - an object representing the state of the board.  
 */ 
function drawBoard(delBoard, newSize){
    if(delBoard) {
        document.getElementById("canvas").innerHTML = "";
        boardSize = newSize;
        for(squares = []; squares.length < boardSize + 1;)
            squares.push(Array(boardSize + 1).fill(0));
    }
    var turn = true;
    
    var canvas = $("#canvas");

    var size = 580;
    canvas.css("height", size);
    canvas.css("width", size);
    
    var squareLength = Math.round(size/boardSize);
    var tokenSize = Math.ceil(size / (3 * boardSize));

    var svg = $(makeSVG(size, size));

    canvas.css("background-color", "white");
    for (var i = 0; i < squareLength; i++) {
        svg.append(makeLine(0, i*squareLength, size, i*squareLength, "black", 2));
        svg.append(makeLine(i*squareLength, 0, i*squareLength, size, "black", 2));
    }
    
    canvas.click(function(event) {
        var c = getRelativeCoords(event);
        var x = Math.round((c.x) / squareLength) * squareLength;
        var y = Math.round((c.y) / squareLength) * squareLength;
            
        if (!squares[(x/squareLength)][(y/squareLength)]) {
            svg.append(makeCircle(x, y, tokenSize, turn ? "black" : "white"));
            squares[(x/squareLength)][(y/squareLength)] = turn ? 1 : -1;
            turn = turn ? false : true;
        }
    });

    canvas.append(svg);
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
function dropList() {
    document.getElementById("dropdown-list").classList.toggle("show");
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
