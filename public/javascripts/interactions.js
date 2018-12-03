
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

    this.getTargetCombi = function() {
        return this.targetCombi;
    }

    this.setTargetCombi = function () {
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


function PlayBoard(gs) {

    this.getButtonsByLine = function(lineID) {
        var rightLine = document.getElementById(lineID);
        buttons = rightLine.getElementsByTagName("button");
        return buttons;
    };

    this.enableButtonsByLine = function(lineID) {
        var buttons = this.getButtonsByLine(lineID);
        for(var i=0; i<buttons.length; i++) {
            buttons[i].disabled = false;
        }
    };

    this.disableButtonsByLine = function(lineID) {
        var buttons = this.getButtonsByLine(lineID);
        for(var i=0; i<buttons.length; i++) {
            buttons[i].disabled = true;
        }
    };

    this.enableReadyButton = function() {
        document.getElementById("readyButton").disabled = false;
    };

    this.disableReadyButton = function() {
        document.getElementById("readyButton").disabled = true;
    };

/* checkt of de 4 vakjes van combination al ingevuld zijn 
maar weet nog steeds niet waar ik dat zou moeten aanroepen en wanneer */
/* het staat nu in changecolor... maar zou anders moeten kunnen i guess */

    // this.combinationMade = function() {
    //     var combiButtons = this.getButtonsByLine("combination");
    //     var counter = 0;
    //     for(var i=0; i<combiButtons.length; i++) {
    //         if(combiButtons[i].value != "-1" && combiButtons[i].value != "0")
    //             counter++;
    //     }
    //     return counter === 4;
    // };

/* probeerde te checken of alles ingevuld was en dan ready enable
dit staat nu allemaal soort van in changecolor....... */

    // this.checkReady = function() {
    //     if(this.combinationMade()) {
    //         this.enableReadyButton();
    //     }
    // };

    
    this.activateLineButtons = function(lineID) {
        var colors = ["O", "Red", "Green", "Blue", "Yellow", "Purple", "Brown", "Pink", "Orange"];
        var buttons = this.getButtonsByLine(lineID);
        
        Array.from(buttons).forEach( function(bol) {
            bol.addEventListener("click", function changeColor(e) {
                var clickedButton = e.target;
                if(clickedButton.value === "8")
                    clickedButton.value = "-1";
                clickedButton.innerHTML = colors[++clickedButton.value];
            });

    //deze eventListener maakt ready button enabled als 4 plekken is ingevuld
    //en anders disable weer (als je na cycle weer op O komt)
    //niet netjes hier,maar kon geen andere manier vinden
    // bol.onclick = function(event) {
    //     checkReady();
    // }
            bol.addEventListener("click", function checkReady() {
                var counter = 0;
                for(var i=0; i<buttons.length; i++) {
                    if(buttons[i].value != "-1" && buttons[i].value != "0")
                        counter++;
                }
                if(counter === 4)
                    document.getElementById("readyButton").disabled = false;
                else
                    document.getElementById("readyButton").disabled = true;
            });
        });
    };

    this.activeCheckButtons = function(lineID) {
        var colors = ["O", "White", "Red"];
        var buttons = this.getButtonsByLine(lineID);
        console.log

        Array.from(buttons).forEach( function(bol){
            bol.addEventListener("click", function changeCheckColor(e){
                var clickedButton = e.target;
                if (clickedButton.value === "2")
                    clickedButton.value = "-1";
                clickedButton.innerHTML = colors[++clickedButton.value]
            });

            bol.addEventListener("click", function checkReady() {
                var counter = 0;
                for(var i=0; i<buttons.length; i++) {
                    if(buttons[i].value != "-1" && buttons[i].value != "0")
                        counter++;
                }
                if(counter === 4)
                    document.getElementById("readyButton").disabled = false;
                else
                    document.getElementById("readyButton").disabled = true;
            });
        });        
    };

/*probeerde iets te schrijven dat combi opsloeg als er 4 dingen ingevuld zijn
als je op ready hebt geklikt, en anders zegt dat je het moet invullen;*/

    this.setTargetCombiByReady = function() {
        var madeCombi = [];
        var readyButton = document.getElementById("readyButton");
        if(readyButton.disabled) {
            var combiButtons = this.getButtonsByLine("combination").getElementsByTagName("buttons");
            for(var i=0; i<combiButtons.length; i++) {
                madeCombi.push(combiButtons[i].innerHTML);
            }
            readyButton.addEventListener("click", function singleClick() {
            //moet eigenlijk bij klikken op ready..
            });
            gs.setTargetCombi(madeCombi);
        }   
        // }
        // else {
        //     alert("You did not fill all the spaces of the combination")
        // } 
    };
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
                console.log("hoi")
                board.enableButtonsByLine("combination");
                alert("You're the codemaker. Please make a combination");
                board.activateLineButtons("combination");

                board.enableButtonsByLine("check10");
                board.activeCheckButtons("check10");

                // var butties = board.getButtonsByLine("combination").getElementsByTagName("button");
                // for(var i=0; i<butties.length; i++) {
                //     butties[i].onclick = board.changeColor();
                // }
                //board.disableReadyButton();
                //document.getElementById("readyButton").onclick = board.setTargetCombiByReady();
                //board.setTargetCombiByReady();
                

                //board.disableButtonsByLine("line1");
                //board.changeColor("line1");
            }
            else{
                alert("You're the codebreaker. Please wait for a combination to break")
                // gs.wrongGuesses = gs.wrongGuesses + 3;
                // board.enableBoardLineButtons("line"+gs.wrongGuesses);
            }
        }

        if(incomingMsg.type == Messages.T_TARGET_WORD && gs.getPlayerType == "B") {
            
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