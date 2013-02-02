#include <SPI.h>
#include <WiFly.h>
#include <PubSubClient.h>

#define CS_PIN      5
#define CLK_PIN     6
#define DIO_PIN     7
#define STATUS_LED  2

byte ip[] = {192, 168, 0, 4};

WiFlyClient wiFlyClient;
PubSubClient client(ip, 1883, callback, wiFlyClient);

char* pubTopic = "message";
char* subTopic = "response";

#include "credentials.h"

String strValues = "";
int strLength = 0;

int aX  = 0;
int aY  = 0;
int aZ  = 0;


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

/* # Accelerometer Functions
================================================== */

void StartBit() {

	pinMode(DIO_PIN, OUTPUT);

	digitalWrite(CS_PIN,  LOW);
	digitalWrite(CLK_PIN, LOW);

	delayMicroseconds(1);

	digitalWrite(DIO_PIN, HIGH);
	digitalWrite(CLK_PIN, HIGH);

	delayMicroseconds(1);

}

void ShiftOutNibble(byte DataOutNibble) {

	for(int i = 3; i >= 0; i--) {

		digitalWrite(CLK_PIN, LOW);

		if ((DataOutNibble & (1 << i)) == (1 << i)) {  // DataOutNibble AND 1 x 2^i Equals 1 x 2^i ?

			digitalWrite(DIO_PIN, HIGH);

		} else {

			digitalWrite(DIO_PIN, LOW);

		}

		// with CLK rising edge the chip reads the DIO from arduino in
		digitalWrite(CLK_PIN, HIGH);

		// data rate is f_clk 2.0 Mhz --> 0,5 micro seeconds
		delayMicroseconds(1); // :-) just nothing

	}

}

void SampleIt() {

	digitalWrite(CLK_PIN, LOW);

	delayMicroseconds(1);

	digitalWrite(CLK_PIN, HIGH);

	delayMicroseconds(1);

	pinMode(DIO_PIN, INPUT);

	digitalWrite(CLK_PIN, LOW);

	delayMicroseconds(1);

	digitalWrite(CLK_PIN, HIGH);

}

byte ShiftInNibble() {

	byte resultNibble;

	resultNibble = 0;

	for(int i = 3 ; i >= 0; i--) { // from bit 3 to 0

		// The chip Shift out results on falling CLK
		digitalWrite(CLK_PIN, LOW);

		delayMicroseconds(1); // :-) just nothing

		if( digitalRead(DIO_PIN) == HIGH) { // BIT set or not?

			resultNibble += 1 << i; // Store 1 x 2^i in our ResultNibble

		} else {

			resultNibble += 0 << i; // YES this is alway 0, just for symetry ;-)

		}

		digitalWrite(CLK_PIN, HIGH);

	}

	return resultNibble;

}

void EndBit() {

	digitalWrite(CS_PIN, HIGH);
	digitalWrite(CLK_PIN, HIGH);

}

int GetValue(byte Command) { // x = B1000, y = B1001, z = B1010

	int Result = 0;

	StartBit();

	ShiftOutNibble(Command);

	SampleIt();

	Result =  2048 - ((ShiftInNibble() << 8) + (ShiftInNibble() << 4) + ShiftInNibble());

	EndBit();

	return Result;

}


/* # Flask
================================================== */

void setup() {

	Serial.begin(115200);

	// Give the serial some time...

	setupWiFly();

	setupPubSub();

	pinMode(CS_PIN,  OUTPUT);
	pinMode(CLK_PIN, OUTPUT);
	pinMode(DIO_PIN, OUTPUT);

	digitalWrite(CS_PIN, LOW);
	digitalWrite(CLK_PIN,LOW);

	delayMicroseconds(1);

	digitalWrite(CS_PIN, HIGH);
	digitalWrite(CLK_PIN,HIGH);

}

void loop() {

	strValues = "";

	strValues = strValues + GetValue(B1000);
	strValues = strValues + "," + GetValue(B1001);
	strValues = strValues + "," + GetValue(B1010);

	// aX = GetValue(B1000);
	// aY = GetValue(B1001);
	// aZ = GetValue(B1010);

	// values[0] = aX;
	// values[1] = aY;
	// values[2] = aZ;
	// values[3] = '\0';

	Serial.println("X: " + strValues);

	strLength = strValues.length();

	char values[strLength + 1];

	for (int i = 0; i < strLength; i++) {

		values[i] = strValues.charAt(i);

	}

	values[strLength] = '\0';

	Serial.println("Payload sent: {topic: " + String(pubTopic) + ", payload: " + values + "}");

	client.publish(pubTopic, values);

	delay(200);

}
