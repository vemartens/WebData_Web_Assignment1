var express = require("express");
var http = require("http");
var websocket = require("ws");

var cookies = require("cookie-parser");
var cookieSecret = "Thisisacookiestring";

var indexRouter = require("./routes/index");
var messages = require("./public/javascripts/messages");

var gameStatus = require("./statTracker");
var Game = require("./game");

var port = process.argv[2];
var app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(cookies(cookieSecret));

app.get("/", (req, res) => {
    var gameStarted = req.cookies.gameStarted;
    if (gameStarted == undefined){
        gameStarted = 0;
    }
    res.render("splash.ejs",{gamesInitialized: gameStatus.gamesInitialized, 
        gamesCompleted: gameStatus.gamesCompleted, brokenCodes: gameStatus.brokenCodes, gameStarted: gameStarted});
});

//defining cookie
app.get("/play", function(req, res) {
    res.sendFile("game.html", {root: "./public"});
    var userAmount = req.cookies.gameStarted;
    if(userAmount == undefined){
        userAmount = 1;
    }else{
        userAmount++;
    }
    res.cookie("gameStarted", userAmount);
  });

var server = http.createServer(app);
const wss = new websocket.Server({ server });
var websockets = {};

//websocket will be deleted after disconnecting
setInterval(function() {
    for(let i in websockets){
         //if(websockets.hasOwnProperty(i)){
            let gameObj = websockets[i];
            
            //if the gameObj has a final status, the game is complete/aborted
            if(gameObj.gameState=="A" || gameObj.gameState=="B" || gameObj.gameState=="ABORTED"){
                console.log("\tDeleting element "+i);
                delete websockets[i];
            }
       // }
    }
}, 50000);

var currentGame = new Game(); //gameID is equal to the number of game it is
var connectionID = 0;

//start connection
wss.on("connection", function connection(ws) {
    let conn = ws;
    conn.id = connectionID++;
    let playerType = currentGame.addPlayer(conn);
    websockets[conn.id] = currentGame;
    console.log("Player %s placed in game %s as %s", conn.id, currentGame.id, playerType);

    //check whether it is player A or B
    conn.send((playerType == "A") ? messages.S_PLAYER_A : messages.S_PLAYER_B);

    //if player B, send player A that the other player joined
    if(playerType == "B") {
        let msg = messages.O_PLAYER_JOINED;
        currentGame.playerA.send(JSON.stringify(msg));
    }

    //if player B and there is already a target combination set, send it to player B
    if(playerType == "B" && currentGame.getCombi().length!=0){
        let msg = messages.O_TARGET_COMBI;
        msg.data = currentGame.getCombi();
        conn.send(JSON.stringify(msg));
    }

    //when both player A and player B joined, start a new game
    //this new game is for the next two players
    if (currentGame.hasTwoConnectedPlayers()) {
        currentGame = new Game(gameStatus.gamesInitialized++);
    }

    //messages events from and to the connection (websocket)
    conn.on("message", function incoming(message) {
        let oMsg = JSON.parse(message);

        let gameObj = websockets[conn.id];
        console.log(gameObj.gameState);
        let isPlayerA = (gameObj.playerA == conn) ? true : false;

        //if player A and target combi is not set yet, ask player A to do this
        if (isPlayerA && gameObj.getCombi().length==0) {

            if(oMsg.type == messages.T_TARGET_COMBI) {
                gameObj.setCombi(oMsg.data);

                if(gameObj.hasTwoConnectedPlayers()) {
                    gameObj.playerB.send(message);
                }
            }
        }
        else if (isPlayerA) {
        //if player A and target cobination is set, there are two other type of messages player A can receive
            // player A gets the guessed combi of player B and needs to check it
            if(oMsg.type == messages.T_GUESS_OR_CHECK) {
                gameObj.playerB.send(message);
                gameObj.setStatus("GUESS CHECKED");
            }
            
            //game is over, and data tells whether this is A or B
            if(oMsg.type == messages.T_GAME_WON_BY) {
                gameObj.playerB.send(message);
                gameObj.setStatus(oMsg.data);
                gameStatus.gamesCompleted++;

                // if player B won, amount of broken codes will be increased
                if(oMsg.data = "B") {
                    gameStatus.brokenCodes++;
                }
            }
        }
        //else, so if player B send message to server that B has guessed                            
        else {
            if(oMsg.type == messages.T_GUESS_OR_CHECK){
                gameObj.playerA.send(message);
                gameObj.setStatus("COMBI GUESSED");
            }
        }
    });

    //When connectiong is closed 
    conn.on("close", function(code) {
        if(code == "1001") {
            let gameObj = websockets[conn.id];

            //Send aborted to the server                         
            if (gameObj.isValidTransition(gameObj.gameState, "ABORTED")){
                gameObj.setStatus("ABORTED");
                gameStatus.gamesAborted++;                                                                    
            } 

            // try to close A. If not possible, this means A is already closing
            try{
                gameObj.playerA.close();
                
            }
            catch(e){
                console.log("Player A closing: " + e);            
            }

            // try to close B. If not possible, this means B is already closing
            try{
                gameObj.playerB.close();
            }
            catch(e){
                console.log("Player B closing: " + e);
            }              
            gameObj.playerA = null;
            gameObj.playerB = null; 
        }                                           
    });
});

server.listen(port);