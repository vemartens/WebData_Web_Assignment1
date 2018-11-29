
var game = function(gameID) {
    this.playerA = null;
    this.playerB = null;
    this.id = gameID;
    this.combiToGuess = [];   //first player to join the game will set the combination
    this.gameState = "0 JOINT"; //different states are defined below
}

game.prototype.transitionStates = {};
game.prototype.transitionStates["0 JOINT"] = 0;
game.prototype.transitionStates["1 JOINT"] = 1;
game.prototype.transitionStates["2 JOINT"] = 2;
game.prototype.transitionStates["COMBI GUESSED"] = 3;
game.prototype.transitionStates["GUESS CHECKED"] = 4;
game.prototype.transitionStates["A"] = 5; //A won
game.prototype.transitionStates["B"] = 6; //B won
game.prototype.transitionStates["ABORTED"] = 7;

game.prototype.transitionMatrix = [
    [0, 1, 0, 0, 0, 0, 0, 0],   //0 JOINT
    [1, 0, 1, 0, 0, 0, 0, 0],   //1 JOINT
    [0, 0, 0, 1, 0, 0, 0, 1],   //2 JOINT
    [0, 0, 0, 0, 1, 0, 0, 1],   //COMBI GUESSED
    [0, 0, 0, 1, 0, 1, 1, 1],   //GUESS CHECKED
    [0, 0, 0, 0, 0, 0, 0, 0],   //A WON
    [0, 0, 0, 0, 0, 0, 0, 0],   //B WON
    [0, 0, 0, 0, 0, 0, 0, 0]    //ABORTED

];
//valid is: 0-1, 1-0, 1-2, 2-3, 2-7, 3-4, 3-7, 4-3, 4-5, 4-6, 4-7

game.prototype.isValidTransition = function(from, to) {
    console.assert(typeof from == "string", "%s: Expecting a string, got a %s", arguments.callee.name, typeof from);
    console.assert(typeof to == "string", "%s: Expecting a string, got a %s", arguments.callee.name, typeof to);
    console.assert( from in game.prototype.transitionStates == true, "%s: Expecting %s to be a valid transition state", arguments.callee.name, from);
    console.assert( to in game.prototype.transitionStates == true, "%s: Expecting %s to be a valid transition state", arguments.callee.name, to);

    let i, j;
    if (! (from in game.prototype.transitionStates)) {
        return false;
    }
    else {
        i = game.prototype.transitionStates[from];
    }

    if (!(to in game.prototype.transitionStates)) {
        return false;
    }
    else {
        j = game.prototype.transitionStates[to];
    }
    return (game.prototype.transitionMatrix[i][j] > 0);
};

game.prototype.isValidState = function (s) {
    return (s in game.prototype.transitionStates);
};


game.prototype.setStatus = function (w) {
    console.assert(typeof w == "string", "%s: Expecting a string, got a %s", arguments.callee.name, typeof w);

    if (game.prototype.isValidState(w) && game.prototype.isValidTransition(this.gameState, w)) {
        this.gameState = w;
        console.log("[STATUS] %s", this.gameState);
    }
    else {
        return new Error("Impossible status change from %s to %s", this.gameState, w);
    }
};

game.prototype.setCombi = function (combi) {
    console.assert(Array.isArray(combi), "%s: Expecting an array, got a %s", arguments.callee.name, typeof combi);

    //two possible options for the current game state:
    //1 JOINT, 2 JOINT
    if (this.gameState != "1 JOINT" && this.gameState != "2 JOINT") {
        return new Error("Trying to set word, but game status is %s", this.gameState);
    }
    this.combiToGuess = combi;
};

game.prototype.getCombi = function(){
    return this.combiToGuess;
};

game.prototype.hasTwoConnectedPlayers = function () {
    return (this.gameState == "2 JOINT");
};

game.prototype.addPlayer = function (p) {
    console.assert(p instanceof Object, "%s: Expecting an object (WebSocket), got a %s", arguments.callee.name, typeof p);

    if (this.gameState != "0 JOINT" && this.gameState != "1 JOINT") {
        return new Error("Invalid call to addPlayer, current state is %s", this.gameState);
    }

    var error = this.setStatus("1 JOINT");
    if(error instanceof Error){
        this.setStatus("2 JOINT");
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