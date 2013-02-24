/* # Dependencies & Initialisation
================================================== */

var twitter = new require("ntwitter")({

	consumer_key: "YGY6Kd2DORZTiK5qIKq4Og",
	consumer_secret: "wP1nHxjQ5gDdM16OB0zeIB8MRvRPoZpF4TKMuei4",
	access_token_key: "24029639-GGfEmCUJk6n5yzrunh1EP34HjT8mcNAOLpq9iu260",
	access_token_secret: "cC5jhxyPrVT8PXv6MVVi2rIEBeKqvc1duDgUtsZOk"

});

/* # /twitter: Location-based stream
================================================== */

exports.index = function (req, res) {

	var plymouth = "-4.151608,50.367216,-4.127404,50.378493";

	var locationBounds = plymouth;

	//res.send("Streaming tweets from: " + locationBounds);

	console.log("***Streaming tweets from:", locationBounds + "***");

	twitter.stream(

		'statuses/filter',

		{
			locations: locationBounds
		},

		function (stream) {

			stream.on('data', function (tweet) {

				// console.log("@" + tweet.user.screen_name + ": " + tweet.text);

			});

		}

	);

};

console.log("Twitter Initialized!");
