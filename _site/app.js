/* # Globals
================================================== */

global.mediator = new require("mediator-js").Mediator();
global.flask = require("./flask").init();

/* # Dependencies & initialize
================================================== */

var express = require("express"),
    http = require("http"),
    path = require("path"),
    helpers = require("./helpers");

/* # App config
================================================== */

var port = 8080,
    app = express(),
    server = http.createServer(app),
    connections = require("./connections")(server),
    instagram = require("./instagram"),
    twitter = require("./twitter");

app.configure(function () {

    app.set("port", process.env.PORT || port);

    app.set("views", __dirname + "/views");

    app.set("view engine", "jade");

    app.use(express.favicon());

    app.use(express.logger("dev"));

    app.use(express.bodyParser());

    app.use(express.methodOverride());

    app.use(app.router);

    app.use(express["static"](path.join(__dirname, "public")));

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
