void setupRibbon() {
  
	strip.begin();

	strip.show();

	int i, j = 33, x, y = 4;

	for(i = 0; i < j; i++) {

		for(x = 0; x < y; x++) {

			leds[i][x] = 0;

		}

	}
	 
}

void fadeTo(int led, int r, int g, int b){

	int i;

	 

	float rInc, gInc, bInc, steps = 40.0, _r = (float) leds[led][0], _g = (float) leds[led][1], _b = (float) leds[led][2];

	rInc = (r - _r) / steps;
	gInc = (g - _g) / steps;
	bInc = (b - _b) / steps;

	for (i = 0; i < abs(steps); i++) {

		_r += rInc;
		_g += gInc;
		_b += bInc;

		strip.setPixelColor(led - 1, strip.Color(abs(_r), abs(_g), abs(_b)));

		strip.show();

	}

	leds[led][0] = r;
	leds[led][1] = g;
	leds[led][2] = b;
	// leds[led][3] = a;

}

void fadeAll(int r, int g, int b) {
	int led = 1;
	float rInc, gInc, bInc, steps = 40.0, _r = (float) leds[led][0], _g = (float) leds[led][1], _b = (float) leds[led][2];
	int i, j = abs(steps), x;

	rInc = (r - _r) / steps;
	gInc = (g - _g) / steps;
	bInc = (b - _b) / steps;

	for (i = 0; i < j ; i++) {

		_r += rInc;
		_g += gInc;
		_b += bInc;

		for (x = 0; x < currentFluid; x++) {

			strip.setPixelColor(x, strip.Color(abs(_r), abs(_g), abs(_b)));

		}

		strip.show();

	}

	for (i = 1; i < currentFluid + 1; i++) {

		leds[i][0] = r;
		leds[i][1] = g;
		leds[i][2] = b;
		
	}


}

void allOff() {
	int i;

	for(i=0; i<strip.numPixels(); i++) strip.setPixelColor(i, 0);

	strip.show();
		
	// Serial.println("turn off");

}

