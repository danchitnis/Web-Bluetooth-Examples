/**
 *
 *
 * Author: Danial Chitnis
 * December 2019
 */
var btConnect = document.getElementById("btConnect");
var pLog = document.getElementById("pLog");
btConnect.addEventListener("click", function () {
    var serviceUuid = "f8c4fc40-e7d3-4e81-b686-9be0160b9b7d";
    var characteristicUuid = "f8c4fc41-e7d3-4e81-b686-9be0160b9b7d";
    //const serviceUuid = parseInt(charServiceUuid);
    //const characteristicUuid = parseInt(charCharacteristicUuid);
    /*let serviceUuid = document.querySelector("#service").value;
    if (serviceUuid.startsWith("0x")) {
        serviceUuid = parseInt(serviceUuid);
    }

    let characteristicUuid = document.querySelector("#characteristic").value;
    if (characteristicUuid.startsWith("0x")) {
        characteristicUuid = parseInt(characteristicUuid);
    }*/
    log("Requesting Bluetooth Device...");
    navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [serviceUuid]
        //filters: [{
        //services: [serviceUuid]
        //}]
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
        var a = Uint8Array.of(1);
        characteristic.writeValue(a);
    })["catch"](function (error) {
        log("Argh! " + error);
    });
});
function log(str) {
    pLog.innerHTML = pLog.innerHTML + "<br>> " + str;
}
//# sourceMappingURL=BLE.js.map