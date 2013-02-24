/* # Dependencies
================================================== */

var ntwitter = new require("ntwitter")({

	consumer_key: "YGY6Kd2DORZTiK5qIKq4Og",
	consumer_secret: "wP1nHxjQ5gDdM16OB0zeIB8MRvRPoZpF4TKMuei4",
	access_token_key: "24029639-GGfEmCUJk6n5yzrunh1EP34HjT8mcNAOLpq9iu260",
	access_token_secret: "cC5jhxyPrVT8PXv6MVVi2rIEBeKqvc1duDgUtsZOk"

});

/* # Initialize
================================================== */

var twitter = {

	init: function () {

		// Stream tweets
		var plymouth = "-4.151608,50.367216,-4.127404,50.378493";
		var locationBounds = plymouth;

		console.log("***Streaming tweets from:", locationBounds + "***");

		ntwitter.stream(

			'statuses/filter',

			{ locations: locationBounds },

			function (stream) {

				stream.on('data', function (tweet) {

					// Save tweet data
					var post = {
						type: "tweet",
						author: tweet.user.screen_name,
						content: tweet.text
					};

					mediator.publish("websocket:broadcast", post);

				});

			}

		);

	}

};

twitter.init();

module.exports = twitter;
