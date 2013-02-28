/* Utilities */

var _ = require("underscore");

/* # Dependencies
================================================== */

var Instagram = require("instagram-node-lib"),
	url = require("url"),
	http = require("http"),
	fs = require("fs");

console.log("Instagram Initialized!");

var baseURL = "http://49cw.localtunnel.com";

var credentials = {
	clientID: "dcb5bc2a4e1747e8a22b1559a260cd63",
	clientSecret: "6120190cbf914e59914dd615d0f4c5c8",
	callback: baseURL + "/instagram/realtime"
};

Instagram.set("client_id", credentials.clientID);
Instagram.set("client_secret", credentials.clientSecret);
Instagram.set("callback_url", credentials.callback);

/* # Initialize
================================================== */

var instagram = {

	photos: [],

	init: function () {

		this.deleteImages();

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

	deleteImages: function () {

		var dir = "public/img/photos/",
			files = fs.readdirSync(dir),
			i,
			j;

		if (files.length > 0) {

			for (i = 0, j = files.length; i < j; i++) {

				var file = dir + '/' + files[i];

				fs.unlinkSync(file);

			}

		}

	},

	geographies: function (notification) {

		var self = this;

		Instagram.geographies.recent({

			geography_id: notification.object_id,

			complete: function (data) {

				data.forEach(function (item) {

					var photo,
						image;

					if (self.photos.indexOf(item.id) === -1) {

						self.photos.push(item.id);

						self.savePhoto(item.images.standard_resolution.url, function (imageUrl) {

							photo = {
								type: "photo",
								author: item.user.username,
								content: imageUrl
							};

							mediator.publish("content:update", photo);

						});

					}

				});

			},

			error: function (errorMessage, errorObject, caller) {

				console.log("Error Message", errorMessage);
				console.log("This caused it: ", errorObject);
				console.log("This is where it occured: ", caller);

			}

		});

	},

	savePhoto: function (photo, callback) {

		var photoUrl = url.parse(photo),
			options = {
				host: photoUrl.hostname,
				path: photoUrl.path,
				method: "GET"
			},
			fileName = "public/img/photos" + photoUrl.path,
			fileUrl = "/img/photos" + photoUrl.path;

		console.log("HTTP request to Instagram: ", options);

		http.request(options, function (res) {

			var imagedata = "";

			res.setEncoding("binary");

			res.on("data", function (chunk) {

				imagedata += chunk;

			});

			res.on("end", function () {

				fs.writeFile(fileName, imagedata, "binary", function (err) {

					if (err) {

						throw err;

					} else {

						console.log("File saved: ", fileName);

						callback(fileUrl);

					}

				});

			});

		}).on("error", function (err) {

			console.log("problem with request: " + err.message);

		}).end();

	}

};

// instagram.init();

module.exports = instagram;
