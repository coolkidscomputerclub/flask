long ldrLast = 0;
long ldrCurrent = 0;
int ldrDelay = 1000;
int ldrValue = 0;

void getBrightness() {

    ldrCurrent = millis();

    if (ldrCurrent - ldrLast > ldrDelay) {

        ldrLast = ldrCurrent;

        ldrValue = map(analogRead(ldrPin), 0, 1020, 0, 127);

        Serial.println("light = " + String(ldrValue));

        targetBrightness = ldrValue;
        
    }

    if (targetBrightness < 30) {

        brightness = 0;

    } else {

        brightness = 60;

    }

    // brightness = smoothBrightness(brightness, targetBrightness);

}

int smoothBrightness(int current, int target) {

    int increment, smoothed, smoothness = 2;

    increment = (target - current) / smoothness;

    smoothed = current + increment;

    // Serial.println("current: " + String(current) + " target: " + String(target) + " increment: " + increment);

    return smoothed;
}