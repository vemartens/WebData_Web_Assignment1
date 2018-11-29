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
//http.createServer(app).listen(port);

// app.get("/", (req, res) => {
//     res.render("splash.ejs")}
// );

app.get("/", indexRouter);
app.get("/play", indexRouter);

var server = http.createServer(app);
const wss = new websocket.Server({ server });
var websockets = {};

/*snap ik nog niet */

// setInterval(function() {
//     for(let i in websockets){
//         if(websockets.hasOwnProperty(i)){
//             let gameObj = websockets[i];
            
//             //if the gameObj has a final status, the game is complete/aborted
//             if(gameObj.finalStatus!=null){
//                 console.log("\tDeleting element "+i);
//                 delete websockets[i];
//             }
//         }
//     }
// }, 50000);

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
        con.send(JSON.stringify(msg));
    }

    
    if (currentGame.hasTwoConnectedPlayers()) {
        currentGame = new Game(gameStatus.gamesInitialized++);

    }
});

server.listen(port);