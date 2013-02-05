#include "LPD8806.h"
#include "SPI.h"

#define CS_PIN      5
#define CLK_PIN     6
#define DIO_PIN     7
#define STATUS_LED  2

int nLEDs = 32;

int dataPin  = 2;
int clockPin = 3;

int ledVal, prevLedVal;

int bottleCirc = 9;

LPD8806 strip = LPD8806(nLEDs, dataPin, clockPin);

uint32_t const red = strip.Color(1, 0, 0);
uint32_t const green = strip.Color(0, 1, 0);
uint32_t const blue = strip.Color(0, 0, 1);


void setup() {
  
	strip.begin();

	strip.show();

	turnItOff();

	Serial.begin(115200);

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

	// makeChart();

	doRing(red,0);
	doRing(green,1);
	doRing(blue,2);


}

void makeChart() {

	ledVal = map(GetValue(B1000), 0, 500, 0, 32);

    delay(50);

	turnItOff();

	if(ledVal != prevLedVal) {

		doChart(ledVal);
	
		Serial.println("ledVal is " + String(ledVal) + " true value is " + String(GetValue(B1000)));
	}

	prevLedVal = ledVal;
	
}

void doStripe(uint32_t c, int offset){

	int i;

	for (i = 0; i < 4; i++) {

		strip.setPixelColor(i * bottleCirc + offset, c);

	}

	strip.show();

}

void loopStripe(uint32_t c) {
	
	int i;

	for (i = 0; i < 9; i++) {

		doStripe(c , i);
		doStripe(strip.Color(0, 0, 255), i-5);
		delay(100);
		turnItOff();

	}

}

void doRing(uint32_t c, int height) {

	int i;

	int fillStart = height * bottleCirc;

	for (i = fillStart; i < fillStart + bottleCirc; i++) {

		strip.setPixelColor(i, c);

	}

	strip.show();

}

void singleColour(uint32_t c,int i) {

	strip.setPixelColor(i, c);

	strip.show();

}

void turnItOff() {
	int i;

	for(i=0; i<strip.numPixels(); i++) strip.setPixelColor(i, 0);

}

void doChart(int theAmount) {
	int i;

	for (i=0; i < theAmount; i++) {
	
		strip.setPixelColor(i, strip.Color(255,   0,   0));

	}

	strip.setPixelColor(theAmount, strip.Color(0,   255,   0));

	strip.show();

}