#include <SPI.h>
#include <WiFly.h>
#include <PubSubClient.h>
#include <LPD8806.h>
#include <SimpleTimer.h>
#include "credentials.h"

#define CS_PIN      5
#define CLK_PIN     6
#define DIO_PIN     7
#define STATUS_LED  2

#define delayInterval 1000

byte ip[] = {192, 168, 0, 4};

SimpleTimer timer;

WiFlyClient wiFlyClient;
PubSubClient client(ip, 1883, callback, wiFlyClient);

int dataPin  = 2;
int clockPin = 3;
int nLEDs = 32;
LPD8806 strip = LPD8806(nLEDs, dataPin, clockPin);

char* pubTopic = "message";
char* subTopic = "response";

long aX  = 0;
long aY  = 0;
long aZ  = 0;

int ldr = 0;
int ldrPin = A0;

int bottleCirc = 5;
bool corkIn = true;
char corkStatus[2] = {'a', '\0'};

uint32_t red = strip.Color(60, 0, 0);
uint32_t green = strip.Color(0, 60, 0);
uint32_t blue = strip.Color(0, 0, 60);
uint32_t white = strip.Color(60, 60, 60);


/* # Flask
================================================== */

void setup() {

	Serial.begin(115200);

	setupRibbon();

	setupGyro();

	setupWiFly();

	setupPubSub();

	timer.setInterval(100, checkSensors);

}

void loop() {

	// makeChart();

	// doAll(strip.Color(brightness, brightness, brightness));

	// colorWipe(strip.Color(10,   0,   0), 50);  // Red
	// colorWipe(strip.Color(  0, 10,   0), 50);  // Green
	// colorWipe(strip.Color(  0,   0, 10), 50);  // Blue

	// loopStripe(red, blue, 1);

	timer.run();

}

// int theChange, lastAX;

void checkSensors(){

	aX = GetValue(B1000);
	aY = GetValue(B1001);
	aZ = GetValue(B1010);
	// theChange = abs(aX) - abs(lastAX);

	ldr = analogRead(ldrPin);

	// Serial.println("x:" + String(aX) + " y:" + String(aY) + " l:" + String(ldr));	
	// Serial.println(" l:" + String(ldr));	
	// Serial.println(String(lastAX) + " " + aX + " " + theChange);	
	// if (theChange > 500){
	
	// 	Serial.println("shake!");

	// }

	// lastAX = aX;

	putACorkInIt();
	
}

void putACorkInIt() {
	bool corkIsIn;

	if (ldr > 300) {

		corkIsIn = false;

	} else if (ldr < 300) {

		corkIsIn = true;

	}

	if(corkIn != corkIsIn) {

		Serial.println("cork is " + String(corkIsIn));

		corkStatus[0] = corkIsIn;

		pubTopic = "cork";

		client.publish(pubTopic, corkStatus);

		corkIn = corkIsIn;

	}

}
