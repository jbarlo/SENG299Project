/*

*/
var assert = require('assert');


function board(s){
	this.size = s;
	this.tokenSpots = [];
	for(n = 0; n < s; n++){
		this.tokenSpots[n] = [];
	}
	for(n = 0; n < s; n++){
		for(i = 0; i < s; i++){
			this.tokenSpots[n][i] = 0;
		}
	}
}

function placeToken(x, y, c){
	this.tokenSpots[x][y] = c;
	return(tokenSpots[x][y]);
}
function readToken(x, y){
	return(tokenSpots[x][y]);
}
function readBoard(){
	var str = 'Board\n';
	for(n = 0; n < this.size; n++){
		str += "\n"
		for(i = 0; i < this.size; i++){
			str += this.tokenSpots[n][i];
		}
	}
	return str;
}




/*
describe('boardTester', function(){
	board(5);
	
	before(function(){
		console.log("Tests are about to run");
	});
	after(function(){
		console.log("Tests complete");
	});
	
	
	it('should initiate tokens to 0',function(){
		for(n = 0; n < this.size; n++){
			for(i = 0; i < this.size; i++){
				assert.equal(this.tokenSpots[n][i]);
			}
		}
	});
	
	it('should return token value when changed',function(){
		assert.equal(placeToken(1,1,1), 1);
	});
	
	it('should return token value when read',function(){
		assert.equal(readToken(1,1), 1);
		assert.equal(readToken(1,2), 0);
	});
});
*/