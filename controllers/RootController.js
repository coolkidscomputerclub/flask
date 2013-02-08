/* # Routes
================================================== */

var Post = require("../models/post.js");

exports.index = function (req, res) {

	res.render("index", {

		title: "Flask"

	});

}

exports.save = function (req, res) {

	// Save test post to database

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

exports.show = function (req, res) {

	// Show all posts

	Post.find({ postType: req.params.type }, function (err, posts) {

		if (err) {

			console.log("Error displaying posts");

		}

		res.send(posts);

	});

}

exports.count = function (req, res) {

	// Count records

	Post.count({ postType: req.params.type }, function (err, count) {

		if (err) {

			console.log("Couldn't count posts");

		}

		res.send("No. of records matching " + req.params.type + ": " + count);

	});

}


