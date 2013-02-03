/* # Dependencies & initialize
================================================== */

Instagram = require("instagram-node-lib");

console.log("Instagram init");

var credentials = {

	clientID: "dcb5bc2a4e1747e8a22b1559a260cd63",
	clientSecret: "6120190cbf914e59914dd615d0f4c5c8",
	callback: "http://localhost:8080/callback"

}

Instagram.set("client_id", 	credentials.clientID);
Instagram.set("client_secret", credentials.clientSecret);
Instagram.set("callback_url", credentials.callback);


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

				media: data,

				flaskLocation: latitude + ", " + longitude

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

		object: "geography",
		lat: latitude,
		lng: longitude,
		radius: radius,
		callback_url: callback,
		type: "subscription"

	});

}

