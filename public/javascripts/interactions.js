
function GameState() {
    this.playerType = null;
    this.wrongGuesses = 0;

    //board initializeren
    this.targetCombi = [];


    this.getPlayerType = function () {
        return this.playerType;
    };

    this.setPlayerType = function (p) {
        console.assert(typeof p == "string", "%s: Expecting a string, got a %s", arguments.callee.name, typeof p);
        this.playerType = p;
    };

    this.setTargetCombi = function (combi) {
        console.assert(Array.isArray(combi), "%s: Expecting an array, got a %s", arguments.callee.name, typeof combi);
        this.targetCombi = combi;
    };

    this.incrWrongGuess = function(){
        this.wrongGuesses++;
    };


}

//werkt nog niet
function enableBoardLineButtons(lineID) {

    var lines = document.getElementsByClassName("line");
    var boardLine = lines.getElementByID("lineID");
    for(var i=0; i<boardLine.childNodes.length; i++) {
        var bolletje = boardLine.childNodes[i];
        bolletje.disabled = false;
    }
}

function setUp() {

}