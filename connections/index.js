/* Dependencies */

/* Connections */

var connections = {

    init: function (io) {

        console.log("Connections initialised!");

        io.sockets.on("connection", function (socket) {

            connections.sayHello(socket);

            connections.bindSocketEvents(socket);

        });

        return this;

    },

    sayHello: function (socket) {

        socket.emit("message", {

            type: "welcome",

            message: "Hello socket!"

        });

    },

    bindSocketEvents: function (socket) {

        socket.on("message", function (payload) {

            console.log("Message: ", payload);

        });

    }

};

module.exports = connections.init;