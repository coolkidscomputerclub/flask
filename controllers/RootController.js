/* # Twitter credentials
================================================== */

var twitter = require("ntwitter");

console.log("Twitter Initialized!");

var credentials = {
	consumerKey: "YGY6Kd2DORZTiK5qIKq4Og",
	consumerSecret: "wP1nHxjQ5gDdM16OB0zeIB8MRvRPoZpF4TKMuei4",
	accessTokenKey: "24029639-GGfEmCUJk6n5yzrunh1EP34HjT8mcNAOLpq9iu260",
	accessTokenSecret: "cC5jhxyPrVT8PXv6MVVi2rIEBeKqvc1duDgUtsZOk"
};

var t = new twitter({
	consumer_key: credentials.consumerKey,
	consumer_secret: credentials.consumerSecret,
	access_token_key: credentials.accessTokenKey,
	access_token_secret: credentials.accessTokenSecret
});


/* # Entry point
================================================== */

exports.index = function (req, res) {

	// Stream tweets
	var plymouth = "-4.151608,50.367216,-4.127404,50.378493";
	var locationBounds = plymouth;

	console.log("***Streaming tweets from:", locationBounds + "***");

	t.stream(

		'statuses/filter',

		{ locations: locationBounds },

		function (stream) {

			stream.on('data', function (tweet) {

				console.log("@" + tweet.user.screen_name + ": " + tweet.text);

				// Save tweet data
				var post = {
					type: "tweet",
					author: tweet.user.screen_name,
					content: tweet.text
				};

				// Push to Flask
				global.fluid.push(post);

				console.log(global.fluid);

			});

		}

	);

	// Render view
	res.render("index", {
		title: "Flask",
		twitterStatus: locationBounds,
		instagramStatus: false
	});

};
