#include <SPI.h>
#include <WiFly.h>
#include <PubSubClient.h>
#include <LPD8806.h>

#define CS_PIN      5
#define CLK_PIN     6
#define DIO_PIN     7
#define STATUS_LED  2

#define delayInterval 1000

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
int ldrPin = A0;

int ledVal, prevLedVal;

int bottleCirc = 5;

int targetBrightness = 1;
int brightness = 0;

LPD8806 strip = LPD8806(nLEDs, dataPin, clockPin);

uint32_t red = strip.Color(60, 0, 0);
uint32_t green = strip.Color(0, 60, 0);
uint32_t blue = strip.Color(0, 0, 60);
uint32_t white = strip.Color(60, 60, 60);

/* 	


/* # Flask
================================================== */

void setup() {

	Serial.begin(115200);

	setupRibbon();

	// setupGyro();

	// setupLDR();

	// setupWiFly();

	// setupPubSub();

}

void loop() {

	// makeChart();

	getBrightness();

	// doAll(strip.Color(brightness, brightness, brightness));

	colorWipe(strip.Color(60,   0,   0), 50);  // Red
	colorWipe(strip.Color(  0, 60,   0), 50);  // Green
	colorWipe(strip.Color(  0,   0, 60), 50);  // Blue

	// doRing(red,0);
	// doRing(green,1);
	// doRing(blue,2);

	// loopStripe(red, blue, 1);

	// doStripe(red, 0);

	// -------------------

	// sendGyro();

}

void sendGyro(){

	if (sending){

		aX = GetValue(B1000);
		aY = GetValue(B1001);
		aZ = GetValue(B1010);

		Serial.print("X: ");
		Serial.print(aX);
		Serial.print(" Y: ");
		Serial.print(aY);
		Serial.print(" Z: ");
		Serial.println(aZ);

		// Serial.println('X: ' + aX + 'Y: ' + aY + 'Z: ' + aZ);

		// Serial.println("Payload sent: {topic: " + String(pubTopic) + ", payload: " + values + "}");

		// client.publish(pubTopic, values);

		sending = false;

		previousMillis = millis();

	} else {

		if (millis() - previousMillis > delayInterval) {

			sending = true;

		}

	}

}
