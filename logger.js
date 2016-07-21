var MongoClient = require("mongodb").MongoClient;

class logger{
	
	constructor() {
		this._user   = null;
		this._passwd = null;
		this._dbname = "gameDatabase";
		this._host   = host || "localhost";
		this._port   = port || 27017;
		this._db = null;
	}

	/*
	Connects to the database.
	@param callback {function} called when the connection completes.
	Takes an error parameter.
	*/
	connect(callback){
		MongoClient.connect("mongodb://" + this._host + ":" + this._port + "/" + this._dbname, function(err, db){
			if(err){
				console.log("ERROR: Could not connect to database.");
				this._db = null;
				callback(err);
			}
			else{
				console.log("INFO: Connected to database.");
				this._db = db;
				callback(null);
			}
		});
	}
	
	//Closes the connection to the database
	close(){
		this._db.close();
	}
	
	//Queries the database for all moves relevanet to the gameID and returns them via the callback function
	//Callback function should take two parameters callback(err,data)
	getAllMoves(callback, gameID) {
		var collection = this._db.collection(gameID);
		collection.find({}).toArray(function(err,docs){
			if(err != null){
				callback(err);
			}
			else{
				for(var i=0;i<docs.length;i++){
					delete docs[i]._id;
				}
				callback(null,docs);
			}
		});
    }
	
	//Adds a move to the database.
	//Paramter move is a JSON object that represents the move being made.
	//Parameter callback is the callback function to be called when the query finishes. Takes a single error parameter
    addMove(move, callback, gameID) {
		move._id = (new Date()).getTime();
		move.id = (new Date()).getTime();
		var collection = this._db.collection(gameID);
		collection.insertMany([move], function(err, result){
			if (err != null) {
				callback(err);
			}
			else{
				callback(null)
			}
		});
    }
	

	module.exports = MongoDB;
}
