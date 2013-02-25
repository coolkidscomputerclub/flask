/* Utilities */

var _ = require("underscore");

/* Dependencies */

var io = require("websocket.io");

/* Websocket namespace */

var websocket = {

    sockets: {},

    cork: false,

    ledCount: 0,

    updateCount: 0,

    ledIncrement: 2,

    init: function (server) {

        var ws = io.attach(server),
            self = this;

        console.log("Cork: ", this.cork);

        _.bindAll(this);

        this.bindMediatorEvents();

        ws.on("connection", function (socket) {

            var id = self.generateId(5);

            socket.id = id;

            self.sockets[id] = socket;

            self.bindSocketEvents(socket);

            self.sayHello(socket);

            console.log("Someone has connected (ws): ", socket.id);

        });

    },

    bindMediatorEvents: function () {

        var self = this,
            channels = ["content:update", "flow:update"];

        channels.forEach(function (channel) {

            mediator.subscribe(channel, function (data, channel) {

                if (self.cork === false && self.ledCount < 32) {

                    self.updateCount++;

                    console.log("updateCount/ledIncrement: ", self.updateCount + "/" + self.ledIncrement);

                    if (self.updateCount === self.ledIncrement) {

                        self.updateCount = 0;

                        self.ledCount++;

                        console.log("ledCount: ", self.ledCount);

                        mediator.publish("fluid:update", self.ledCount);

                    }

                    self.broadcast({

                        topic: channel.namespace,

                        payload: data

                    });

                }

            });

        });

        mediator.subscribe("cork:update", function (data) {

            console.log("Cork set: ", data);

            self.cork = (data === "0") ? false : true;

        });

        console.log("WebSocket mediator events bound.");

    },

    generateId: function (length) {

        var id = "",
            possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < length; i++) {

            id += possible.charAt(Math.floor(Math.random() * possible.length));

        }

        if (this.sockets.hasOwnProperty(id) === true) {

            this.generateLabId(length);

        } else {

            return id;

        }

    },

    bindSocketEvents: function (socket) {

        var self = this;

        socket.on("close", function () {

            delete self.sockets[socket.id];

            console.log("Socket disconnected: ", socket.id);

        });

        socket.on("message", function (message) {

            console.log("WebSocket [%s] message received: ", socket.id, message);

        });

    },

    sayHello: function (socket) {

        socket.send(JSON.stringify("Hello socket!"));

    },

    broadcast: function (data) {

        var i;

        // console.log("WebSocket broadcast: ", data);

        data = JSON.stringify(data);

        for (i in this.sockets) {

            if (this.sockets.hasOwnProperty(i)) {

                this.sockets[i].send(data);

            }

        }

    }

};

/* 'return' websocket */

module.exports = websocket;
