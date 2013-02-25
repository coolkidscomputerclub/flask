/* # Import controllers
================================================== */

var root = require("./controllers/rootController"),
	instagram = require("./controllers/instagramController");

/* # Routes
================================================== */

module.exports = function(app) {

	app.get("/", root.index);

	app.get("/instagram/realtime", instagram.realtime_get);

	app.post("/instagram/realtime", instagram.realtime_post);

};
