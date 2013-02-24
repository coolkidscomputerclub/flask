/* # Dependencies
================================================== */

Instagram = require("instagram-node-lib");

console.log("Instagram Initialized!");

var credentials = {
	clientID: "dcb5bc2a4e1747e8a22b1559a260cd63",
	clientSecret: "6120190cbf914e59914dd615d0f4c5c8",
	callback: "http://4ti2.localtunnel.com/instagram/realtime"
};

Instagram.set("client_id", credentials.clientID);
Instagram.set("client_secret", credentials.clientSecret);
Instagram.set("callback_url", credentials.callback);

/* # Initialize
================================================== */

var instagram = {

	photos: [],

	init: function () {

		Instagram.media.unsubscribe_all({
			object_id: "all"
		});

		Instagram.subscriptions.list({
			complete: function (subscriptions) {
				console.log("subscriptions: ", subscriptions);
			}
		});

		Instagram.geographies.subscribe({

			lat: 50.381994,

			lng: -4.138091,

			radius: 5000,

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

		_.bindAll(this);

		mediator.subscribe("instagram:notification", instagram.geographies);

	},

	geographies: function (notification) {

		var self = this;

		Instagram.geographies.recent({

			geography_id: notification.object_id,

			complete: function (data) {

				data.forEach(function (item) {

					var photo;

					if (self.photos.indexOf(item.id) === -1) {

						self.photos.push(item.id);

						photo = {
							type: "photo",
							author: item.user.username,
							content: item.images.standard_resolution.url
						};

						mediator.publish("websocket:broadcast", photo);

					}

				});

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
