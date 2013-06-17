#include <SPI.h>
#include <WiFly.h>
#include <PubSubClient.h>
#include <LPD8806.h>
#include <Timer.h>
#include "credentials.h"

#define CS_PIN      5
#define CLK_PIN     6
#define DIO_PIN     7
#define STATUS_LED  2

#define delayInterval 1000

byte ip[] = {198, 211, 120, 181};

Timer t;

WiFlyClient wiFlyClient;
PubSubClient client(ip, 8080, callback, wiFlyClient);

const int dataPin  = 3;
const int clockPin = 4;
const int nLEDs = 32;
LPD8806 strip = LPD8806(nLEDs, dataPin, clockPin);

char* pubTopic = "message";
char* fluidTopic = "fluid";

int aX  = 0;
int aY  = 0;
int aZ  = 0;

int ldr = 0;
int ldrPin = A0;

int bottleCirc = 5;
char flowStatus[2] = "0";

int currentFluid = 0;
int newFluid = 20;

char currentCork[2] = "0";
char newCork[2];

char currentFlow[2] = "0";
char newFlow[2];

int leds[33][4];

bool pubSubRun = false;

// long rand;

uint32_t red = strip.Color(10, 0, 0);


/* # Flask
================================================== */

void setup() {

	Serial.begin(115200);

	setupRibbon();

	setupAccel();

	setupWiFly();

	t.every(100, checkSensors);

	// fadeBetween(currentFluid, newFluid);

	// strip.show();

}

void loop() {

	t.update();

	if (pubSubRun) {

		client.loop();

	} else {

		setupPubSub();

	}

	// delay(3000);

	// client.disconnect();

	// delay(3000);

	// client.connected()

	// if (!client.connected() && pubSubRun) {

	// 	Serial.println("lost connection");

	// 	pubSubRun = false;

	// 	client.disconnect();

	// 	delay(5000);

	// 	setupPubSub();

	// }

}

void fadeBetween(int cPos, int nPos){

	int i;

	if (nPos - cPos > 0) {

		for (i = cPos + 1; i < nPos + 1; i++){

			fadeTo(i, 2, 0, 30);

		}

	} else {

		for (i = cPos; i > nPos; i--){

			fadeTo(i, 0, 0, 0);

		}

	}

	currentFluid = newFluid;

}

void checkSensors () {

	aX = GetValue(B1000);
	aY = GetValue(B1001);
	aZ = GetValue(B1010);
	// theChange = abs(aX) - abs(lastAX);

	ldr = analogRead(ldrPin);

	// Serial.print(aX);
	// Serial.print(",");
	// Serial.print(aY);
	// Serial.print(",");
	// Serial.println(aZ);

	// Serial.println("x:" + String(aX) + " y:" + String(aY) + " l:" + String(ldr));
	// Serial.println(" l:" + String(ldr));
	// Serial.println(String(lastAX) + " " + aX + " " + theChange);
	// if (theChange > 500){

	// 	Serial.println("shake!");

	// }

	// lastAX = aX;

	newCork[0] = ldr > 100 ? '0' : '1';

	if(currentCork[0] != newCork[0]) {

		sendCork();

	}

	// newFlow[0] = aY < 0 ? '1' : '0';

	if(aY < -200) {

		newFlow[0] = '0';

	} else if (aY < 0) {

		newFlow[0] = '1';

	} else {

		newFlow[0] = '2';

	}

	if (currentFlow[0] != newFlow[0]) {

		sendFlow();

	}

}

void sendCork() {

	if (pubSubRun) client.publish("cork", newCork);

	Serial.println("Sent - cork: " + String(newCork));

	// if(newCork[0] == '1') {

	// 	flowStatus[0] = '0';

	// 	client.publish("flow", flowStatus);

	// 	Serial.println("Sent - flow: 0");

	// }

	currentCork[0] = newCork[0];

}

void sendFlow() {

	if (pubSubRun) client.publish("flow", newFlow);

	Serial.println("Sent - flow: " + String(newFlow));

	currentFlow[0] = newFlow[0];

}
