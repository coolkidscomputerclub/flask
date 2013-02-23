exports.realtime_get = function (req, res) {

	res.send(req.query["hub.challenge"]);

	console.log("subscribed and challenge returned", req.query["hub.challenge"]);

	res.send("realtime");

};

exports.realtime_post = function (req, res) {

	req.body.forEach(function(notification) {

		mediator.publish("instagram:post", notification);

	});

	// Prevent hangups

	res.send("Notification recieved");

};

/*exports.unsubscribe = function (req, res) {

	Instagram.media.unsubscribe_all({ object: "all" });

	res.send("Unsubscribed.");

};*/

console.log("Instagram Initialized!");
