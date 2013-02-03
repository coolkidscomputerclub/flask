/* # Initialize w / dependencies
================================================== */

Instagram = require("instagram-node-lib");

console.log("Instagram init");

var clientID = "dcb5bc2a4e1747e8a22b1559a260cd63",
	clientSecret = "6120190cbf914e59914dd615d0f4c5c8",
	callback = "http://localhost:8080/callback";

Instagram.set("client_id", 	clientID);
Instagram.set("client_secret", clientSecret);
Instagram.set("callback_url", callback);


/* # Routes
================================================== */

module.exports = function (app) {

	app.get("/instagram", index);

	app.get("/instagram/realtime", realtime);

}

/* # /instagram: Location-based media search
================================================== */

function index (req, res) {

	var latitude = 50.366233;
	var longitude = -4.134134;

	Instagram.media.search({

		lat: latitude,
		lng: longitude,

		complete: function (data) {

			console.log(data);

			res.render("instagram_index", {

				title: "Instagram",

				media: data

			});

		}

	});

}

/* # /instagram/realtime: Real-time geo
================================================== */

function realtime (req, res) {

	var latitude = 50.366233;
	var longitude = -4.134134;
	var radius = 100;

	Instagram.media.subscribe({

		lat: latitude,
		lng: longitude,
		radius: radius,
		callback_url: callback,

		complete: function (data) {

			console.log(data);

		}

	});



}

