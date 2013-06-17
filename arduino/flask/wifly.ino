/* # WiFly
================================================== */

void setupWiFly() {

    Serial.println("Booting WiFly...");

    WiFly.begin();

    Serial.println("Connecting to WiFi: " + String(ssid) + ", " + String(passphrase));

    if (WiFly.join(ssid, passphrase)) {

        Serial.println("WiFly connected to " + String(ssid));

        setupPubSub();

    } else {

        setupWiFly();

        Serial.println("Could not connect to " + String(ssid));

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

        setupPubSub();

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

        fadeBetween(currentFluid, newFluid);

    }

}