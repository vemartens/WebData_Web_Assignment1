
(function(exports) {

     /* Client to server: game is complete, the winner is ...
      */
    exports.T_GAME_WON_BY = "GAME-WON-BY";             
    exports.O_GAME_WON_BY = {
        type: exports.T_GAME_WON_BY,
        data: null
    };


    /* Server to client: abort game (e.g. if a player exited the game) 
     */
    exports.O_GAME_ABORTED = {                          
        type: "GAME-ABORTED"
    };
    exports.S_GAME_ABORTED = JSON.stringify(exports.O_GAME_ABORTED);


    /* Server to client: set as player A 
     */
    exports.T_PLAYER_TYPE = "PLAYER-TYPE";
    exports.O_PLAYER_A = {                            
        type: exports.T_PLAYER_TYPE,
        data: "A"
    };
    exports.S_PLAYER_A = JSON.stringify(exports.O_PLAYER_A);


    /* Server to client: set as player B 
     */
    exports.O_PLAYER_B = {                            
        type: exports.T_PLAYER_TYPE,
        data: "B"
    };
    exports.S_PLAYER_B = JSON.stringify(exports.O_PLAYER_B);

    
    exports.T_PLAYER_JOINED = "OTHER-PLAYER-JOINED";
    exports.O_PLAYER_JOINED = {
        type: exports.T_PLAYER_JOINED,
        data: null
    };

    /* Player A to server OR server to Player B: this is the target combination 
     */
    exports.T_TARGET_COMBI = "SET-TARGET-COMBI";
    exports.O_TARGET_COMBI = {                         
        type: exports.T_TARGET_COMBI,
        data: null
    };

    exports.T_GUESS_OR_CHECK = "SET-GUESS-OR-CHECK";
    exports.O_GUESS_OR_CHECK = {
        type: exports.T_GUESS_OR_CHECK,
        data: null
    };



    /* Server to Player A & B: game over with result won/loss 
     */
    exports.T_GAME_OVER = "GAME-OVER";              
    exports.O_GAME_OVER = {
        type: exports.T_GAME_OVER,
        data: null
    };


}(typeof exports === "undefined" ? this.Messages = {} : exports));