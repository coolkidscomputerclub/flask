/* # Routes
================================================== */

var Post = require("../models/post.js");

// Home
exports.index = function (req, res) {

	res.render("index", {

		title: "Flask"

	});

}

// Save a test record with specified type
exports.save = function (req, res) {

	var post = new Post ({

		content: "http://distilleryimage7.s3.amazonaws.com/ac74c78610b011e292a022000a1e8849_7.jpg",
		postType: req.params.type

	});

	post.save(function (err) {

		if (err) {

			console.log("Error saving post");

		}

		res.send("Post successfully saved with type:" + req.params.type);

	});

}

// Show all records matching specified type
exports.show = function (req, res) {

	Post.find({ postType: req.params.type }, function (err, posts) {

		if (err) {

			console.log("Error displaying posts");

		}

		res.send(posts);

	});

}

// Return count of records matching specified type
exports.count = function (req, res) {

	Post.count({ postType: req.params.type }, function (err, count) {

		if (err) {

			console.log("Couldn't count posts");

		}

		res.send("No. of records matching " + req.params.type + ": " + count);

	});

}


