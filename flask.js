var flask = {

    cork: false,

    pouring: false,

    ledCount: 0,

    updateCount: 0,

    ledIncrement: 2,

    sockets: 0,

    init: function () {

        this.bindMediatorEvents();

        return this;

    },

    bindMediatorEvents: function () {

        var self = this;

        mediator.subscribe("content:update", function (data, channel) {

            if (self.cork === false && self.ledCount < 32 && self.pouring === false && self.sockets > 0) {

                self.updateCount++;

                if (self.updateCount === self.ledIncrement) {

                    self.updateCount = 0;

                    self.ledCount++;

                    console.log("ledCount: ", self.ledCount);

                    mediator.publish("fluid:update", self.ledCount);

                }

                mediator.publish("websocket:broadcast", {

                    topic: channel.namespace,

                    payload: data

                });

            }

        });

        mediator.subscribe("flow:update", function (data, channel) {

            if (self.cork === false) {

                if (data > 0) {

                    self.pouring = true;

                } else {

                    self.pouring = false;

                }

                mediator.publish("websocket:broadcast", {

                    topic: channel.namespace,

                    payload: data

                });

            }

        });

        mediator.subscribe("cork:update", function (data) {

            if (data === "0") {

                self.cork = false;

            } else {

                self.cork = true;

            }

            console.log("Cork set: ", data);

        });

        mediator.subscribe("content:consumed", function () {

            if (self.cork === false && self.ledCount >= 0) {

                self.updateCount--;

                if (self.updateCount < 0) {

                    self.updateCount = self.ledIncrement - 1;

                    self.ledCount--;

                    console.log("ledCount: ", self.ledCount);

                    mediator.publish("fluid:update", self.ledCount);

                }

            }

        });

        mediator.subscribe("websocket:joined", function () {

            self.sockets++;

        });

        mediator.subscribe("websocket:left", function () {

            self.sockets--;

        });

    }

};

module.exports = flask;