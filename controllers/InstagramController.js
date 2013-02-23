/* # Dependencies & initialize
================================================== */

Instagram = require("instagram-node-lib");

console.log("Instagram Initialized!");

var credentials = {

	clientID: "dcb5bc2a4e1747e8a22b1559a260cd63",
	clientSecret: "6120190cbf914e59914dd615d0f4c5c8",
	callback: "http://3d8v.localtunnel.com/instagram/realtime"

};

Instagram.set("client_id", credentials.clientID);
Instagram.set("client_secret", credentials.clientSecret);
Instagram.set("callback_url", credentials.callback);

var Post = require("../models/post.js");

/* # /instagram: Location-based media search
================================================== */

exports.index = function (req, res) {

	var latitude = 50.381994,
		longitude = -4.138091;

	Instagram.media.search({

		lat: latitude,
		lng: longitude,
		distance: 5000,

		complete: function (data) {

			res.render("instagram_index", {

				title: "Instagram",

				media: data,

				flaskLocation: latitude + ", " + longitude

			});

		}

	});

};

/* # /instagram/realtime: Real-time geo search
================================================== */

exports.subscribe = function (req, res) {

	var latitude = 50.381994,
		longitude = -4.138091,
		radius = 5000;

	Instagram.media.subscribe({

		lat: latitude,
		lng: longitude,
		radius: radius

	});

	console.log("We are subscribing");

	res.send("subscribed");

};

exports.realtime_get = function (req, res) {

	// Keep Instagram happy

	res.send(req.query["hub.challenge"]);

	console.log("subscribed and challenge returned", req.query["hub.challenge"]);

	res.send("realtime");

};

exports.realtime_post = function (req, res) {

	req.body.forEach(function(notification){

		console.log(notification.object_id);

		Instagram.geographies.recent({

			geography_id: notification.object_id,

			complete: function (data) {

				// Get new image

				var imageURL = data[0].images.standard_resolution.url;
				var latitude = data[0].location.latitude;
				var longitude = data[0].location.longitude;

				console.log("New photo posted: ", imageURL);
				console.log("Photo taken at: " + latitude + ", " + longitude);

				// Save to database

				var post = new Post ({

					content: imageURL,

					postType: "photo"

				});

				post.save(function (err) {

					if (err) {

						console.log(err);

					}

					console.log("Photo saved to database!");

				});

			}

		});

	});

	// Prevent hangups

	res.send("Notification recieved");

};

exports.unsubscribe = function (req, res) {

	Instagram.media.unsubscribe_all({ object: "all" });

	res.send("Unsubscribed.");

};








