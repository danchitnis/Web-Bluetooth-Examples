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
 let btStart = document.getElementById("btStart") as HTMLButtonElement;
 let btStop = document.getElementById("btStop") as HTMLButtonElement;

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


 btStart.addEventListener("click", () => {

    bleChar.startNotifications().then( () => {
        log("Notifications started");
        bleChar.addEventListener("characteristicvaluechanged", handleNotifications);
    });

 });

 btStop.addEventListener("click", () => {
    if (bleChar) {
        bleChar.stopNotifications()
        .then(_ => {
          log("Notifications stopped");
          bleChar.removeEventListener("characteristicvaluechanged", handleNotifications);
        })
        .catch( (error) => {
          log("Argh! " + error);
        });
      }
 });


 function handleNotifications(event: Event) {
    const target = event.target as BluetoothRemoteGATTCharacteristic;
    const value = target.value;
    // Convert raw data bytes to hex values just for the sake of showing something.
    // In the "real" world, you'd use data.getUint8, data.getUint16 or even
    // TextDecoder to process raw data bytes.
    let str = "";
    for (let i = 0; i < value.byteLength; i++) {
        str = str + "0x" + ("00" + value.getUint8(i).toString(16)).slice(-2) + ", ";
    }
    log(str);
 }


 function log(str: string) {
    pLog.innerHTML = pLog.innerHTML + "<br>> " + str;
 }


