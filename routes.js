/* # Imports
================================================== */

var root = require("./controllers/RootController"),
	instagram = require("./controllers/InstagramController"),
	twitter = require("./controllers/TwitterController");

/* # Routes
================================================== */

module.exports = function(app) {

	app.get("/", root.index);

	app.get("/instagram", instagram.index);

	app.get("/instagram/realtime", instagram.realtime);

	app.get("/twitter", twitter.index);

}
