/* # WiFly
================================================== */

void setupWiFly() {

	WiFly.begin();

    // timer.setTimer(100, doAll, 3);

    if (WiFly.join(ssid)) {

        Serial.println("WiFly connected to " + String(ssid));

    } else {

        Serial.println("Could not connect to " + String(ssid));

        // timer.setTimer(100, flashAll, 3);

        // errorLights();

	}

}

/* # MQTT
================================================== */

void setupPubSub () {

    pubSubRun = true;

    Serial.println("PubSub connecting...");

    if (client.connect("arduinoClient")) {

        Serial.println("PubSub connected.");

        // client.subscribe(subTopic);

    } else {

        Serial.println("PubSub connection failed.");

    }

}

void callback (char* topic, byte* payload, unsigned int length) {

    // Serial.println(topic);

    if (String(topic) == fluidTopic) {

        char payloadChar[length+1];

        for (int i = 0; i < length; i++) {

            payloadChar[i] = payload[i];

        }

        payloadChar[length] = '\0';

        newFluid = atoi(payloadChar);

        Serial.println("Received - " + String(topic) + ": " + newFluid);
        
        // Serial.println("newFluid set to " + String(newFluid));

        fadeBetween(currentFluid, newFluid);

        // Serial.println(thisNewFluid);




    }

}