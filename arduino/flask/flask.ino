#include <SPI.h>
#include <WiFly.h>
#include <PubSubClient.h>
#include <LPD8806.h>

#define CS_PIN      5
#define CLK_PIN     6
#define DIO_PIN     7
#define STATUS_LED  2

#define delayInterval 5000

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

bool sending = true;

unsigned long previousMillis;

/* led */

int nLEDs = 32;

int dataPin  = 2;
int clockPin = 3;

int ledVal, prevLedVal;

int bottleCirc = 5;

LPD8806 strip = LPD8806(nLEDs, dataPin, clockPin);

uint32_t const red = strip.Color(1, 0, 0);
uint32_t const green = strip.Color(0, 1, 0);
uint32_t const blue = strip.Color(0, 0, 1);

/* 	


/* # Flask
================================================== */

void setup() {

	// Give the serial some time...

	setupRibbon();

	setupGyro();

	setupWiFly();

	setupPubSub();

}

void loop() {

	makeChart();

	// doRing(red,0);
	// doRing(green,1);
	// doRing(blue,2);

	// loopStripe(red, blue, 1);

	// doStripe(red, 0);

	// -------------------

	sendGyro();

}

void sendGyro(){

	if (sending){

		strValues = "";

		strValues = strValues + GetValue(B1000);
		strValues = strValues + "," + GetValue(B1001);
		strValues = strValues + "," + GetValue(B1010);

		aX = GetValue(B1000);
		aY = GetValue(B1001);
		aZ = GetValue(B1010);

		Serial.println("X: " + strValues);

		strLength = strValues.length();

		char values[strLength + 1];

		for (int i = 0; i < strLength; i++) {

			values[i] = strValues.charAt(i);

		}

		values[strLength] = '\0';

		Serial.println("Payload sent: {topic: " + String(pubTopic) + ", payload: " + values + "}");

		client.publish(pubTopic, values);

		sending = false;

		previousMillis = millis();

	} else {

		if (millis() - previousMillis > delayInterval) {

			sending = true;

		}

	}

}
