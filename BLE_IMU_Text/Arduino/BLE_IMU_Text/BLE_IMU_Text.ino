/*
  Battery Monitor

  This example creates a BLE peripheral with the standard battery service and
  level characteristic. The A0 pin is used to calculate the battery level.

  The circuit:
  - Arduino MKR WiFi 1010, Arduino Uno WiFi Rev2 board, Arduino Nano 33 IoT,
    Arduino Nano 33 BLE, or Arduino Nano 33 BLE Sense board.

  You can use a generic BLE central app, like LightBlue (iOS and Android) or
  nRF Connect (Android), to interact with the services and characteristics
  created in this sketch.

  This example code is in the public domain.
*/

#include <ArduinoBLE.h>
#include <Arduino_LSM9DS1.h>

 // BLE Battery Service
BLEService IMUservice("f8c4fc40-e7d3-4e81-b686-9be0160b9b7d");

// BLE Battery Level Characteristic
BLECharacteristic IMUchar("f8c4fc41-e7d3-4e81-b686-9be0160b9b7d", BLERead | BLEWrite | BLENotify | BLEIndicate, 4, true);


long previousMillis = 0;  // last time the battery level was checked, in ms
int counter = 0;

bool LED = false;
float x, y, z;

void setup() {
  Serial.begin(9600);    // initialize serial communication
  //while (!Serial);
  wait_ms(500);
  Serial.println("Serial Started...");

  pinMode(LED_BUILTIN, OUTPUT); // initialize the built-in LED pin to indicate when a central is connected

  if (!IMU.begin()) {
    Serial.println("Failed to initialize IMU!");
    while (1);
  }
  Serial.print("Accelerometer sample rate = ");
  Serial.print(IMU.accelerationSampleRate());
  Serial.println(" Hz");
  
  
  // begin initialization
  if (!BLE.begin()) {
    Serial.println("starting BLE failed!");

    while (1);
  }


  /* Set a local name for the BLE device
     This name will appear in advertising packets
     and can be used by remote devices to identify this BLE device
     The name can be changed but maybe be truncated based on space left in advertisement packet
  */
  BLE.setLocalName("BLE Nano 33");
  BLE.setAdvertisedService(IMUservice); // add the service UUID
  IMUservice.addCharacteristic(IMUchar); // add the battery level characteristic
  BLE.addService(IMUservice); // Add the battery service
  //IMUchar.writeValue(0); // set initial value for this characteristic

  /* Start advertising BLE.  It will start continuously transmitting BLE
     advertising packets and will be visible to remote BLE central devices
     until it receives a new connection */

  // start advertising
  BLE.advertise();

  Serial.println("Bluetooth device active, waiting for connections...");
}

void loop() {
  // wait for a BLE central
  BLEDevice central = BLE.central();

  // if a central is connected to the peripheral:
  if (central) {
    Serial.print("Connected to central: ");
    // print the central's BT address:
    Serial.println(central.address());
    // turn on the LED to indicate the connection:
    digitalWrite(LED_BUILTIN, HIGH);

    // check the battery level every 200ms
    // while the central is connected:
    while (central.connected()) {
      long currentMillis = millis();
      // if 200ms have passed, check the battery level:
      if (currentMillis - previousMillis >= 100) {
        previousMillis = currentMillis;
        updateChar();
        digitalWrite(LED_BUILTIN, toggleLED());
      }
    }
    // when the central disconnects, turn off the LED:
    digitalWrite(LED_BUILTIN, LOW);
    Serial.print("Disconnected from central: ");
    Serial.println(central.address());
  }
}

void updateChar() {
  /* Read the current voltage level on the A0 analog input pin.
     This is used here to simulate the charge level of a battery.
  */
  readIMU();
  //int batteryLevel = map(battery, 0, 1023, 0, 100);
  float f = 0.1;
  unsigned char b[] = {2, 4, 8, 3};
  IMUchar.writeValue(b,4);

  
}

void readIMU() {
  if (IMU.accelerationAvailable()) {
    IMU.readAcceleration(x, y, z);

    Serial.print(x);
    Serial.print('\t');
    Serial.print(y);
    Serial.print('\t');
    Serial.println(z);
  }
}

int toggleLED() {
  int LEDint = 0;
  if (LED) LEDint = 1;
  else LEDint = 0;
  LED = !LED;

  return LEDint;
}
