var app = {

	content: [],

	flow: 0,

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

		var self = this;

		this.socket.onopen = function () {

			console.log("WebSocket connected.");

			this.send(JSON.stringify("Hello server!"));

		};

		this.socket.onmessage = function (message) {

			var data = JSON.parse(message.data);

			if (data.topic === "flow:update") {

				// data.payload gives values 0, 1 or 2

				self.changeFlow(data.payload);

			} else if (data.topic === "content:update") {

				// data.payload gives obj with type, author, content

				self.content.push(data.payload);

			} else if (data.topic === "content:archive") {

				self.content = data.payload;

			}

			console.log("Data: ", data);

		};

		this.socket.onclose = function () {

			console.log("WebSocket closed.");

		};

	},

	changeFlow: function (flow) {

		this.flow = flow;

		if (this.flow > 0) {

			// start pouring

			this.pouring.start();

		} else {

			// stop pouring

			this.pouring.stop();

		}

	},

	pouring: {

		timeout: null,

		run: function () {

			var self = this;

			if (app.content.length > 0) {

				app.render(app.content.shift());

				this.timeout = setTimeout(function () {

					self.run();

				}, 1000 / app.flow);

			}

		},

		start: function () {

			this.run();

			console.log("Pouring started.");

		},

		stop: function () {

			clearTimeout(this.timeout);

			console.log("Pouring finished.");

		}

	},

	render: function (content) {

		var $container = $("#content"),
			data = {
				topic: "content:consumed",
				payload: null
			},
			$photo,
			$tweet;

		this.socket.send(JSON.stringify(data));

		if (content.type === "photo") {

			$photo = $("<img>", {

				src: "//" + location.host + content.content,
				width: 100,
				height: 100

			});

			$container.append($photo);

		} else if (content.type === "tweet") {

			$tweet = $("<p/>").text("@" + content.author + ": " + content.content);

			$container.append($tweet);

		}

	}

};

app.init();
