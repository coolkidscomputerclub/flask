/* Utilities */

var _ = require("underscore");

/* Dependencies */

var mqttjs = require("mqtt"),
    port = 2000;

/* Mqtt namespace */

var mqtt = {

    clients: {},

    init: function () {

        var self = this;

        _.bindAll(this);

        this.mqttServer = mqttjs.createServer(this.bindEvents).listen(port);

        mediator.subscribe("fluid:update", function (data) {

            var packet = {

                topic: "fluid",

                payload: "" + data

            };

            self.broadcast(packet);

        });

    },

    bindEvents: function (client) {

        console.log("Binding MQTT client events.");

        var self = this;

        client.on("connect", function (packet) {

            client.connack({returnCode: 0});

            client.id = packet.client;

            self.clients[client.id] = client;

            // say hi
            client.publish({

                topic: "response",

                payload: "Hi, " + client.id + "!"

            });

            // tell them what state the bottle should be in
            mediator.publish("fluid:update", flask.ledCount);

            mediator.publish("mqtt:joined", {

                topic: "mqtt:joined",

                payload: packet.client + " joined!"

            });

            console.log("MQTT client joined: ", client.id);

        });

        client.on("publish", function (packet) {

            console.log("MQTT publish received: ", client.id, packet.topic, packet.payload);

            if (packet.topic === "cork") {

                mediator.publish("cork:update", packet.payload);

            } else if (packet.topic === "flow") {

                mediator.publish("flow:update", packet.payload);

            } else if (packet.topic === "fluid") {

                self.broadcast(packet);

            }

        });

        client.on("subscribe", function (packet) {

            var granted = [],
                i,
                j;

            for (i = 0, j = packet.subscriptions.length; i < j; i++) {

                granted.push(packet.qos);

            }

            client.suback({granted: granted});

            console.log("Subscribe received: ", packet, granted);

        });

        client.on("pingreq", function (packet) {

            client.pingresp();

        });

        client.on("disconnect", function (packet) {

            client.stream.end();

        });

        client.on("close", function (or) {

            delete self.clients[client.id];

            console.log("MQTT client left: ", client.id);

        });

        client.on("error", function (error) {

            client.stream.end();

            console.log("Error: ", error);

        });

    },

    broadcast: function (packet) {

        for (var i in this.clients) {

            if (this.clients.hasOwnProperty(i)) {

                this.clients[i].publish(packet);

            }

        }

        console.log("MQTT broadcast: ", packet.topic, packet.payload);

    }

};

/* Expose init method */

module.exports = mqtt;