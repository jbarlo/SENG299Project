/*

*/
class board{
	constructor(s){
		this.size = s;
		this.tokenSpots = new Array(s);
		for(n = 0; n < s; n++){
			this.tokenSpots[n] = new Array(s);
		}
		for(n = 0; n < s; n++){
			for(i = 0; i < s; i++){
				this.tokenSpots[n][i] = 0;
			}
		}
	}
	
	function placeToken(x, y, c){
		this.tokenSpots[x][y] = c;
	}
	function readBoard(){
		return this.tokenSpots;
	}
	
}