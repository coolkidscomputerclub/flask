/* # Dependencies
================================================== */

Instagram = require("instagram-node-lib");

console.log("Instagram Initialized!");

var credentials = {
	clientID: "dcb5bc2a4e1747e8a22b1559a260cd63",
	clientSecret: "6120190cbf914e59914dd615d0f4c5c8",
	callback: "http://3wye.localtunnel.com/instagram/realtime"
};

Instagram.set("client_id", credentials.clientID);
Instagram.set("client_secret", credentials.clientSecret);
Instagram.set("callback_url", credentials.callback);

/* # Initialize
================================================== */

var instagram = {

	init: function () {

		Instagram.media.subscribe({

			lat: 50.381994,
			lng: -4.138091,
			radius: 5000

		});

		console.log("Subscribing...");

		mediator.subscribe("instagram:notification", instagram.geographies);

	},

	geographies: function (notification) {

		// console.log(notification.object_id);

		Instagram.geographies.recent({

			geography_id: notification.object_id,

			complete: function (data) {

				var imageURL = data[0].images.standard_resolution.url,
					username = data[0].user.username,
					latitude = data[0].location.latitude,
					longitude = data[0].location.longitude;

				console.log("New photo posted: ", imageURL);
				console.log("Photo taken at: " + latitude + ", " + longitude);

				mediator.publish("instagram:post", {
					type: "photo",
					author: username,
					content: imageURL
				});

			}

		});

	}

};

instagram.init();

module.exports = instagram;
