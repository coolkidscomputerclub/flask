/* # Dependencies
================================================== */

// ben's credentials

/*var ntwitter = new require("ntwitter")({

	consumer_key: "YGY6Kd2DORZTiK5qIKq4Og",
	consumer_secret: "wP1nHxjQ5gDdM16OB0zeIB8MRvRPoZpF4TKMuei4",
	access_token_key: "24029639-GGfEmCUJk6n5yzrunh1EP34HjT8mcNAOLpq9iu260",
	access_token_secret: "cC5jhxyPrVT8PXv6MVVi2rIEBeKqvc1duDgUtsZOk"

});*/

// saul's credentials

var ntwitter = new require("ntwitter")({

	consumer_key: "lVZLSG3C0TLjRU0Rwt2s3A",
	consumer_secret: "YRohjFVG46BCh5OiGL34nGsoQZ95hNJtCVlgg7uW8",
	access_token_key: "51853963-fXdppsscL8tmtDSG7zGsBSmOaXAyBeMrfWhLioUqm",
	access_token_secret: "81tZJhDSUrWyiDfhK1KrqHdxCbn2BRAvpJKQhyJQ"

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

					if (typeof tweet.user !== "undefined") {

						var post = {
							type: "tweet",
							author: tweet.user.screen_name,
							content: tweet.text
						};

						mediator.publish("content:update", post);

					} else {

						console.log("Problem Tweet: ", tweet);

					}

				});

			}

		);

	}

};

twitter.init();

module.exports = twitter;
