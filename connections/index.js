/* Dependencies */

var mediator = new require("mediator-js").Mediator(),
    websocket = require("./websocket"),
    mqtt = require("./mqtt");

/* Make mediator global (pubsub event mediation) */

global.mediator = mediator;

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