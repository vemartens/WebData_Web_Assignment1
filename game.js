
var game = function(gameID) {
    this.playerA = null;
    this.playerB = null;
    this.id = gameID;
    this.combiToGuess = [];      //first player to join the game will set the combination
    this.gameState = "0 JOINED"; //different states are defined below
}

game.prototype.transitionStates = {};
game.prototype.transitionStates["0 JOINED"] = 0;
game.prototype.transitionStates["1 JOINED"] = 1;
game.prototype.transitionStates["2 JOINED"] = 2;
game.prototype.transitionStates["COMBI GUESSED"] = 3;
game.prototype.transitionStates["GUESS CHECKED"] = 4;
game.prototype.transitionStates["A"] = 5; //A won
game.prototype.transitionStates["B"] = 6; //B won
game.prototype.transitionStates["ABORTED"] = 7;

//transition matrix, with a 1 for the valid transitions
//valid is: 0-1, 1-0, 1-2, 2-3, 2-7, 3-4, 3-7, 4-3, 4-5, 4-6, 4-7
game.prototype.transitionMatrix = [
    [0, 1, 0, 0, 0, 0, 0, 0],   //0 JOINED
    [1, 0, 1, 0, 0, 0, 0, 0],   //1 JOINED
    [0, 0, 0, 1, 0, 0, 0, 1],   //2 JOINED
    [0, 0, 0, 0, 1, 0, 0, 1],   //COMBI GUESSED
    [0, 0, 0, 1, 0, 1, 1, 1],   //GUESS CHECKED
    [0, 0, 0, 0, 0, 0, 0, 0],   //A WON
    [0, 0, 0, 0, 0, 0, 0, 0],   //B WON
    [0, 0, 0, 0, 0, 0, 0, 0]    //ABORTED
];

//returns whether a certain transition is valid
game.prototype.isValidTransition = function(from, to) {
    //If the message from is not a valid transitionstate, there is no transition possible
    let i, j;
    if (! (from in game.prototype.transitionStates)) {
        return false;
    }
    // set i by the number associating with the transitionstate from
    else {
        i = game.prototype.transitionStates[from];
    }

    //If the message to is not a valid transitionstate there is no transition possible
    if (!(to in game.prototype.transitionStates)) {
        return false;
    }
    // Set j by the number associating with the transitionstate to
    else {
        j = game.prototype.transitionStates[to];
    }
    //If there is a transition possible between from and to return true    
    return (game.prototype.transitionMatrix[i][j] > 0);
};

//returns true if the transitionstate s is a valid transitionstate
game.prototype.isValidState = function (s) {
    return (s in game.prototype.transitionStates);
};

//sets the status by w if it is a valid transitionstate
game.prototype.setStatus = function (w) {
    if (game.prototype.isValidState(w) && game.prototype.isValidTransition(this.gameState, w)) {
        this.gameState = w;
        console.log("[STATUS] %s", this.gameState);
    }
    else {
        return new Error("Impossible status change from %s to %s", this.gameState, w);
    }
};

//returns an error if the gamestate is not valid to make a combi
//initialize combination, when there is no error
game.prototype.setCombi = function (combi) {
    //two possible options for the current game state:
    //1 JOINED, 2 JOINED
    if (this.gameState != "1 JOINED" && this.gameState != "2 JOINED") {
        return new Error("Trying to set combination, but game status is %s", this.gameState);
    }
    this.combiToGuess = combi;
};

//returns the target combination
game.prototype.getCombi = function(){
    return this.combiToGuess;
};

//returns whether there are two players connected. True if so, false otherwise
game.prototype.hasTwoConnectedPlayers = function () {
    return (this.gameState == "2 JOINED");
};

//returns the name of the player that joined
//gives error if there are already two players 
game.prototype.addPlayer = function (p) {

    if (this.gameState != "0 JOINED" && this.gameState != "1 JOINED") {
        return new Error("Invalid call to addPlayer, current state is %s", this.gameState);
    }

    var error = this.setStatus("1 JOINED");
    if(error instanceof Error){
        this.setStatus("2 JOINED");
    }

    if (this.playerA == null) {
        this.playerA = p;
        return "A";
    }
    else {
        this.playerB = p;
        return "B";
    }
};

module.exports = game;