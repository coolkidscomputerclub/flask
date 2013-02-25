var app = {

	init: function () {

		if (Modernizr.websockets === true) {

			console.log("WebSockets enabled!");

			this.setupSocket();

		} else {

			console.log("WebSockets not enabled!");

		}

	},

	setupSocket: function () {

		this.socket = new WebSocket("ws://" + location.host);

		this.bindSocketEvents();

	},

	bindSocketEvents: function () {

		this.socket.onopen = function () {

			console.log("WebSocket connected.");

			this.send(JSON.stringify("Hello server!"));

		};

		this.socket.onmessage = function (message) {

			var data = JSON.parse(message.data);

			if (data.topic === "flow:update") {

				// data.payload gives values 0, 1 or 2

			} else if (data.topic === "content:update") {

				// data.payload gives obj with type, author, content

				if (data.payload.type === "photo") {

					var $photo = $("<img>", {

						src: "//" + location.host + data.payload.content,
						width: 100,
						height: 100

					});

					$("#content").append($photo);

				} else if (data.payload.type === "tweet") {

					var $tweet = $("<span/>").text("@" + data.payload.author);

					$("#content").append($tweet);

				}

			}

			console.log("Data: ", data);

		};

		this.socket.onclose = function () {

			console.log("WebSocket closed.");

		};

	}

};

app.init();
