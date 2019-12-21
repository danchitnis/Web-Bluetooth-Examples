/**
 * WebBlutooth example for Arduino Nano BLE 33
 *
 * Author: Danial Chitnis
 * December 2019
 *
 * Please upload the sketch before running this code
 */

{

 //let LED = false;
 let bleChar: BluetoothRemoteGATTCharacteristic;

 const btConnect = document.getElementById("btConnect") as HTMLButtonElement;
 const btStart = document.getElementById("btStart") as HTMLButtonElement;
 const btStop = document.getElementById("btStop") as HTMLButtonElement;

 const pLog = document.getElementById("pLog") as HTMLParagraphElement;

 const serviceUuid = "f8c4fc40-e7d3-4e81-b686-9be0160b9b7d" as BluetoothServiceUUID;
 const characteristicUuid = "f8c4fc41-e7d3-4e81-b686-9be0160b9b7d" as BluetoothCharacteristicUUID;


 btConnect.addEventListener("click", () => {


    /**
     * these should match the UUID in your Arduino sketch. you can generate your own UUIDs here:
     * https://www.uuidgenerator.net/
     */
    


    // The following code section is based on Chrome example
    // https://googlechrome.github.io/samples/web-bluetooth/characteristic-properties.html
    
    clikConnect();
 });


 btStart.addEventListener("click", () => {

    startNotifications();

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

 async function startNotifications(): Promise<void> {
    log("Notifications started"); 
    await bleChar.startNotifications();
    bleChar.addEventListener("characteristicvaluechanged", handleNotifications);
 }

 function handleNotifications(event: Event): void {
    const target = event.target as BluetoothRemoteGATTCharacteristic;
    const value = target.value;
    // Convert raw data bytes to hex values just for the sake of showing something.
    // In the "real" world, you'd use data.getUint8, data.getUint16 or even
    // TextDecoder to process raw data bytes.
    for (let i = 0; i < value.byteLength; i++) {
        log("0x" + ("00" + value.getUint8(i).toString(16)).slice(-2));
    }
 }


 function log(str: string): void {
    pLog.innerHTML = pLog.innerHTML + "<br>> " + str;
 }

 async function clikConnect(): Promise<void> {
    try {
        await connect();
    }
    catch (error) {
        log("Error ☹: " + error);
    }
    
 }

 async function connect(): Promise<void> {
    log("Requesting Bluetooth Device...");


    const bleDevice = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [serviceUuid],
    });
    log("Connecting to GATT Server...");
    const server = await bleDevice.gatt.connect();

    log("Getting Service...");
    const service = await server.getPrimaryService(serviceUuid);

    log("Getting Characteristic...");
    const characteristic = await service.getCharacteristic(characteristicUuid);

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
 }

}
