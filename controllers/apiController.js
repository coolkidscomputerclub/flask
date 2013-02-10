/* # Dependencies & initialize
================================================== */

console.log("API Initialized!");

var Post = require("../models/post.js");

/* # Endpoints
================================================== */

exports.index = function (req, res) {

	return Post.find(function (err, posts) {

		if (err) {

			return console.log(err);

		}

		return res.send(posts);

	});

}

exports.show = function (req, res) {

	return Post.find({ postType: req.params.type }, function (err, posts) {

		if (err) {

			return console.log(err);

		}

		return res.send(posts);

	});

}


