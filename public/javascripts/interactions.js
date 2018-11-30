
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

    // this.whoWon = function(){
    //     if( this.wrongGuesses>Setup.MAX_ALLOWED_GUESSES){
    //         return "A";
    //     }

    // /*als guessed combi is equal to target combi */

    //         return "B";
    //     }
    //     return null;
    // };

}


function PlayBoard(GameState) {

    this.enableCombinationButtons = function() {
        var combiLine = document.getElementById("combination");
        for(var i=0; i<combiLine.childNodes.length; i++) {
            combiLine.childNodes[i].disabled = false;
        }
    };

    this.disableCombinationButtons = function() {
        var combiLine = document.getElementById("combination");
        for(var i=0; i<combiLine.childNodes.length; i++) {
            combiLine.childNodes[i].disabled = true;
        }
    };

    this.enableBoardLineButtons = function(guesses) {
        var rightLine = document.getElementById(guesses);
        for(var i=1; i<rightLine.childNodes.length+1; i=i+2) {
            rightLine.childNodes[i].childNodes[0].disabled = false;
        }
    };

    this.disableBoardLineButtons = function(guesses) {
        var rightLine = document.getElementById(guesses);
        for(var i=1; i<rightLine.childNodes.length+1; i=i+2) {
            rightLine.childNodes[i].childNodes[0].disabled = true;
        }
    };

    this.enableReadyButton = function() {
        document.getElementById("readyButton").disabled = false;
    }

    this.disableReadyButton = function() {
        document.getElementById("readyButton").disabled = true;
    }

    this.changeColor = function(lineID) {
        var colors = ["O", "Red", "Green", "Blue", "Yellow", "Purple", "Brown", "Pink", "Orange"];
        if(lineID === "combination") {
            var buttons = document.getElementById(lineID).childNodes;
            Array.from(buttons).forEach( function(bol) {
                bol.addEventListener("click", function clickColor(e) {
                    var clickedButton = e.target;
                    if(clickedButton.value === "8")
                        clickedButton.value = "-1";
                    clickedButton.innerHTML = colors[++clickedButton.value];
                });
            });
        }
        else {
            var buttons = [];
            var rightLine = document.getElementById(lineID);
            for(var i=1; i<rightLine.childNodes.length+1; i=i+2) {
                buttons.push(rightLine.childNodes[i].childNodes[0]);
            }
            Array.from(buttons).forEach( function(bol) {
                bol.addEventListener("click", function clickColor(e) {
                    var clickedButton = e.target;
                    if(clickedButton.value === "8");
                        clickedButton.value = "-1";
                    clickedButton.innerHTML = colors[++clickedButton.value];
                });
            });
        }
    }

    // window.changeColor = function(elemId) {
    //     var colors = ["O", "Red", "Green", "Blue", "Yellow", "Purple", "Brown", "Pink", "Orange"];
    //     var bol = document.getElementById(elemId);
    //     if(bol.value === "8")
    //         bol.value = "-1";
    //     bol.innerHTML = colors[++bol.value];        
    // };

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
                //board.enableCombinationButtons();
                alert("You're the codemaker. Please make a combination")
                //board.changeColor("combination");

                //board.enableBoardLineButtons("1");
                //board.changeColor("1");

            }
            else{
                alert("You're the codebreaker. Please wait for a combination to break")
                // gs.wrongGuesses = gs.wrongGuesses + 3;
                // board.disableBoardLineButtons(gs.wrongGuesses);
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