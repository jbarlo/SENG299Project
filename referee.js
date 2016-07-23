// Methods with comment blocks are the exported methods, all else are helper methods and not useful outside of the file

/*
* blackColour: the int used to represent black pieces
* whiteColour: the int used to represent white pieces
* state: the board object
* komi: the additional points that white gets because they go second, typically 6.5 on a 19x19 size board
*
* Output: An array containing black's score in index 0, and white's score in index 1. e.g. if black's score is 3 and white's is 5: [3,5]
*/
function calculateScore(blackColour, whiteColour, state, komi){
	if(komi == null) komi = 0;
	var blackScore = 0;
	var whiteScore = komi;
	var emptyAlreadyChecked = [];
	
	for(var x = 0; x < state.size; x++){
		for(var y = 0; y < state.size; y++)
		{
			// has this coord already been checked?
			var skip = false;
			for(n of emptyAlreadyChecked){
				if(x === n[0] && y === n[1]){
					skip = true;
				}
			}
			if(skip) continue;
			
			if(state.readToken(x,y) === blackColour){
				blackScore++;
			}else if(state.readToken(x,y) === whiteColour){
				whiteScore++;
			}else{
				var scoreLibs = scoringLibertyFinder(x,y,state);
				//does the area belong to black?
				var blackTerritory = true;
				for(l of scoreLibs[1]){
					if(state.readToken(l[0],l[1]) !== blackColour) blackTerritory = false;
				}
				if(blackTerritory){
					for(a of scoreLibs[0]){
						blackScore++;
					}
				}else{				
					//does the area belong to white?
					var whiteTerritory = true;
					for(l of scoreLibs[1]){
						if(state.readToken(l[0],l[1]) !== whiteColour) whiteTerritory = false;
					}
					if(whiteTerritory){
						for(a of scoreLibs[0]){
							whiteScore++;
						}
					}
				}
			}
			emptyAlreadyChecked.push.apply(emptyAlreadyChecked,scoreLibs[0]);
		}	
	}
	
	return [blackScore,whiteScore];
}

/*
* c: the colour of the playing player
* state: the current board object
* prevState: the previous board object (for determining ko moves)
*
* Output: true if a move is possible, false if no more moves are available
*/
function checkForAvailableMoves(c,state,prevState){
	for(var x = 0; x < state.size; x++){
		for(var y = 0; y < state.size; y++){
			if(checkMoveValidity(x,y,c,state,prevState)) return true;
		}
	}
	return false;
}


/*
* x: the x coordinate of the new move. 0 <= x < size of state
* y: the y coordinate of the new move. 0 <= y < size of state
* c: the colour of the new move
* state: the board state in the form of a board object
* prevState: the previous board state (should be the state after the players current players previous move)
* 
* output: true if valid move, false if invalid move
*/
function checkMoveValidity(move, state, prevState){
	var x = move.x;
	var y = move.y;
	var c = move.c;
	
	if(move.pass){
		return true;
	}
	
	if(state.size === 0){
		return false;
	}
	
	// check for already occupied space
	if(state.readToken(x,y) !== 0) return false;
	
	// check for suicide
	var clone = state.cloneBoard();
	clone.placeToken(x,y,c);
	var libs = determineLiberties(x, y, clone);
	var toReturn = false;
	for(u of libs){
		if(clone.readToken(u[0],u[1]) === 0){
			toReturn = true;
		}
	}
	
	if(!toReturn){
		var suicide = true;
		
		for(u of libs){
			suicide = isSuicide(u[0], u[1], c, clone) ? suicide : false;
		}
		
		if(suicide) return false;
	}
	
	// check for ko move
	var clone = state.cloneBoard()//JSON.parse(JSON.stringify(state));
	clone.placeToken(x,y,c);
	
	var libs = determineLiberties(x,y,clone);
	for(u of libs){
		if(clone.readToken(u[0],u[1]) === 0) continue;
		
		var enLibs = determineLiberties(u[0], u[1], clone);
		var isSurrounded = true;
		for(e of enLibs){
			if(clone.readToken(e[0], e[1]) !== c){
				isSurrounded = false;
				break;
			}
		}
		if(isSurrounded){
			var enArmy = determineArmy([[u[0],u[1]]], clone);
			for(unit of enArmy){
				clone.tokenSpots[unit[0]][unit[1]] = 0;
			}
		}
	}
  	
	var isKo = true;
	for(var i = 0; i < clone.size; i++){
		for(var j = 0; j < clone.size; j++){
			if(clone.readToken(i,j) !== prevState.readToken(i,j)){
				isKo = false;
			}
		}
	}
	if(isKo) return false;
  	
	// Otherwise
	
	return true;
}

function isSuicide(x, y, c, state){
	if(state.readToken(x,y) === c) return true; // keep looking
	if(state.readToken(x,y) === 0) return false; // saved by a glitch
	var libs = determineLiberties(x, y, state);
	var toReturn = false;
	for(l of libs){ // if there exists a liberty that isn't yours, it's a suicide
		if(state.readToken(l[0],l[1]) !== c) toReturn = true;
	}
	return toReturn;
}

function determineArmyStarter(x, y, state){
	return determineArmy([[x,y]], state);
}

/*
* army: a list of coordinates that the army consists of. Coordinates must be represented as [x,y], where 0 <= x and y < size of board
* state: the board state
*
* output: the army the unit is connected to
* returns empty array if invalid inputs
*/
function determineArmy(army, state){	
	var c = state.readToken(army[0][0],army[0][1]);
	
	if(c === 0){
		return [];
	}
	
	return emptyArmyHelper(army, state);
}

function emptyArmyHelper(army, state){
	var c = state.readToken(army[0][0],army[0][1]);
	var repeat = false;
	
	for(u of army){
		var x = u[0];
		var y = u[1];
		
		if(y + 1 < state.size){
			repeat = determineArmyHelper(x, y + 1, c, state, army) ? true : repeat;
		}
		if(y - 1 >= 0){
			repeat = determineArmyHelper(x, y - 1, c, state, army) ? true : repeat;
		}
		if(x + 1 < state.size){
			repeat = determineArmyHelper(x + 1, y, c, state, army) ? true : repeat;
		}
		if(x - 1 >= 0){
			repeat = determineArmyHelper(x - 1, y, c, state, army) ? true : repeat;
		}
	}
	
	if(repeat) return emptyArmyHelper(army, state);
		
	return army;
}

function determineArmyHelper(x, y, c, state, army){
	if(state.readToken(x,y) === c && !hasInArray([x, y], army)){
		army.push([x, y]);
		return true;
	}
	return false
}

/*
* x: the x coordinate of a unit in an army. 0 <= x < size of board
* y: the y coordinate of a unit in an army. 0 <= y < size of board
* state: the board state
*
* output: an array of the coordinates of liberties
*/
function determineLiberties(x, y, state){	
	var c = state.readToken(x,y);
	
	if(c === 0){
		return [];
	}
	
	var army = determineArmy([[x, y]], state);
	
	return libertyHelper(c,army,state);
}


function scoringLibertyFinder(x, y, state){
	var c = state.readToken(x,y);
	
	var army = emptyArmyHelper([[x, y]], state);
	
	return [army,libertyHelper(c,army,state)];
}

function libertyHelper(c,army,state){
	var liberties = [];
	
	for(unit of army){
		var x = unit[0];
		var y = unit[1];
		
		if(x + 1 < state.size && state.readToken(x + 1, y) !== c && !hasInArray([x + 1, y], liberties)){
			liberties.push([x + 1, y]);
		}
		if(x - 1 >= 0 && state.readToken(x - 1, y) !== c && !hasInArray([x - 1, y], liberties)){
			liberties.push([x - 1, y]);
		}
		if(y + 1 < state.size && state.readToken(x, y + 1) !== c && !hasInArray([x, y + 1], liberties)){
			liberties.push([x, y + 1]);
		}
		if(y - 1 >= 0 && state.readToken(x, y - 1) !== c && !hasInArray([x, y - 1], liberties)){
			liberties.push([x, y - 1]);
		}
	}
	
	return liberties;
}

function hasInArray(n, array){
	if(array[0] == null) return false;
	var l = n.length;
	if(array[0].length < l) l = array[0].length;
	
	for(i of array){
		toReturn = true;
		for(var j = 0; j < l; j++){
			if(n[j] !== i[j]){
				toReturn = false;
			}
		}
		if(toReturn) return true;
	}
	return false;
}



module.exports = {
	checkMoveValidity : checkMoveValidity,
	determineArmy : determineArmyStarter,
	determineLiberties : determineLiberties,
	calculateScore : calculateScore,
	checkForAvailableMoves : checkForAvailableMoves
}
