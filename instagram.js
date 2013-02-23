/* # Dependencies
================================================== */

Instagram = require("instagram-node-lib");

console.log("Instagram Initialized!");

var credentials = {
	clientID: "dcb5bc2a4e1747e8a22b1559a260cd63",
	clientSecret: "6120190cbf914e59914dd615d0f4c5c8",
	callback: "http://45dw.localtunnel.com/instagram/realtime"
};

Instagram.set("client_id", credentials.clientID);
Instagram.set("client_secret", credentials.clientSecret);
Instagram.set("callback_url", credentials.callback);

/* # Initialize
================================================== */

var instagram = {

	init: function () {

		locationID = 69922970;

		Instagram.locations.subscribe({

			object_id: locationID,

			complete: function (data) {

				console.log("subscribed successfully");

			},

			error: function (errorMessage, errorObject, caller) {

				console.log("Error Message", errorMessage);
				console.log("This caused it: ", errorObject);
				console.log("This is where it occured: ", caller);

			}

		});

		console.log("Subscribing...");

		mediator.subscribe("instagram:notification", instagram.geographies);

	},

	geographies: function (notification) {

		// console.log(notification.object_id);

		Instagram.locations.recent({

			location_id: notification.object_id,

			complete: function (data) {

				var imageURL = data[0].images.standard_resolution.url,
					username = data[0].user.username,
					latitude = data[0].location.latitude,
					longitude = data[0].location.longitude;

				console.log("New photo posted: ", imageURL);
				console.log("Photo taken at: " + latitude + ", " + longitude);

				var post = {
					type: "photo",
					author: username,
					content: imageURL
				};

				mediator.publish("websocket:broadcast", post);

			},

			error: function (errorMessage, errorObject, caller) {

				console.log("Error Message", errorMessage);
				console.log("This caused it: ", errorObject);
				console.log("This is where it occured: ", caller);

			}

		});

	}

};

instagram.init();

module.exports = instagram;
