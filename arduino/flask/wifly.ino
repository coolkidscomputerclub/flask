/* # WiFly
================================================== */

void setupWiFly() {

	WiFly.begin();

	if (WiFly.join(ssid, passphrase)) {

		Serial.println("WiFly connected to " + String(ssid));

	} else {

		Serial.println("Could not connect to " + String(ssid));

	}

}

/* # MQTT
================================================== */
void setupPubSub () {

    Serial.println("PubSub connecting...");

    if (client.connect("arduinoClient")) {

        Serial.println("PubSub connected.");

        client.subscribe(subTopic);

    } else {

        Serial.println("PubSub connection failed.");

    }

}

void callback (char* topic, byte* payload, unsigned int length) {

    if (String(topic) == subTopic) {

        char payloadChar[length+1];

        for (int i = 0; i < length; i++) {

            payloadChar[i] = payload[i];

        }

        payloadChar[length] = '\0';

        Serial.println("Payload received: {topic: " + String(topic) + ", payload: " + payloadChar + "}");

    }

}