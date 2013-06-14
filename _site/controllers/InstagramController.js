exports.realtime_get = function (req, res) {

	res.send(req.query["hub.challenge"]);

	console.log("subscribed and challenge returned", req.query["hub.challenge"]);

	res.send("realtime");

};

exports.realtime_post = function (req, res) {

	req.body.forEach(function (notification) {

		mediator.publish("instagram:notification", notification);

	});

	// Prevent hangups
	res.send(200, { response: "Thanks Instagram!" });

};

console.log("Instagram Initialized!");
