/* # Dependencies & initialize
================================================== */

var twitter = require("ntwitter");

console.log("Twitter init");

var credentials = {

	consumerKey: "YGY6Kd2DORZTiK5qIKq4Og",
	consumerSecret: "wP1nHxjQ5gDdM16OB0zeIB8MRvRPoZpF4TKMuei4",
	accessTokenKey: "24029639-GGfEmCUJk6n5yzrunh1EP34HjT8mcNAOLpq9iu260",
	accessTokenSecret: "cC5jhxyPrVT8PXv6MVVi2rIEBeKqvc1duDgUtsZOk"

}

var t = new twitter({

	consumer_key: credentials.consumerKey,
	consumer_secret: credentials.consumerSecret,
	access_token_key: credentials.accessTokenKey,
	access_token_secret: credentials.accessTokenSecret

});

/* # Routes
================================================== */

module.exports = function (app) {

	app.get("/twitter", index);

}

/* # /twitter: Location-based stream
================================================== */

function index (req, res) {

	var locationBounds = "50.371302,-4.133696, 50.367367,-4.153362";

	res.send("Streaming tweets from " + locationBounds);

	t.stream(

		'statuses/filter',

		{
			locations: locationBounds
		},

		function (stream) {

			stream.on('data', function (tweet) {

				console.log(tweet.text);

			});

		}

	);

}
