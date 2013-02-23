void setupRibbon() {
  
	strip.begin();

	strip.show();

	turnItOff();
	 
}


// void makeChart() {

// 	ledVal = map(GetValue(B1000), 0, 500, 0, 32);

//     delay(50);

// 	turnItOff();

// 	if(ledVal != prevLedVal) {

// 		doChart(ledVal);
	
// 		//Serial.println("ledVal is " + String(ledVal) + " true value is " + String(GetValue(B1000)));
// 	}

// 	prevLedVal = ledVal;
	
// }

void doStripe(uint32_t c, int offset){

	int i;

	for (i = 0; i < (nLEDs / bottleCirc) + 1; i++) {

		strip.setPixelColor(i * bottleCirc + offset, c);

	}

	strip.show();

}

void loopStripe(uint32_t c, uint32_t c2, int speed) {
	
	int i;

	for (i = 0; i < bottleCirc; i++) {

		doStripe(c , i);
		doStripe(c2, i - ( bottleCirc/2 ));
		delay(speed * 100);
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

void doAll(uint32_t c) {

	int i;

	for (i = 0; i < nLEDs; i++) {

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
	
		strip.setPixelColor(i, red);

	}

	strip.setPixelColor(theAmount, green);

	strip.show();

}

void colorWipe(uint32_t c, uint8_t wait) {
	int i;

	for (i=0; i < strip.numPixels(); i++) {
		strip.setPixelColor(i, c);
		strip.show();
		delay(wait);
	}

}

void errorLights(){
	int i;

	for (i=0; i < nLEDs; i++) {
	
		strip.setPixelColor(i, red);

	}

	strip.show();

}


