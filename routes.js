/* # Import controllers
================================================== */

var root = require("./controllers/rootController"),
	instagram = require("./controllers/instagramController"),
	twitter = require("./controllers/twitterController"),
	api = require("./controllers/apiController");

/* # Routes
================================================== */

module.exports = function(app) {

	app.get("/", root.index);

	app.get("/instagram", instagram.index);

	app.get("/instagram/subscribe", instagram.subscribe);

	app.get("/instagram/realtime", instagram.realtime_get);

	app.post("/instagram/realtime", instagram.realtime_post);

	app.get("/instagram/unsubscribe", instagram.unsubscribe);

	app.get("/twitter", twitter.index);

	app.get("/api", api.index);

	app.get("/api/:type", api.show);

}
