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
var btStart = document.getElementById("btStart");
var btStop = document.getElementById("btStop");
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
btStart.addEventListener("click", function () {
    bleChar.startNotifications().then(function () {
        log("Notifications started");
        bleChar.addEventListener("characteristicvaluechanged", handleNotifications);
    });
});
btStop.addEventListener("click", function () {
    if (bleChar) {
        bleChar.stopNotifications()
            .then(function (_) {
            log("Notifications stopped");
            bleChar.removeEventListener("characteristicvaluechanged", handleNotifications);
        })["catch"](function (error) {
            log("Argh! " + error);
        });
    }
});
function handleNotifications(event) {
    var target = event.target;
    var value = target.value;
    // Convert raw data bytes to hex values just for the sake of showing something.
    // In the "real" world, you'd use data.getUint8, data.getUint16 or even
    // TextDecoder to process raw data bytes.
    for (var i = 0; i < value.byteLength; i++) {
        log("0x" + ("00" + value.getUint8(i).toString(16)).slice(-2));
    }
}
function log(str) {
    pLog.innerHTML = pLog.innerHTML + "<br>> " + str;
}
//# sourceMappingURL=BLE_Stream.js.map