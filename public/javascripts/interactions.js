
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
    };

    this.setTargetCombi = function (combi) {
        console.assert(Array.isArray(combi), "%s: Expecting an array, got a %s", arguments.callee.name, typeof combi);
        this.targetCombi = combi;
    };

    this.getGuessedCombi = function() {
        return this.guessedCombi;
    };

    this.setGuessedCombi = function(combi) {
        console.assert(Array.isArray(combi), "%s: Expecting an array, got a %s", arguments.callee.name, typeof combi);
        this.guessedCombi = combi;
    };

    this.getCheckCombi = function() {
        return this.checkCombi;
    };

    this.setCheckCombi = function(combi) {
        console.assert(Array.isArray(combi), "%s: Expecting an array, got a %s", arguments.callee.name, typeof combi);
        this.checkCombi = combi;
    };

    this.incrWrongGuess = function(){
        this.wrongGuesses++;
    };

    this.getWrongGuesses = function() {
        return this.wrongGuesses;
    };

    this.checkIsAllRed = function() {
        var counter = 0;
        for(var i=0; i<this.getCheckCombi().length; i++) {
            if(this.getCheckCombi()[i] == "red") {
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

            document.getElementById("playerA").disabled = true;
            document.getElementById("playerB").disabled = true;

            let finalMsg = Messages.O_GAME_WON_BY;
            finalMsg.data = winner;
            socket.send(JSON.stringify(finalMsg));

            let alertString;
            if( winner == this.playerType){
                alertString = "Congratulation! You won!";
                new Audio("data/yeah.wav").play();
            }
            else {
                alertString = "Game over. You lost..."
                //new Audio("data/poor-baby.wav").play();
            }
            alertString += "\nClick on Replay to start a new game!";
            setTimeout(function () {
                alert(alertString);
            }, 500);

            //socket.close();
        }
    };

}


function PlayBoard(gs) {

    var that = this;
    
    this.getButtonsByLine = function(lineID) {
        var rightLine = document.getElementById(lineID);
        var buttons = rightLine.getElementsByTagName("circle");
        return buttons;
    };

    this.enableButtonsByLine = function(lineID) {
        var buttons = this.getButtonsByLine(lineID);
        for(var i=0; i<buttons.length; i++) {
            // buttons[i].disabled = false;
            buttons[i].setAttribute('disabled', false);
            buttons[i].setAttribute('stroke-width', "3");
        }
    };

    this.disableButtonsByLine = function(lineID) {
        var buttons = this.getButtonsByLine(lineID);
        for(var i=0; i<buttons.length; i++) {
            // buttons[i].disabled = true;
            buttons[i].setAttribute('disabled', true);    
            buttons[i].setAttribute('stroke-width', "1");
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
            if(combiButtons[i].getAttribute("value") != "0" && combiButtons[i].getAttribute("value") != "grey")
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
        var colors = ["grey", "red", "green", "blue", "yellow", "purple", "brown", "pink", "orange"];
        var buttons = this.getButtonsByLine(lineID);
        
        Array.from(buttons).forEach( function(bol) {
            bol.addEventListener("click", function changeColor(e) {
                var clickedButton = e.target;
                if (clickedButton.getAttribute('disabled') === 'true') {
                    return;
                }
                var value = clickedButton.getAttribute("value");
                if(value === "8") {
                    value = "-1";
                }
                value++;
                clickedButton.setAttribute('value', value);
                clickedButton.setAttribute('fill', colors[value]);
            });

            bol.addEventListener("click", function checkReadyByClick() {
                that.checkReady(lineID);
            });
        });
    };

    this.activateCheckButtons = function(lineID) {
        var colors = ["grey", "white", "red"];
        var buttons = this.getButtonsByLine(lineID);

        Array.from(buttons).forEach( function(bol){
            bol.addEventListener("click", function changeCheckColor(e){
                var clickedButton = e.target;
                if (clickedButton.getAttribute('disabled') === 'true') {
                    return;
                }
                var value = clickedButton.getAttribute("value");
                if (value === "2"){
                    value = "-1";
                }
                value++;
                clickedButton.setAttribute('value', value);
                clickedButton.setAttribute("fill", colors[value]);
            });

            // bol.addEventListener("click", function checkReadyByClick() {
            //     that.checkReady(lineID);
            // });
        });        
    };

    this.setTargetCombiByReady = function() {
        var madeCombi = [];
        var combiButtons = this.getButtonsByLine("combination");
        for(var i=0; i<combiButtons.length; i++) {
            madeCombi.push(combiButtons[i].getAttribute("fill"));
        }
        gs.setTargetCombi(madeCombi);
    };

    this.hideTargetWord = function() {
        var combiButtons = this.getButtonsByLine("combination");
        var texts = document.getElementsByTagName("text");
        for(var i=0; i<combiButtons.length; i++) {
            combiButtons[i].setAttribute('fill', 'grey');
            texts[i].textContent = "?";
        }
    };

    this.showCombi = function(combi) {
        var combiButtons = this.getButtonsByLine("combination");
        var texts = document.getElementsByTagName("text");
        for(var i=0; i<combiButtons.length; i++) {
            combiButtons[i].setAttribute('fill', combi[i]);
            texts[i].textContent = " ";
        }
    };

    this.setGuessByReady = function() {
        var madeGuess = [];
        var guessButtons = this.getButtonsByLine("line" + gs.getWrongGuesses());
        for(var i=0; i<guessButtons.length; i++) {
            madeGuess.push(guessButtons[i].getAttribute('fill'));
        }
        gs.setGuessedCombi(madeGuess);
    };

    this.setGuessedCombiPlayerA = function() {
        var guessCombi = gs.getGuessedCombi();
        var guessButtons = this.getButtonsByLine("line" + gs.getWrongGuesses());
        for(var i=0; i<guessButtons.length; i++) {
            guessButtons[i].setAttribute("fill", guessCombi[i]);
        }
    };

    this.setCheckByReady = function() {
        var madeCheck = [];
        var checkButtons = this.getButtonsByLine("check" + gs.getWrongGuesses());
        for(var i=0; i<checkButtons.length; i++) {
            madeCheck.push(checkButtons[i].getAttribute("fill"));
        }
        gs.setCheckCombi(madeCheck);
    };

    this.setCheckCombiPlayerB = function() {
        checkCombi = gs.getCheckCombi();
        var checkButtons = this.getButtonsByLine("check" + gs.getWrongGuesses());
        for(var i=0; i<checkButtons.length; i++) {
            checkButtons[i].setAttribute("fill", checkCombi[i]);
        }
    };

    this.switchPlayerButtons = function(playerID) {
        var playerAButton = document.getElementById("playerA");
        var playerBButton = document.getElementById("playerB");

        if(playerID == "A") {
            if(playerAButton.disabled) {
                playerAButton.disabled = false;
                playerBButton.disabled = true;
            }
            else {
                playerAButton.disabled = true;
                playerBButton.disabled = false;
            }
        }
        else {
            if(playerBButton.disabled) {
                playerAButton.disabled = true;
                playerBButton.disabled = false;
            }
            else {
                playerAButton.disabled = false;
                playerBButton.disabled = true;
            }
        }
    };
}


(function setup() {
    
    var socket = new WebSocket(Setup.WEB_SOCKET_URL);

    var gs = new GameState(socket);
    var board = new PlayBoard(gs);
    // var mySound;


    socket.onmessage = function (event) {
        let incomingMsg = JSON.parse(event.data);

        console.log(incomingMsg.type + " " + incomingMsg.data + " speler " + gs.getPlayerType());


        if (incomingMsg.type == Messages.T_PLAYER_TYPE) {
            gs.setPlayerType(incomingMsg.data); 
            
            if (gs.getPlayerType() == "A") {
                board.switchPlayerButtons(gs.getPlayerType());
                board.enableButtonsByLine("combination");
                alert("You're the codemaker. Please make a combination");
                board.activateLineButtons("combination");
                
                document.getElementById("readyButton").addEventListener("click", function combiReady(){
                    new Audio("data/pop.wav").play();
                    board.setTargetCombiByReady();
                    board.disableReadyButton();
                    setTimeout(function () {
                        alert("Please wait for the first guess to check");
                    }, 500);
                    board.disableButtonsByLine("combination");
                    board.switchPlayerButtons(gs.getPlayerType());
                    
                    let outgoingMsg = Messages.O_TARGET_COMBI;
                    outgoingMsg.data = gs.getTargetCombi();
                    socket.send(JSON.stringify(outgoingMsg));

                    document.getElementById("readyButton").removeEventListener("click", combiReady, false);
                });
            }
            else{
                board.switchPlayerButtons("A");
                alert("You're the codebreaker. Please wait for a combination to break")
            }
        }

        if(incomingMsg.type == Messages.T_PLAYER_JOINED && gs.getPlayerType() == "A") {
            alert("The codebreaker joined the game");
        };

        if(incomingMsg.type == Messages.T_TARGET_COMBI && gs.getPlayerType() == "B") {
            //console.log(gs.getWrongGuesses());
            board.switchPlayerButtons(gs.getPlayerType());
            board.hideTargetWord();
            gs.setTargetCombi(incomingMsg.data);
            alert("The combination is made. Please make a guess!");
            
            gs.incrWrongGuess();
            board.enableButtonsByLine("line"+gs.getWrongGuesses());
            board.activateLineButtons("line"+gs.getWrongGuesses());

            document.getElementById("readyButton").addEventListener("click", function firstGuessReady(){
                new Audio("data/pop.wav").play();
                board.setGuessByReady();
                board.disableReadyButton();
                setTimeout(function () {
                    alert("Please wait till your guess is checked");
                }, 500);
                board.disableButtonsByLine("line"+gs.getWrongGuesses());
                board.switchPlayerButtons(gs.getPlayerType());

                gs.updateGame();
                document.getElementById("readyButton").removeEventListener("click", firstGuessReady, false);
            });
        }

        if(incomingMsg.type == Messages.T_GUESS_OR_CHECK && gs.getPlayerType() == "A") {
            board.switchPlayerButtons(gs.getPlayerType());
            gs.setGuessedCombi(incomingMsg.data);
            gs.incrWrongGuess();
            board.setGuessedCombiPlayerA();
            alert("The guess is made. Please check!");
            board.enableButtonsByLine("check"+gs.getWrongGuesses());
            board.activateCheckButtons("check"+gs.getWrongGuesses());
            board.enableReadyButton();

            document.getElementById("readyButton").addEventListener("click", function checkReady(){
                new Audio("data/pop.wav").play();
                board.setCheckByReady();
                board.disableReadyButton();
                setTimeout(function () {
                    if(!gs.checkIsAllRed()) {
                        alert("Please wait till another guess is made");
                    }
                }, 500);
                board.disableButtonsByLine("check"+gs.getWrongGuesses());
                board.switchPlayerButtons(gs.getPlayerType());
            
                gs.updateGame();
                document.getElementById("readyButton").removeEventListener("click", checkReady, false);
            });
        }
        
        if(incomingMsg.type == Messages.T_GUESS_OR_CHECK && gs.getPlayerType() == "B") {
            board.switchPlayerButtons(gs.getPlayerType());
            gs.setCheckCombi(incomingMsg.data);
            board.setCheckCombiPlayerB();
            if(!gs.checkIsAllRed()) {
                alert("You guess is checked. Please make another guess!");
            }
            if(gs.getWrongGuesses() < Setup.MAX_ALLOWED_GUESSES && gs.whoWon()==null) {
                gs.incrWrongGuess();
                board.enableButtonsByLine("line"+gs.getWrongGuesses());
                board.activateLineButtons("line"+gs.getWrongGuesses());

                document.getElementById("readyButton").addEventListener("click", function guessReady(){
                    new Audio("data/pop.wav").play();
                    board.setGuessByReady();
                    board.disableReadyButton();
                    setTimeout(function () {
                        alert("Please wait till your guess is checked");
                    }, 500);
                    board.disableButtonsByLine("line"+gs.getWrongGuesses());
                    board.switchPlayerButtons(gs.getPlayerType());
                    
                    gs.updateGame();
                    document.getElementById("readyButton").removeEventListener("click", guessReady, false);
                });
            }  
        }

        if(incomingMsg.type == Messages.T_GAME_WON_BY && gs.getPlayerType() == "B") {
            document.getElementById("playerA").disabled = true;
            document.getElementById("playerB").disabled = true;

            if(incomingMsg.data == "B") {
                alertString = "Congratulation! You won!";
                new Audio("data/yeah.wav").play();
            }
            else {
                alertString = "Game over. You lost..."
                //new Audio("data/poor-baby.wav").play();
            }
            alertString += "\nClick on Replay to start a new game!";
            setTimeout(function () {
                alert(alertString);
            }, 500);

            board.showCombi(gs.getTargetCombi());

            socket.close();
        }

    };
    
    socket.onopen = function(){
        socket.send("{}");
    };

    socket.onclose = function(){
        if(gs.whoWon()==null){
           alert("The other player left the game.\n Click on Replay to start a new game");
        }
    };

    socket.onerror = function(){  
    };
})();