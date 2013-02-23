/* Dependencies */

var io = require("websocket.io");

/* Websocket namespace */

var websocket = {

    sockets: {},

    init: function (server) {

        var ws = io.attach(server),
            self = this;

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

        ws.on("message", function (message) {

            console.log("Message: ", message.data);

        });

    },

    bindMediatorEvents: function () {

        console.log("WebSocket mediator events bound.");

        mediator.subscribe("websocket:broadcast", this.broadcast);

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

    },

    sayHello: function (socket) {

        socket.send(JSON.stringify("Hello socket!"));

    },

    broadcast: function (data) {

        var i;

        console.log("WebSocket broadcast: ", data);

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
