/* Dependencies */

var io = require("websocket.io");

/* Websocket namespace */

var websocket = {

    sockets: {},

    init: function (server) {

        var ws = io.attach(server),
            self = this;

        mediator.subscribe("websocket:broadcast", function (data) {

            console.log("Socket broadcast: ", data);

            self.broadcast(JSON.stringify(data));

        });

        ws.on("connection", function (socket) {

            var id = self.generateId(5);

            socket.id = id;

            self.sockets[id] = socket;

            self.bindEvents(socket);

            self.sayHello(socket);

            console.log("Someone has connected (ws): ", socket.id);

        });

        ws.on("message", function (message) {

            console.log("Message: ", message.data);

        });

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

    bindEvents: function (socket) {

        var self = this;

        socket.on("close", function () {

            delete self.sockets[socket.id];

            console.log("Socket disconnected: ", socket.id);

        });

    },

    sayHello: function (socket) {

        socket.send(JSON.stringify("Hello socket!"));

    },

    broadcast: function (payload) {

        var self = this;

        for (var i in self.sockets) {

            if (self.sockets.hasOwnProperty(i)) {

                self.sockets[i].send(payload);

            }

        }

    }

};

/* 'return' websocket */

module.exports = websocket;