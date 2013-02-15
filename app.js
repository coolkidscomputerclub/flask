/* # Dependencies & initialize
================================================== */

var express = require("express"),
    db = require("./models/db"),
    mqtt = require("mqttjs"),
    http = require("http"),
    path = require("path"),
    helpers = require("./helpers");

/* # App config
================================================== */

var port = 1883;

var app = express(),
    server = http.createServer(app),
    io = require("socket.io").listen(server, {log: false}),
    connections = require("./connections")(io, mqtt, port);

app.configure(function () {

    app.set("port", process.env.PORT || 8080);

    app.set("views", __dirname + "/views");

    app.set("view engine", "jade");

    app.use(express.favicon());

    app.use(express.logger("dev"));

    app.use(express.bodyParser());

    app.use(express.methodOverride());

    app.use(app.router);

    app.use(express.static(path.join(__dirname, "public")));

});

app.configure("development", function () {

    app.use(express.errorHandler());

});

require("./routes.js")(app);

/* # Go time!
================================================== */

server.listen(app.get("port"), function () {

    console.log("Express server listening on port " + app.get("port"));

});
