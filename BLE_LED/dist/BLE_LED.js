/**
 * WebBlutooth example for Arduino Nano BLE 33
 *
 * Author: Danial Chitnis
 * December 2019
 *
 * Please upload the sketch before running this code
 */
var LED = false;
var bleChar;
var btConnect = document.getElementById("btConnect");
var btLED = document.getElementById("btLED");
var pLog = document.getElementById("pLog");
btConnect.addEventListener("click", function () {
    /**
     * these should match the UUID in your Arduino sketch. you can generate your own UUIDs here:
     * https://www.uuidgenerator.net/
     */
    var serviceUuid = "f8c4fc40-e7d3-4e81-b686-9be0160b9b7d";
    var characteristicUuid = "f8c4fc41-e7d3-4e81-b686-9be0160b9b7d";
    // The following code section is based on Chrome example
    // https://googlechrome.github.io/samples/web-bluetooth/characteristic-properties.html
    log("Requesting Bluetooth Device...");
    navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [serviceUuid]
    })
        .then(function (device) {
        log("Connecting to GATT Server...");
        return device.gatt.connect();
    })
        .then(function (server) {
        log("Getting Service...");
        return server.getPrimaryService(serviceUuid);
    })
        .then(function (service) {
        log("Getting Characteristic...");
        return service.getCharacteristic(characteristicUuid);
    })
        .then(function (characteristic) {
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
    })["catch"](function (error) {
        log("Argh! " + error);
    });
});
btLED.addEventListener("click", function () {
    bleChar.writeValue(LEDtoBuffer(LED));
    log("LED is now " + LED);
    LED = !LED;
});
function log(str) {
    pLog.innerHTML = pLog.innerHTML + "<br>> " + str;
}
function LEDtoBuffer(LEDstate) {
    if (LEDstate) {
        return Uint8Array.of(1);
    }
    else {
        return Uint8Array.of(0);
    }
}
//# sourceMappingURL=BLE_LED.js.map