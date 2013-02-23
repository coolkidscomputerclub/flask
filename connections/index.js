/* Dependencies */

var websocket = require("./websocket"),
    mqtt = require("./mqtt");

/* Connections */

var connections = {

    sockets: {},

    clients: {},

    init: function (server) {

        var self = connections;

        websocket.init(server);

        mqtt.init();

        console.log("Connections initialised.");

        return self;

    }

};

module.exports = connections.init;