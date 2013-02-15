/* Dependencies */

/* Connections */

var connections = {

    sockets: {},

    clients: {},

    init: function (io, mqtt, port) {

        var self = connections;

        self.io = io;

        io.sockets.on("connection", function (socket) {

            self.sayHello(socket);

            self.bindSocketEvents(socket);

            self.sockets[socket.id] = socket;

        });

        self.mqttServer = mqtt.createServer(self.bindMqttServerEvents).listen(port);

        self.mqttClient = mqtt.createClient(port, "127.0.0.1", self.bindMqttClientEvents);

        console.log("Connections initialized!");

        return self;

    },

    sayHello: function (socket) {

        socket.emit("message", {

            type: "welcome",

            message: "Hello socket!"

        });

    },

    bindSocketEvents: function (socket) {

        var self = connections;

        socket.on("message", function (payload) {

            console.log("Message: ", payload);

        });

        socket.on("disconnect", function (socket) {

            delete self.sockets[socket.id];

            console.log("Socket disconnected: ", socket.id);

        });

    },

    bindMqttServerEvents: function (client) {

        console.log("Binding mqtt server events.");

        var self = connections;

        client.on("connect", function (packet) {

            client.connack({

                returnCode: 0

            });

            client.id = packet.client;

            self.clients[client.id] = client;

            console.log("Client joined: ", client.id);

            if (client.id === "arduinoClient") {

                setTimeout(function () {

                    self.mqttClient.publish({

                        topic: "response",

                        payload: "Hi, Arduino!"

                    });

                }, 1000);

            }

        });

        client.on("publish", function (packet) {

            // publish message to all clients
            for (var i in self.clients) {

                // prevent messages from being sent to the originator
                if (i !== client.id) {

                    console.log("Publishing to: ", self.clients[i].id, packet);

                    self.clients[i].publish({

                        topic: packet.topic,

                        payload: packet.payload

                    });

                }

            }

        });

        client.on("subscribe", function (packet) {

            var granted = [];

            for (var i = 0; i < packet.subscriptions.length; i++) {

                granted.push(packet.subscriptions[i].qos);

            }

            client.suback({granted: granted});

            console.log("Subscribe received: ", packet);

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

            util.log("error!");

        });

    },

    bindMqttClientEvents: function (error, client) {

        console.log("Binding mqtt client events.");

        // connect to the MQTT server running at host on port, tell it we"re "nodeClient"
        client.connect({

            client: "nodeClient"

        });

        client.on("connack", function (packet) {

            if (packet.returnCode === 0) {

                // connected

                client.subscribe("tea");

            } else {

                console.log("connack error %d", packet.returnCode);

                process.exit(-1);

            }

        });

        client.on("publish", function (packet) {

            console.log("Payload received: ", packet.topic, packet.payload);

            connections.io.sockets.emit("data", packet.payload);

        });

        client.on("close", function () {

            process.exit(0);

        });

        client.on("error", function (e) {

            console.log("error %s", e);

            process.exit(-1);

        });

    }

};

module.exports = connections.init;
