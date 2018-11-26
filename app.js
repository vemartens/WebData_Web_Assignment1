var express = require("express");
var http = require("http");

var indexRouter = require("./routes/index");

var port = process.argv[2];
var app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
http.createServer(app).listen(port);

// app.get("/", (req, res) => {
//     res.render("splash.ejs")}
// );

app.get("/", indexRouter);
app.get("/play", indexRouter);