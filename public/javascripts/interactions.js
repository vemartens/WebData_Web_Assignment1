
function GameState(socket) {
    this.playerType = null;
    this.MAX_ALLOWED = Setup.MAX_ALLOWED_GUESSES;
    this.wrongGuesses = 0;
    this.ready = false;

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


function PlayBoard(GameState) {

    this.enableBoardLineButtons = function(guesses) {
        var rightLine = document.getElementById(guesses);
        for(var i=0; i<rightLine.childNodes.length; i++) {
            var bolletje = rightLine.childNodes[i];
            bolletje.disabled = false;
        }
        //rightLine.childNodes[1].childNodes[0].disabled = false
        
        
        
        // Array.from(elements).forEach(function(el) {
        //     if(el.id === wrongGuesses) {
        //         var rightLine = document.getElementById(el.id);
        //         for(var i=0; i<rightLine.childNodes.length; i++) {
        //             var bolletje = rightLine.childNodes[i];
        //             bolletje.disabled = false;
        //         }
                
        //     }

        //  });
    };

    window.changeColor = function(elemId) {
        var colors = ["O", "Red", "Green", "Blue", "Yellow", "Purple", "Brown", "Pink", "Orange"];
        var bol = document.getElementById(elemId);
        if(bol.value === "8")
            bol.value = "-1";
        bol.innerHTML = colors[++bol.value];        
    };

    window.enableBoardLineButtons = function(lineID) {

        var lines = document.getElementsByClassName("line");
        var boardLine = lines.getElementByID(lineID);
        for(var i=0; i<boardLine.childNodes.length; i++) {
            var bolletje = boardLine.childNodes[i];
            bolletje.disabled = false;
        }
    }


}



(function setup() {
    
    var socket = new WebSocket(Setup.WEB_SOCKET_URL);

    var gs = new GameState(socket);
    var board = new PlayBoard(gs);

    socket.onmessage = function (event) {
        let incomingMsg = JSON.parse(event.data);

        if (incomingMsg.type == Messages.T_PLAYER_TYPE) {
            gs.setPlayerType(incomingMsg.data); 
            
            if (gs.getPlayerType() == "A") {
                //comb knoppen enable
                alert("You're the codemaker. Please make a combination")
                gs.wrongGuesses = gs.wrongGuesses + 3;
                board.enableBoardLineButtons(gs.wrongGuesses);
            }
            else{
                alert("You're the codebreaker. Please wait for a combination to break")
            }
        }

    }

    socket.onopen = function(){
        socket.send("{}");
    };

    socket.onclose = function(){
        if(gs.whoWon()==null){
           // sb.setStatus(Status["aborted"]);
        }
    };

    socket.onerror = function(){  
    };
})();