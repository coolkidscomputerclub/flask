/* # Dependencies & initialize
================================================== */

Instagram = require("instagram-node-lib");

console.log("Instagram init");

var credentials = {

	clientID: "dcb5bc2a4e1747e8a22b1559a260cd63",
	clientSecret: "6120190cbf914e59914dd615d0f4c5c8",
	callback: "http://localhost:8080/instagram/realtime"

}

Instagram.set("client_id", 	credentials.clientID);
Instagram.set("client_secret", credentials.clientSecret);
Instagram.set("callback_url", credentials.callback);

/* # /instagram: Location-based media search
================================================== */

exports.index = function (req, res) {

	var latitude = 50.366233,
		longitude = -4.134134;

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

/* # /instagram/realtime: Real-time geo search
================================================== */

exports.realtime = function (req, res) {

	var latitude = 50.366233,
		longitude = -4.134134,
		radius = 1000

	Instagram.media.subscribe({

		lat: latitude,
		lng: longitude,
		radius: radius

	});

}

