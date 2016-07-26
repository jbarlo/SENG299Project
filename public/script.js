"use strict"

var tokenA = "black";
var tokenB = "white";
var boardC = "white";
var board; // a 2d array
var lastGame; // an array of 2d arrays. Stores every state of the game up until now
var opponent; // can currently either be set to "hotseat", "aa", or "versus" by the HTML.
var turn; // a counter for what turn it is. The server uses this to determine the colour
var backIndex; // An index for the back-end object array to find the users particular game
var gameOver = false; //player can't play while gameOver is true
var isFirst = true; // For use in pvp, the player who joins a room is not first

var newGameForm = document.getElementById('new-game-form');
var newGameButton = document.getElementById('new-game');
var closeNewGameMenu = document.getElementsByClassName("close")[0];
var closeEndGameMenu = document.getElementsByClassName("close")[1];
var tempGameSize=13;
var tempGameType='hotseat';
var tempGameDifficulty;
var endGameScreen = document.getElementById('end-game-screen');

newGameButton.onclick = function(){	//displays new game menu on click
	newGameForm.style.display="block";
}
closeNewGameMenu.onclick = function(){	//hides new game menu without changing options upon exiting the menu
	newGameForm.style.display="none";
}
closeEndGameMenu.onclick = function(){
	endGameScreen.style.display="none";
}
function gameTypeString(gameTypeToString){
	var difficultyString;
	if(tempGameDifficulty==1){
		difficultyString='Easy';
	}
	else if(tempGameDifficulty==2){
		difficultyString='Medium';
	}
	else{
		difficultyString='Hard';
	}
	if(gameTypeToString=='hotseat'){
		return 'Game Type: Hotseat Mode';
	}
	else if(gameTypeToString=='aa'){
		return 'Game Type: AI Mode - Difficulty: '+difficultyString;
	}
	else if(gameTypeToString=='versus'){
		return 'Game Type: Versus Mode';
	}
	else{
		return 'Some error occured';
	}
}

function setGameSize(n){
	tempGameSize=n;
	document.getElementById("board-size-display").innerHTML = 'Board Size: '+tempGameSize+' x '+tempGameSize;
	document.getElementById("game-type-display").innerHTML = gameTypeString(tempGameType);
}

function setGameType(type,difficulty){
	tempGameType=type;
	tempGameDifficulty=difficulty;
	document.getElementById("board-size-display").innerHTML = 'Board Size: '+tempGameSize+' x '+tempGameSize;
	document.getElementById("game-type-display").innerHTML = gameTypeString(tempGameType);
}

function startNewGame(){	//starts a new game when the new game button is pressed.
	initOpponent(tempGameSize,tempGameType);
	newGameForm.style.display="none";
}

/*
 * Initializes board and makes initial GET request.
 */
 
 // Called from HTML, you start here			<-------
function init(n) {
    initOpponent(n,"hotseat");
}

function initOpponent(n,opp){
	var pvpRoom = getQueryVariable("room");
	if(pvpRoom !== false){
		pvpRoom = parseInt(pvpRoom);
		if(!isNaN(pvpRoom)){
			newGameForm.style.display="none";
			getPvp(pvpRoom);
			return;
		}else{
			window.location.replace("/");
		}
	}
	
	backIndex = null;
	for (board = []; board.length < n; board.push(Array(n).fill(0)));
    lastGame = [board];
    opponent = opp;
    turn = 1;
	gameOver = false;
	if(opponent=='versus'){
		turn = 0;
		sendMove('/versus',{x:0,y:0},turn,false,function(data){
			backIndex = data.ind;
		},true);
	}
    makeMove();
    drawBoard();
}

// Code snippet by Chris Coyier
function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

function getPvp(room){
	$.post({
	   url: "/versus",
	   dataType: "json",
	   data: JSON.stringify({
							'joining': true,
							'ind': room
							}),
		contentType: "application/json",
		success: function(data) {
			if(data.r == 'success'){
				isFirst = false;
				backIndex = data.ind;
				board = data.board;
				lastGame = data.last;
				opponent = 'versus';
				turn = data.turn;
				gameOver = false;
				makeMove();
				drawBoard();
				pvpPing();
				return;
			}else if(data.r == 'unavailable'){
				console.log("Room not available. Try again or play a different game mode");// message for unavailable room, setting game to hotseat
			}else{
				window.location.replace("/");
			}
		}
	});
}

function pvpPing(){
	$.post({
	   url: "/pvpPing",
	   dataType: "json",
	   data: JSON.stringify({
							'ind': backIndex,
							'f': isFirst
							}),
		contentType: "application/json",
		success: function(data) {
			if(gameOver) return;
			
			if(data.r == 'success'){	
				turn = data.turn;
				board = data.board;
								
				if(data.done){
					gameEnded(data.bScore,data.wScore)
				}else if(data.pass){
					document.getElementById("player-display").innerHTML = 'Opponent passed!';
					$("#notification").fadeIn("slow");
					setInterval(function(){
						$("#notification").fadeOut("slow");
					},1500);
				}

				drawBoard();
				return true;
			}else if(data.r == 'pingagain'){
				setTimeout(pvpPing,1000);
			}else{
				console.log(data.r); // display error somehow
				return false;
			}
		}
	});
}


/*
 * Gets move based on click events on the canvas.
 * Recieves updated game infomation via callback.
 */
function makeMove() {
    $("#canvas").off();
    $("#canvas").click(function(e) {
		if(gameOver) return; // no playing if game is over
		
		if(opponent=='aa'&&turn%2===(isFirst ? 0 : 1)) return;
		if(opponent=='versus'&&turn%2===(isFirst ? 1 : 0)){
			console.log(turn);
			console.log("blocked");
			return;
		};
		
        var sqLen = Math.round(500 / (board.length - 1));
        sendMove("/"+opponent,
				{x: Math.round((e.pageX - $(this).offset().left - 40) / sqLen),
                 y: Math.round((e.pageY - $(this).position().top - 40) / sqLen)},
                 turn,
                 false,
                 function(data) {
					if(data.r == 'done'){
						// Server will do funky things if you do anything after the game should have ended. endState needs to be implemented fully, then init/initOpponent needs to be called again
						gameEnded(data.blackScore, data.whiteScore);
						return; 
					}else if(data.r == 'success'){ // data should be some sort of error message or something
						board = data.board;
						turn = data.turn;
						backIndex = data.ind;
						lastGame = data.last;
						drawBoard();
					}else if(data.r == 'pass'){
						turn = data.turn;
						backIndex = data.ind;
						lastGame = data.last;
						var colorString = 'Black ';
						if(turn%2==1){
							colorString = 'White ';
						}
						document.getElementById("player-display").innerHTML = colorString+' passed!';
						$("#notification").fadeIn("slow");
						setInterval(function(){
							$("#notification").fadeOut("slow");
						},1500);
					}else{
						console.log(data.r); // display error somehow
						drawBoard();
						return;
					}
					
					aaTimerCall(100);
                 });
				 
		if(opponent=='versus') pvpPing();
	});
}

/*
 * makes POST request without altering board state
 */
function pass() {
	if(gameOver) return; //no playing if game is over
	
	if(opponent=='aa'&&turn%2===(isFirst ? 0 : 1)) return;
	if(opponent=='versus'&&turn%2===(isFirst ? 1 : 0)) return;
	
	sendMove("/"+opponent,
			{x: 0,
			y: 0},
			turn,
			true,
			function(data) {
				if(data.r == 'done'){
					// Server will do funky things if you do anything after the game should have ended. endState needs to be implemented fully, then init/initOpponent needs to be called again
					gameEnded(data.blackScore, data.whiteScore);
					return;
				}else if(data.r == 'success'){
					turn = data.turn;
					backIndex = data.ind;
					lastGame = data.last;
				}else if(data.r == 'pass'){
						turn = data.turn;
						backIndex = data.ind;
						lastGame = data.last;
						var colorString = 'Black ';
						if(turn%2==1){
							colorString = 'White ';
						}
						if(opponent=='versus'){ // Pulled an all-nighter making pvp and the turn ended up shifted by one, don't judge me.
							colorString = 'You';
						}
						
							document.getElementById("player-display").innerHTML = colorString+' passed!';
							$("#notification").fadeIn("slow");
							setInterval(function(){
								$("#notification").fadeOut("slow");
							},1500);
					}else{
					console.log(data.r); // display error somehow
					return;
				}
				
				aaTimerCall(100);
			});
	if(opponent=='versus') pvpPing();
}

function gameEnded(blackScore, whiteScore){
	gameOver = true;
	
	var endGameString = 'Game over!<br>';
	if(blackScore>whiteScore){
		endGameString+='Black wins!<br>';
	}
	else if(whiteScore>blackScore){
		endGameString+='White wins!<br>';
	}
	else{
		endGameString+='Tie game!<br>';
	}
	endGameString+='Black: '+blackScore+'<br>White: '+whiteScore;
	document.getElementById('score-display').innerHTML = endGameString;
	endGameScreen.style.display="block";
}

// When in AI mode, waits for a bit, then displays the AI's move
function aaTimerCall(time){
	if(opponent == 'aa'){ // added for a short wait before ai responds, if in 'aa' mode
		var sqLen = Math.round(500 / (board.length - 1));
		sendMove("/"+opponent,
					{x: 0,
					 y: 0},
					 turn,
					 false,
					 function(data){ // Pretty hacky, I know
						setTimeout(function(){
							if(data.r == 'done'){
								gameEnded(data.blackScore, data.whiteScore);
								drawBoard();
							}else if(data.r == 'success'){ // data should be some sort of error message or something
								board = data.board;
								turn = data.turn;
								backIndex = data.ind;
								lastGame.push(board);
								drawBoard();
							}else if(data.r == 'pass'){
								turn = data.turn;
								backIndex = data.ind;
								lastGame.push(board);
								var colorString = 'Black ';
								if(turn%2==1){
									colorString = 'White ';
								}
								document.getElementById("player-display").innerHTML = colorString+' passed!';
								$("#notification").fadeIn("slow");
								setInterval(function(){
									$("#notification").fadeOut("slow");
								},1500);
							}else{
								console.log(data.r); // display error somehow
							}
						}, time)
					 });
	}
}

/*
 * Makes POST requests to server.
 *
 * url: the url to send a POST request to
 * coords: The x-y position of canvas where click occured; object with 2 integers.
 * turn: The player of the move.
 * cb: callback function (outlined in makeMove); updates game state.
 * setupCall: a boolean set to true if no turn is being made and the request is only to initialize a back object. Typical function calls can skip this one
 */
function sendMove(url,coords, turn, pass, cb, setupCall) {
    $.post({
           url: url,
           dataType: "json",
           data: JSON.stringify({
                                'b': board,
                                'x': coords.x,
                                'y': coords.y,
                                't': turn,
								'prev': lastGame[(turn - 2 >= 0) ? turn - 2 : 0], // -1 for fixing index, and another -1 to become the previous one
                                'p': pass,
								'ind': backIndex,
								'diff':tempGameDifficulty,
								'sc':(setupCall==null)?false:setupCall
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
 * Replays the last game. Resets the game state to an empty board.
 */
function replay(i) {
    if (i === 0) {
        lastGame.push(lastGame[0]);
    }
    setTimeout(function () {
                board = lastGame[i++].tokenSpots;
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
 * When a gamemode is chosen in the HTML, it launches this. Resets everything
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
