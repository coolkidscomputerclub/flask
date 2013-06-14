
/* # Accelerometer
================================================== */

void setupAccel() {

	pinMode(CS_PIN,  OUTPUT);
	pinMode(CLK_PIN, OUTPUT);
	pinMode(DIO_PIN, OUTPUT);

	digitalWrite(CS_PIN, LOW);
	digitalWrite(CLK_PIN,LOW);

	delayMicroseconds(1);

	digitalWrite(CS_PIN, HIGH);
	digitalWrite(CLK_PIN,HIGH);

}

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