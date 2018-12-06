
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

    this.checkIsAllRed = function() {
        var counter = 0;
        for(var i=0; i<this.getCheckCombi().length; i++) {
            if(this.getCheckCombi()[i] == "Red") {
                counter++;
            }
        }
        return counter == 4;
    };
    
    this.whoWon = function(){
        if(this.wrongGuesses == Setup.MAX_ALLOWED_GUESSES && !this.checkIsAllRed()){
            return "A";
        }
        
        if(this.checkIsAllRed()) {
            return "B";
        }
        return null;
    };

    this.updateGame = function() {
        var outgoingMsg = Messages.O_GUESS_OR_CHECK;
        
        if(this.getPlayerType() === "A")
            outgoingMsg.data = this.getCheckCombi();
        else
            outgoingMsg.data = this.getGuessedCombi();

        socket.send(JSON.stringify(outgoingMsg));

        let winner = this.whoWon();

        if (winner != null){
            let alertString;
            if( winner == this.playerType){
                alertString = "Congratulation! You won!";
            }
            else {
                alertString = "Game over. You lost..."
            }
            alertString += "\n <a href='/'>Play again!</a>";
            alert(alertString);

            let finalMsg = Messages.O_GAME_WON_BY;
            finalMsg.data = winner;
            socket.send(JSON.stringify(finalMsg));

            //socket.close();
        }
    };

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

    this.combinationMade = function(lineID) {
        var combiButtons = this.getButtonsByLine(lineID);
        var counter = 0;
        for(var i=0; i<combiButtons.length; i++) {
            if(combiButtons[i].value != "-1" && combiButtons[i].value != "0")
                counter++;
        }
        return counter === 4;
    };

    this.checkReady = function(lineID) {
        if(this.combinationMade(lineID)) {
            this.enableReadyButton();
        }
        else {
            this.disableReadyButton();
        }
    };

    
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

            bol.addEventListener("click", function checkReadyByClick() {
                that.checkReady(lineID);
            });
        });
    };

    this.activateCheckButtons = function(lineID) {
        var colors = ["O", "White", "Red"];
        var buttons = this.getButtonsByLine(lineID);

        Array.from(buttons).forEach( function(bol){
            bol.addEventListener("click", function changeCheckColor(e){
                var clickedButton = e.target;
                if (clickedButton.value === "2")
                    clickedButton.value = "-1";
                clickedButton.innerHTML = colors[++clickedButton.value]
            });

            bol.addEventListener("click", function checkReadyByClick() {
                that.checkReady(lineID);
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
    };

    this.hideTargetWord = function() {
        var combiButtons = this.getButtonsByLine("combination");
        for(var i=0; i<combiButtons.length; i++) {
            combiButtons[i].innerHTML = "?";
        }
    };

    this.setGuessByReady = function() {
        var madeGuess = [];
        var guessButtons = this.getButtonsByLine("line" + gs.getWrongGuesses());
        for(var i=0; i<guessButtons.length; i++) {
            madeGuess.push(guessButtons[i].innerHTML);
        }
        gs.setGuessedCombi(madeGuess);
    };

    this.setGuessedCombiPlayerA = function() {
        var guessCombi = gs.getGuessedCombi();
        var guessButtons = this.getButtonsByLine("line" + gs.getWrongGuesses());
        for(var i=0; i<guessButtons.length; i++) {
            guessButtons[i].innerHTML = guessCombi[i];
        }
    };

    this.setCheckByReady = function() {
        var madeCheck = [];
        var checkButtons = this.getButtonsByLine("check" + gs.getWrongGuesses());
        for(var i=0; i<checkButtons.length; i++) {
            madeCheck.push(checkButtons[i].innerHTML);
        }
        gs.setCheckCombi(madeCheck);
    };

    this.setCheckCombiPlayerB = function() {
        checkCombi = gs.getCheckCombi();
        var checkButtons = this.getButtonsByLine("check" + gs.getWrongGuesses());
        for(var i=0; i<checkButtons.length; i++) {
            checkButtons[i].innerHTML = checkCombi[i];
        }
    };   
}


(function setup() {
    
    var socket = new WebSocket(Setup.WEB_SOCKET_URL);

    var gs = new GameState(socket);
    var board = new PlayBoard(gs);


    socket.onmessage = function (event) {
        let incomingMsg = JSON.parse(event.data);

        console.log(incomingMsg.type + " " + incomingMsg.data + " speler " + gs.getPlayerType());


        if (incomingMsg.type == Messages.T_PLAYER_TYPE) {
            gs.setPlayerType(incomingMsg.data); 
            
            if (gs.getPlayerType() == "A") {
                board.enableButtonsByLine("combination");
                alert("You're the codemaker. Please make a combination");
                board.activateLineButtons("combination");
                
                document.getElementById("readyButton").addEventListener("click", function combiReady(){
                    board.setTargetCombiByReady();
                    board.disableReadyButton();
                    alert("Please wait for the first guess to check");
                    board.disableButtonsByLine("combination");
                    
                    let outgoingMsg = Messages.O_TARGET_COMBI;
                    outgoingMsg.data = gs.getTargetCombi();
                    socket.send(JSON.stringify(outgoingMsg));

                    document.getElementById("readyButton").removeEventListener("click", combiReady, false);
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

            document.getElementById("readyButton").addEventListener("click", function firstGuessReady(){
                board.setGuessByReady();
                board.disableReadyButton();
                alert("Please wait till your guess is checked");
                board.disableButtonsByLine("line"+gs.getWrongGuesses());

                gs.updateGame();
                document.getElementById("readyButton").removeEventListener("click", firstGuessReady, false);
            });
        }

        if(incomingMsg.type == Messages.T_GUESS_OR_CHECK && gs.getPlayerType() == "A") {
            gs.setGuessedCombi(incomingMsg.data);
            gs.incrWrongGuess();
            board.setGuessedCombiPlayerA();
            alert("The guess is made. Please check!");
            board.enableButtonsByLine("check"+gs.getWrongGuesses());
            board.activateCheckButtons("check"+gs.getWrongGuesses());

            document.getElementById("readyButton").addEventListener("click", function checkReady(){
                board.setCheckByReady();
                board.disableReadyButton();
                alert("Please wait till another guess is made");
                board.disableButtonsByLine("check"+gs.getWrongGuesses());
            
                gs.updateGame();
                document.getElementById("readyButton").removeEventListener("click", checkReady, false);
            });
        }
        
        if(incomingMsg.type == Messages.T_GUESS_OR_CHECK && gs.getPlayerType() == "B") {
            gs.setCheckCombi(incomingMsg.data);
            board.setCheckCombiPlayerB();
            alert("The guess is made. Please check!");
            if(gs.incrWrongGuess() < Setup.MAX_ALLOWED_GUESSES) {
                gs.incrWrongGuess();
                board.enableButtonsByLine("line"+gs.getWrongGuesses());
                board.activateLineButtons("line"+gs.getWrongGuesses());

                document.getElementById("readyButton").addEventListener("click", function guessReady(){
                    board.setGuessByReady();
                    board.disableReadyButton();
                    alert("Please wait till your guess is checked");
                    board.disableButtonsByLine("line"+gs.getWrongGuesses());
                    
                    gs.updateGame();
                    document.getElementById("readyButton").removeEventListener("click", guessReady, false);
                });
            }  
        }

        if(incomingMsg.type == Messages.T_GAME_WON_BY && gs.getPlayerType() == "B") {
            if(incomingMsg.data == "B") {
                alertString = "Congratulation! You won!";
            }
            else {
                alertString = "Game over. You lost..."
            }
            alertString += "\n <a href='/'>Play again!</a>";
            alert(alertString);

            socket.close();
        }

    };

    

    socket.onopen = function(){
        socket.send("{}");
    };

    socket.onclose = function(){
        if(gs.whoWon()==null){
           alert("The other player left the game");
        }
    };

    socket.onerror = function(){  
    };
})();