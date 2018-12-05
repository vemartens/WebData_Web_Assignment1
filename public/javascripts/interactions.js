
function GameState(socket) {
    this.playerType = null;
    this.MAX_ALLOWED = Setup.MAX_ALLOWED_GUESSES;
    this.wrongGuesses = 0;
    this.ready = false;

    this.targetCombi = [];
    this.guessedCombi = [];
    this.checkCombi = [];

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

    this.setTargetCombi = function (combi) {
        console.assert(Array.isArray(combi), "%s: Expecting an array, got a %s", arguments.callee.name, typeof combi);
        this.targetCombi = combi;
    };

    this.getGuessedCombi = function() {
        return this.guessedCombi;
    }

    this.setGuessedCombi = function(combi) {
        console.assert(Array.isArray(combi), "%s: Expecting an array, got a %s", arguments.callee.name, typeof combi);
        this.guessedCombi = combi;
    }

    this.getCheckCombi = function() {
        return this.checkCombi;
    }

    this.setCheckCombi = function(combi) {
        console.assert(Array.isArray(combi), "%s: Expecting an array, got a %s", arguments.callee.name, typeof combi);
        this.checkCombi = combi;
    }

    this.incrWrongGuess = function(){
        this.wrongGuesses++;
    };

    this.getWrongGuesses = function() {
        return this.wrongGuesses;
    }

/*~*/
    this.updateGame = function() {
        var outgoingMsg = Messages.O_GUESS_OR_CHECK; //Messages.O_MAKE_A_GUESS;
        if(this.getPlayerType() == "A")
            outgoingMsg.data = this.getCheckCombi();
        else
            outgoingMsg.data = this.getGuessedCombi();
        

        socket.send(JSON.stringify(outgoingMsg));
        alert("er is iets gebeurd joepie");

    }
    
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

    var that = this;
    
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

    this.setTargetCombiByReady = function() {
        var madeCombi = [];
        var combiButtons = this.getButtonsByLine("combination");
        for(var i=0; i<combiButtons.length; i++) {
            madeCombi.push(combiButtons[i].innerHTML);
        }
        gs.setTargetCombi(madeCombi);
        // }
        // else {
        //     alert("You did not fill all the spaces of the combination")
        // } 
    };

    this.hideTargetWord = function() {
        var combiButtons = this.getButtonsByLine("combination");
        for(var i=0; i<combiButtons.length; i++) {
            combiButtons[i].innerHTML = "?";
        }
    }

    this.setGuessByReady = function() {
        var madeGuess = [];
        var guessButtons = this.getButtonsByLine("line" + gs.getWrongGuesses());
        for(var i=0; i<guessButtons.length; i++) {
            madeGuess.push(guessButtons[i].innerHTML);
        }
        gs.setGuessedCombi(madeGuess);
    };

    this.setGuessedCombiPlayerA = function() {
        guessCombi = gs.getGuessedCombi();
        var guessButtons = this.getButtonsByLine("line" + gs.getWrongGuesses());
        for(var i=0; i<guessButtons.length; i++) {
            guessButtons[i].innerHTML = guessCombi[i];
        }
    }

    this.setCheckByReady = function() {
        var madeCheck = [];
        var checkButtons = this.getButtonsByLine("check" + gs.getWrongGuesses());
        for(var i=0; i<guessButtons.length; i++) {
            madeCheck.push(checkButtons[i].innerHTML);
        }
        gs.setCheckCombi(madeCheck);
    };

    this.setCheckedCombiPlayerB = function() {
        checkCombi = gs.getCheckedCombi();
        var checkButtons = this.getButtonsByLine("check" + gs.getWrongGuesses());
        for(var i=0; i<checkButtons.length; i++) {
            checkButtons[i].innerHTML = checkCombi[i];
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
                board.enableButtonsByLine("combination");
                alert("You're the codemaker. Please make a combination");
                board.activateLineButtons("combination");
                
                document.getElementById("readyButton").addEventListener("click", function(){
                    board.setTargetCombiByReady();
                    document.getElementById("readyButton").disabled = true;
                    alert("Please wait for the first combination to check");
                    board.disableButtonsByLine("combination");
                    let outgoingMsg = Messages.O_TARGET_COMBI;
                    outgoingMsg.data = gs.getTargetCombi();
                    socket.send(JSON.stringify(outgoingMsg));

                    //document.getElementById("readyButton").removeEventListener("click", singleClick, false);
                });
            }
            else{
                alert("You're the codebreaker. Please wait for a combination to break")
            }
        }

        if(incomingMsg.type == Messages.T_TARGET_COMBI && gs.getPlayerType() == "B") {
            board.hideTargetWord();
            gs.setTargetCombi(incomingMsg.data);
            alert("The combination is made. Please make a guess!");
            gs.incrWrongGuess();
            board.enableButtonsByLine("line"+gs.getWrongGuesses());
            board.activateLineButtons("line"+gs.getWrongGuesses());

            document.getElementById("readyButton").addEventListener("click", function(){
                board.setGuessByReady();
                document.getElementById("readyButton").disabled = true;
                alert("Please wait till your guess is checked");
                board.disableButtonsByLine("line"+gs.getWrongGuesses());
                
                // let outgoingMsg = Messages.O_CHECK_RESULT;
                // outgoingMsg.data = gs.getGuessedCombi();
                // socket.send(JSON.stringify(outgoingMsg));

            /*~*/
                gs.updateGame();
            });
        }

        // if(incomingMsg.type == Messages.T_CHECK_RESULT && gs.getPlayerType == "A") {
        //     gs.setGuessedCombi(incomingMsg.data);
        //     board.setGuessedCombiPlayerA();
        //     alert("The guess is made. Please check!");
        //     gs.incrWrongGuess();
        //     board.enableButtonsByLine("check"+gs.getWrongGuesses());
        //     board.activeCheckButtons("check"+gs.getWrongGuesses());

        //     document.getElementById("readyButton").addEventListener("click", function(){
        //         board.setCheckByReady();
        //         document.getElementById("readyButton").disabled = true;
        //         alert("Please wait till another guess is made");
        //         board.disableButtonsByLine("check"+gs.getWrongGuesses());
                
        //         let outgoingMsg = Messages.O_MAKE_A_GUESS;
        //         outgoingMsg.data = gs.getCheckCombi();
        //         socket.send(JSON.stringify(outgoingMsg));
        //     });
        // }
                                            /*~*/
        // if(incomingMsg.type == Messages.T_GUESS_OR_CHECK && gs.getPlayerType() == "B") {
        //     gs.setCheckedCombi(incomingMsg.data);
        //     board.setCheckedCombiPlayerB();
        //     alert("The guess is made. Please check!");
        //     gs.incrWrongGuess();
        //     board.enableButtonsByLine("check"+gs.getWrongGuesses());
        //     board.activeGuessedButtons("check"+gs.getWrongGuesses());

        //     document.getElementById("readyButton").addEventListener("click", function(){
        //         board.setGuessByReady();
        //         document.getElementById("readyButton").disabled = true;
        //         alert("Please wait till your guess is checked");
        //         board.disableButtonsByLine("line"+gs.getWrongGuesses());
                
        //         // let outgoingMsg = Messages.O_CHECK_RESULT;
        //         // outgoingMsg.data = gs.getGuessedCombi();
        //         // socket.send(JSON.stringify(outgoingMsg));

        //     /*~*/
        //         gs.updateGame();
        //     });
        // }


    /*~*/
        if(incomingMsg.type == Messages.T_GUESS_OR_CHECK && gs.getPlayerType() == "A") {
            alert("hoi");
            // gs.setGuessedCombi(incomingMsg.data);
            // board.setGuessedCombiPlayerA();
            // alert("The guess is made. Please check!");
            // gs.incrWrongGuess();
            // board.enableButtonsByLine("check"+gs.getWrongGuesses());
            // board.activeCheckButtons("check"+gs.getWrongGuesses());

            // document.getElementById("readyButton").addEventListener("click", function(){
            //     board.setCheckByReady();
            //     document.getElementById("readyButton").disabled = true;
            //     alert("Please wait till another guess is made");
            //     board.disableButtonsByLine("check"+gs.getWrongGuesses());
            
            //     //gs.updateGame();
            // });
            gs.updateGame();
        }
                    
    };

    socket.onopen = function(){
        socket.send("{}");
    };

    // socket.onclose = function(){
    //     if(gs.whoWon()==null){
    //        //sb.setStatus(Status["aborted"]);
    //     }
    // };

    socket.onerror = function(){  
    };
})();