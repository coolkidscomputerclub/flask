/* Utilities */

var _ = require("underscore");

/* Dependencies */

var mqttjs = require("mqttjs"),
    port = 1883;

/* Mqtt namespace */

var mqtt = {

    clients: {},

    init: function () {

        _.bindAll(this);

        this.mqttServer = mqttjs.createServer(this.bindEvents).listen(port);

    },

    bindEvents: function (client) {

        console.log("Binding MQTT client events.");

        var self = this;

        client.on("connect", function (packet) {

            client.connack({returnCode: 0});

            client.id = packet.client;

            self.clients[client.id] = client;

            client.publish({

                topic: "response",

                payload: "Hi, " + client.id + "!"

            });

            mediator.subscribe("fluid:update", function (data) {

                var packet = {

                    topic: "fluid",

                    payload: "" + data

                };

                console.log("fluid:update received: ", packet);

                client.publish(packet);

            });

            mediator.publish("mqtt:joined", {

                topic: "mqtt:joined",

                payload: packet.client + " joined!"

            });

            console.log("Client joined: ", client.id);

        });

        client.on("publish", function (packet) {

            console.log("MQTT publish: ", packet);

            if (packet.topic === "cork") {

                mediator.publish("cork:update", packet.payload);

            } else if (packet.topic === "flow") {

                mediator.publish("flow:update", packet.payload);

            }

            // for (var i in self.clients) {

            //     if (self.clients.hasOwnProperty(i)/* && i !== client.id*/) {

            //         self.clients[i].publish({

            //             topic: packet.topic,

            //             payload: packet.payload

            //         });

            //         console.log("Publishing received: ", self.clients[i].id, packet);

            //     }

            // }

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

        });

        client.on("error", function (error) {

            client.stream.end();

            console.log("Error: ", error);

        });

    }

};

/* Expose init method */

module.exports = mqtt;