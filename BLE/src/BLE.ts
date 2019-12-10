/**
 * 
 * 
 * Author: Danial Chitnis
 * December 2019
 */


 let btConnect = document.getElementById("btConnect") as HTMLButtonElement;
 let pLog = document.getElementById("pLog") as HTMLParagraphElement;


 btConnect.addEventListener("click", () => {

    const serviceUuid = "f8c4fc40-e7d3-4e81-b686-9be0160b9b7d" as BluetoothServiceUUID;
    const characteristicUuid = "f8c4fc41-e7d3-4e81-b686-9be0160b9b7d" as BluetoothCharacteristicUUID;
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
        log("> Writable Auxiliaries: " +
        characteristic.properties.writableAuxiliaries);
    })
    .catch( (error) => {
        log("Argh! " + error);
    });
 });




 function log(str: string) {
     pLog.innerHTML = pLog.innerHTML + "<br>> " + str;
 }
