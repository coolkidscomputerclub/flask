/* # Dependencies
================================================== */

Instagram = require("instagram-node-lib");

console.log("Instagram Initialized!");

var credentials = {
	clientID: "dcb5bc2a4e1747e8a22b1559a260cd63",
	clientSecret: "6120190cbf914e59914dd615d0f4c5c8",
	callback: "http://54b3.localtunnel.com/instagram/realtime"
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

		mediator.subscribe("instagram:post", instagram.geographies);

	},

	geographies: function (notification) {

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

	}

};

instagram.init();

module.exports = instagram;
