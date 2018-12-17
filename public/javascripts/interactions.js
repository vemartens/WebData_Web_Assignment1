
function GameState(socket) {
    this.playerType = null;
    this.MAX_ALLOWED = Setup.MAX_ALLOWED_GUESSES;
    this.wrongGuesses = 0;
    this.ready = false;

    this.targetCombi = [];
    this.guessedCombi = [];
    this.checkCombi = [];

    //returns playertype
    this.getPlayerType = function () {
        return this.playerType;
    };

    //sets playertype to p
    this.setPlayerType = function (p) {
        this.playerType = p;
    };

    //returns targetCombi
    this.getTargetCombi = function() {
        return this.targetCombi;
    };

    //sets targetCombi to combi
    this.setTargetCombi = function (combi) {
        this.targetCombi = combi;
    };

    //returns guesedCombi
    this.getGuessedCombi = function() {
        return this.guessedCombi;
    };

    //sets guessedCombi to combi
    this.setGuessedCombi = function(combi) {
        this.guessedCombi = combi;
    };

    //returns checkCombi
    this.getCheckCombi = function() {
        return this.checkCombi;
    };

    //set checkCombi to combi
    this.setCheckCombi = function(combi) {
        this.checkCombi = combi;
    };

    //Increases wrongGuesses by one
    this.incrWrongGuess = function(){
        this.wrongGuesses++;
    };

    //returns wrongGuesses
    this.getWrongGuesses = function() {
        return this.wrongGuesses;
    };

    //returns true if all checkbuttons are red
    this.checkIsAllRed = function() {
        var counter = 0;
        for(var i=0; i<this.getCheckCombi().length; i++) {
            if(this.getCheckCombi()[i] == "red") {
                counter++;
            }
        }
        return counter == 4;
    };
    
    //returns null if no player has won yet. 
    //returns the player who won if someone won 
    this.whoWon = function(){
        if(this.wrongGuesses == Setup.MAX_ALLOWED_GUESSES && !this.checkIsAllRed()){
            return "A";
        }
        
        if(this.checkIsAllRed()) {
            return "B";
        }
        return null;
    };

    //saves the guessed combination or the checked combi. 
    // gives alerts when someone won    
    this.updateGame = function() {
        var outgoingMsg = Messages.O_GUESS_OR_CHECK;
        
        //If A then we set the data from the outgoing message to the checked combi        
        if(this.getPlayerType() === "A")
            outgoingMsg.data = this.getCheckCombi();
        //If B then we set the data from the outgoing message to the guessed combi
        else
            outgoingMsg.data = this.getGuessedCombi();

        socket.send(JSON.stringify(outgoingMsg));

        let winner = null;
        //When A checked the guessed combi then we look if there is a winner                                                                                
        if(this.playerType == "A"){
            winner = this.whoWon();
        }

        //gives a alert when someone won to both of the players
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
        }
    };

}


function PlayBoard(gs) {

    var that = this;
    
    //returns HTML buttons from the line with id lineID
    this.getButtonsByLine = function(lineID) {
        var rightLine = document.getElementById(lineID);
        var buttons = rightLine.getElementsByTagName("circle");
        return buttons;
    };

    //enables the HTML buttons in the line with id lineID
    this.enableButtonsByLine = function(lineID) {
        var buttons = this.getButtonsByLine(lineID);
        for(var i=0; i<buttons.length; i++) {
            buttons[i].setAttribute('disabled', false);
            buttons[i].setAttribute('stroke-width', "3");
        }
    };

    //disables the HTML buttons in the line with id lineID 
    this.disableButtonsByLine = function(lineID) {
        var buttons = this.getButtonsByLine(lineID);
        for(var i=0; i<buttons.length; i++) {
            buttons[i].setAttribute('disabled', true);    
            buttons[i].setAttribute('stroke-width', "1");
        }
    };

    //enables the ready button of the HTML document
    this.enableReadyButton = function() {
        document.getElementById("readyButton").disabled = false;
    };

    //disables the ready button of the HTML document
    this.disableReadyButton = function() {
        document.getElementById("readyButton").disabled = true;
    };

    //checks whether a combination is totally made in the line with id lineID
    //if returns true if all the balls of the combination are filled, and false otherwise
    this.combinationMade = function(lineID) {
        var combiButtons = this.getButtonsByLine(lineID);
        var counter = 0;
        for(var i=0; i<combiButtons.length; i++) {
            if(combiButtons[i].getAttribute("value") != "0" && combiButtons[i].getAttribute("value") != "grey")
                counter++;
        }
        return counter === 4;
    };

    //if combinationMade is true, the ready button of the HTML document is enabled, disabled otherwise
    this.checkReady = function(lineID) {
        if(this.combinationMade(lineID)) {
            this.enableReadyButton();
        }
        else {
            this.disableReadyButton();
        }
    };

    //adds two eventListeners to the HTML buttons of the line with id lineID        
    this.activateLineButtons = function(lineID) {
        var colors = ["grey", "red", "green", "blue", "yellow", "purple", "brown", "pink", "orange"];
        var buttons = this.getButtonsByLine(lineID);
                
        Array.from(buttons).forEach( function(bol) {
            //clicking on one of the buttons changes the color            
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
            
            //by clicking on one of the buttons, there will be checked whether a full combination is made 
            // and thus if the ready button should be disabled or enabled
            bol.addEventListener("click", function checkReadyByClick() {
                that.checkReady(lineID);
            });
        });
    };

    //adds a eventListeners to the HTML check buttons of the line with id lineID    
    this.activateCheckButtons = function(lineID) {
        var colors = ["grey", "white", "red"];
        var buttons = this.getButtonsByLine(lineID);
                
        Array.from(buttons).forEach( function(bol){
            //clicking on one of the buttons changes the color
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
        });        
    };

    //sets the target combination by getting the colors from the HTML document        
    this.setTargetCombiByReady = function() {
        var madeCombi = [];
        var combiButtons = this.getButtonsByLine("combination");
        for(var i=0; i<combiButtons.length; i++) {
            madeCombi.push(combiButtons[i].getAttribute("fill"));
        }
        gs.setTargetCombi(madeCombi);
    };

    //set questionmarks in the target combination that player B sees        
    this.hideTargetWord = function() {
        var combiButtons = this.getButtonsByLine("combination");
        var texts = document.getElementsByTagName("text");
        for(var i=0; i<combiButtons.length; i++) {
            combiButtons[i].setAttribute('fill', 'grey');
            texts[i].textContent = "?";
        }
    };

    //shows the target combination for player B by filling in the balls with the colors of the stored target combination 
    this.showCombi = function(combi) {
        var combiButtons = this.getButtonsByLine("combination");
        var texts = document.getElementsByTagName("text");
        for(var i=0; i<combiButtons.length; i++) {
            combiButtons[i].setAttribute('fill', combi[i]);
            texts[i].textContent = " ";
        }
    };

    //sets the target combination by getting the colors from the HTML document
    this.setGuessByReady = function() {
        var madeGuess = [];
        var guessButtons = this.getButtonsByLine("line" + gs.getWrongGuesses());
        for(var i=0; i<guessButtons.length; i++) {
            madeGuess.push(guessButtons[i].getAttribute('fill'));
        }
        gs.setGuessedCombi(madeGuess);
    };

    //set the colors of the guessed combination at the right places on the board of player A        
    this.setGuessedCombiPlayerA = function() {
        var guessCombi = gs.getGuessedCombi();
        var guessButtons = this.getButtonsByLine("line" + gs.getWrongGuesses());
        for(var i=0; i<guessButtons.length; i++) {
            guessButtons[i].setAttribute("fill", guessCombi[i]);
        }
    };

    //sets the check combination by getting the colors from the HTML document
    this.setCheckByReady = function() {
        var madeCheck = [];
        var checkButtons = this.getButtonsByLine("check" + gs.getWrongGuesses());
        for(var i=0; i<checkButtons.length; i++) {
            madeCheck.push(checkButtons[i].getAttribute("fill"));
        }
        gs.setCheckCombi(madeCheck);
    };

    //set the colors of the check combination at the right places on the board of player B
    this.setCheckCombiPlayerB = function() {
        checkCombi = gs.getCheckCombi();
        var checkButtons = this.getButtonsByLine("check" + gs.getWrongGuesses());
        for(var i=0; i<checkButtons.length; i++) {
            checkButtons[i].setAttribute("fill", checkCombi[i]);
        }
    };

    // enables the player button for the player who's turn it is, thus the button that is disabled
    // and disables the button of the other player, thus the button that is enabled    
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

// client-side of the game
// keeps track of the incoming messages and changes possible interactions for the player within the game
// also sends messages to the server
(function setup() {
    
    var socket = new WebSocket(Setup.WEB_SOCKET_URL);

    var gs = new GameState(socket);
    var board = new PlayBoard(gs);

    // receives messages as long as the socket is not closed and calls certain function depending on which messages is received            
    socket.onmessage = function (event) {
        let incomingMsg = JSON.parse(event.data);

        console.log(incomingMsg.type + " " + incomingMsg.data + " speler " + gs.getPlayerType());

        //If a player opens the game for the first time initialize this player        
        if (incomingMsg.type == Messages.T_PLAYER_TYPE) {
            gs.setPlayerType(incomingMsg.data); 
            
            if (gs.getPlayerType() == "A") {
                //give A a alert that he is the codemaker.                
                board.switchPlayerButtons(gs.getPlayerType());
                board.enableButtonsByLine("combination");
                alert("You're the codemaker. Please make a combination");
                board.activateLineButtons("combination");
                
                //If player A clicks on the ready button then save the target combi and give A alert to wait                                                                
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
            //if player is B then alert B that he has to wait
            else{
                board.switchPlayerButtons("A");
                alert("You're the codebreaker. Please wait for a combination to break")
            }
        }

        //Give the codemaker an alert that the codebreaker has arrived                
        if(incomingMsg.type == Messages.T_PLAYER_JOINED && gs.getPlayerType() == "A") {
            alert("The codebreaker joined the game");
        }

        //If B is going to make the first guess                
        if(incomingMsg.type == Messages.T_TARGET_COMBI && gs.getPlayerType() == "B") {
            //Give B alert that the combination is made and he can start guessing                             
            board.switchPlayerButtons(gs.getPlayerType());
            board.hideTargetWord();
            gs.setTargetCombi(incomingMsg.data);
            alert("The combination is made. Please make a guess!");
            
            //increase the amount of guesses made
            gs.incrWrongGuess();
            board.enableButtonsByLine("line"+gs.getWrongGuesses());
            board.activateLineButtons("line"+gs.getWrongGuesses());
            
            //When B clicks on ready give alert to wait till checked
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

        // If A is going to check the guessed combi                        
        if(incomingMsg.type == Messages.T_GUESS_OR_CHECK && gs.getPlayerType() == "A") {
            //give A alert that a guess is made and he can check             
            board.switchPlayerButtons(gs.getPlayerType());
            gs.setGuessedCombi(incomingMsg.data);
            gs.incrWrongGuess();
            board.setGuessedCombiPlayerA();
            alert("The guess is made. Please check!");
            board.enableButtonsByLine("check"+gs.getWrongGuesses());
            board.activateCheckButtons("check"+gs.getWrongGuesses());
            board.enableReadyButton();
            
            //When A clicks on ready give alert to wait till another guess
            document.getElementById("readyButton").addEventListener("click", function checkReady(){
                //When A clicks on ready give alert to wait for another check
                new Audio("data/pop.wav").play();
                board.setCheckByReady();
                board.disableReadyButton();
                setTimeout(function () {
                    if(!gs.checkIsAllRed() && gs.getWrongGuesses()<Setup.MAX_ALLOWED_GUESSES) {
                        alert("Please wait till another guess is made");
                    }
                }, 500);
                board.disableButtonsByLine("check"+gs.getWrongGuesses());
                board.switchPlayerButtons(gs.getPlayerType());
            
                gs.updateGame();
                document.getElementById("readyButton").removeEventListener("click", checkReady, false);
            });
        }
        
        //If B is going to make a guess, but not for the first time
        if(incomingMsg.type == Messages.T_GUESS_OR_CHECK && gs.getPlayerType() == "B") {
            // give B alert that the guess is checked and that he can make another guess
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
                    //When B clicks on ready give alert to wait
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

        // When B and someone won 
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
    // When a player leaves the games give the other player an alert of this 
    socket.onclose = function(){
        if(gs.whoWon()==null){
           alert("The other player left the game.\nClick on Replay to start a new game");
        }
    };

    socket.onerror = function(){  
    };
})();