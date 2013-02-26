 import processing.serial.*;
 
 Serial myPort;        // The serial port
 int xPos = 1;         // horizontal position of the graph
 
 void setup () {
   // set the window size:
   size(600, 600);        
   
   myPort = new Serial(this, Serial.list()[4], 115200);
   // don't generate a serialEvent() unless you get a newline character:
   myPort.bufferUntil('\n');
   // set inital background:
   background(0);
 }
 void draw () {
   // everything happens in the serialEvent()
   
   
 }
 
void serialEvent (Serial myPort) {
  
  String inString = myPort.readStringUntil('\n');
  
  inString = trim(inString);
  
  String[] vars = split(inString, ',');
  
  println(vars[0] + " " + vars[1] + " " + vars[2]);
  
  if(vars.length == 3) {
    
    float inX = float(vars[0]);
    float inY = float(vars[1]);
    float inZ = float(vars[2]);
    
    inX = inX / 10;
    inY = inY / 10;
    inZ = inZ / 10;
    
    background(0);
    
    stroke(255,0,0);
    
    line(width/2,0,width/2,height);
    line(0,height/2,width,height/2);
    
    stroke(127,34,255);
  
    ellipse((height/2) + inX, (height/2) + inY, 10, 10);
    
    println(inString);
    
  }
  
  
  
}
