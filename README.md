# CSE1500 Web assignments 1, 2 and 3     
**Board game: Mastermind**  

Made by: Floor Straver and Vera Martens  
CSE group: CSE1 65

For the server-side:  
[Game.js](https://github.com/vemartens/WebData_Web_Assignment1/blob/master/game.js) - keeps track of the transitions that happen in the game  
[App.js](https://github.com/vemartens/WebData_Web_Assignment1/blob/master/app.js) - the application, among other things sending messages to clients  
[statTracker.js](https://github.com/vemartens/WebData_Web_Assignment1/blob/master/statTracker.js) - contains statistics like how many games are played etc.  

For the client-side:  
[config.js](https://github.com/vemartens/WebData_Web_Assignment1/blob/master/public/javascripts/config.js) - contains the MAX_ALLOWED_GUESSES, which should be 10 (or lower) but not higher, and the WEB_SOCKET_URL
[interactions.js](https://github.com/vemartens/WebData_Web_Assignment1/blob/master/public/javascripts/interactions.js) - contains all the interactions between the clients with the game and the server  
[instruction.js](https://github.com/vemartens/WebData_Web_Assignment1/blob/master/public/javascripts/instruction.js) - contains the instructions of the game  
[messages.js](https://github.com/vemartens/WebData_Web_Assignment1/blob/master/public/javascripts/messages.js) - messages that clients can receive from the server and send back  

HTML files:  
[splash.html](https://github.com/vemartens/WebData_Web_Assignment1/blob/master/public/splash.html) - splash screen of the game   
(also see  [splash.ejs](https://github.com/vemartens/WebData_Web_Assignment1/blob/master/views/splash.ejs)  in the views)  
[game.html](https://github.com/vemartens/WebData_Web_Assignment1/blob/master/public/game.html) - game interface of the game  

CSS files:   
[style.css](https://github.com/vemartens/WebData_Web_Assignment1/blob/master/public/stylesheets/style.css) - shared CSS styling for the splash and game screen  
[splash.css](https://github.com/vemartens/WebData_Web_Assignment1/blob/master/public/stylesheets/splash.css) - the CSS styling of the splash-screen  
[game.css](https://github.com/vemartens/WebData_Web_Assignment1/blob/master/public/stylesheets/game.css) - the CSS styling for the game screen   

