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

	res.render("index", {
		title: "Flask"
	});

};
