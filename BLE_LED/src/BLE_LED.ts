/**
 * WebBlutooth example for Arduino Nano BLE 33
 *
 * Author: Danial Chitnis
 * December 2019
 *
 * Please upload the sketch before running this code
 */

 let LED = false;
 let bleChar: BluetoothRemoteGATTCharacteristic;

 let btConnect = document.getElementById("btConnect") as HTMLButtonElement;
 let btLED = document.getElementById("btLED") as HTMLButtonElement;

 let pLog = document.getElementById("pLog") as HTMLParagraphElement;


 btConnect.addEventListener("click", () => {


    /**
     * these should match the UUID in your Arduino sketch. you can generate your own UUIDs here:
     * https://www.uuidgenerator.net/
     */
    const serviceUuid = "f8c4fc40-e7d3-4e81-b686-9be0160b9b7d" as BluetoothServiceUUID;
    const characteristicUuid = "f8c4fc41-e7d3-4e81-b686-9be0160b9b7d" as BluetoothCharacteristicUUID;


    // The following code section is based on Chrome example
    // https://googlechrome.github.io/samples/web-bluetooth/characteristic-properties.html
    log("Requesting Bluetooth Device...");
    navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [serviceUuid],
    })
    .then( (device) => {
        log("Connecting to GATT Server...");
        return device.gatt.connect();
    })
    .then( (server) => {
        log("Getting Service...");
        return server.getPrimaryService(serviceUuid);
    })
    .then( (service) => {
        log("Getting Characteristic...");
        return service.getCharacteristic(characteristicUuid);
    })
    .then( (characteristic) => {
        log("> Characteristic UUID:  " + characteristic.uuid);
        log("> Broadcast:            " + characteristic.properties.broadcast);
        log("> Read:                 " + characteristic.properties.read);
        log("> Write w/o response:   " +
        characteristic.properties.writeWithoutResponse);
        log("> Write:                " + characteristic.properties.write);
        log("> Notify:               " + characteristic.properties.notify);
        log("> Indicate:             " + characteristic.properties.indicate);
        log("> Signed Write:         " +
        characteristic.properties.authenticatedSignedWrites);
        log("> Queued Write:         " + characteristic.properties.reliableWrite);
        log("> Writable Auxiliaries: " + characteristic.properties.writableAuxiliaries);

        bleChar = characteristic;
    })
    .catch( (error) => {
        log("Argh! " + error);
    });
 });


 btLED.addEventListener("click", () => {
    bleChar.writeValue( LEDtoBuffer(LED) );
    log(`LED is now ${LED}`);
    LED = !LED;
 });


 function log(str: string) {
    pLog.innerHTML = pLog.innerHTML + "<br>> " + str;
 }

 function LEDtoBuffer(LEDstate: boolean): Uint8Array {
    if (LEDstate) {
        return Uint8Array.of(1);
    } else {
        return Uint8Array.of(0);
    }
}
