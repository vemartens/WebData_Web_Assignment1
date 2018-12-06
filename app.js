var express = require("express");
var http = require("http");
var websocket = require("ws");

var indexRouter = require("./routes/index");
var messages = require("./public/javascripts/messages");

var gameStatus = require("./statTracker");
var Game = require("./game");

var port = process.argv[2];
var app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// app.get("/", (req, res) => {
//     res.render("splash.ejs")}
// );

app.get("/", indexRouter);
app.get("/play", indexRouter);

var server = http.createServer(app);
const wss = new websocket.Server({ server });
var websockets = {};

/*snap ik nog niet */

setInterval(function() {
    for(let i in websockets){
        if(websockets.hasOwnProperty(i)){
            let gameObj = websockets[i];
            
            //if the gameObj has a final status, the game is complete/aborted
            if(gameObj.gamestate=="A" || gameObj.gamestate=="B" || gameObj.gamestate=="ABORTED"){
                console.log("\tDeleting element "+i);
                delete websockets[i];
            }
        }
    }
}, 50000);

var currentGame = new Game(gameStatus.gamesInitialized++); //gameID is gelijk aan hoeveelste game het is
var connectionID = 0;

wss.on("connection", function connection(ws) {
    let conn = ws;
    conn.id = connectionID++;
    let playerType = currentGame.addPlayer(conn);
    websockets[conn.id] = currentGame;
    console.log("Player %s placed in game %s as %s", conn.id, currentGame.id, playerType);

    conn.send((playerType == "A") ? messages.S_PLAYER_A : messages.S_PLAYER_B);

    if(playerType == "B" && currentGame.getCombi().length!=0){
        let msg = messages.O_TARGET_COMBI;
        msg.data = currentGame.getCombi();
        conn.send(JSON.stringify(msg));
    }
    
    if (currentGame.hasTwoConnectedPlayers()) {
        currentGame = new Game(gameStatus.gamesInitialized++);
    }

    conn.on("message", function incoming(message) {
        let oMsg = JSON.parse(message);

        let gameObj = websockets[conn.id];
        let isPlayerA = (gameObj.playerA == conn) ? true : false;

        if (isPlayerA && gameObj.getCombi().length==0) {

            if(oMsg.type == messages.T_TARGET_COMBI) {
                gameObj.setCombi(oMsg.data);

                if(gameObj.hasTwoConnectedPlayers()) {
                    gameObj.playerB.send(message);
                }
            }
        }
        else if (isPlayerA) {

            if(oMsg.type == messages.T_GUESS_OR_CHECK) {
                gameObj.playerB.send(message);
                gameObj.setStatus("GUESS CHECKED");
            }
            
            console.log("er is een winnaar")
            if(oMsg.type == messages.T_GAME_WON_BY) {
                console.log("in if statement");
                gameObj.playerB.send(message);
                console.log("bericht verzonden");
                gameObj.setStatus(oMsg.data);
                gameStatus.gamesCompleted++;
            }
        }
        else {
            if(oMsg.type == messages.T_GUESS_OR_CHECK){
                gameObj.playerA.send(message);
                gameObj.setStatus("COMBI GUESSED");
            }
        }
    });

    conn.on("close", function(code) {
        
        if(code == "1001") {
            let gameObj = websockets[conn.id];

            if (gameObj.isValidTransition(gameObj.gamestate, "ABORTED")){
                gameObj.setStatus("ABORTED");
                gamesStatus.gamesAborted++;                                                                    
            } 

            try{
                gameObj.playerA.close();
                gameObj.playerB = null;
            }
            catch(e){
                console.log("Player A closing: " + e);            
            }

            try{
                gameObj.playerB.close();
                gameObj.playerA = null;
            }
            catch(e){
                console.log("Player B closing: " + e);
            }           
        }                                           
    });
});

server.listen(port);