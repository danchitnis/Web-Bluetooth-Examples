var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    let bleChar;
    const btConnect = document.getElementById("btConnect");
    const btStart = document.getElementById("btStart");
    const btStop = document.getElementById("btStop");
    const pLog = document.getElementById("pLog");
    const serviceUuid = "f8c4fc40-e7d3-4e81-b686-9be0160b9b7d";
    const characteristicUuid = "f8c4fc41-e7d3-4e81-b686-9be0160b9b7d";
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
                .catch((error) => {
                log("Argh! " + error);
            });
        }
    });
    function startNotifications() {
        return __awaiter(this, void 0, void 0, function* () {
            log("Notifications started");
            yield bleChar.startNotifications();
            bleChar.addEventListener("characteristicvaluechanged", handleNotifications);
        });
    }
    function handleNotifications(event) {
        const target = event.target;
        const value = target.value;
        // Convert raw data bytes to hex values just for the sake of showing something.
        // In the "real" world, you'd use data.getUint8, data.getUint16 or even
        // TextDecoder to process raw data bytes.
        for (let i = 0; i < value.byteLength; i++) {
            log("0x" + ("00" + value.getUint8(i).toString(16)).slice(-2));
        }
    }
    function log(str) {
        pLog.innerHTML = pLog.innerHTML + "<br>> " + str;
    }
    function clikConnect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield connect();
            }
            catch (error) {
                log("Error ☹: " + error);
            }
        });
    }
    function connect() {
        return __awaiter(this, void 0, void 0, function* () {
            log("Requesting Bluetooth Device...");
            const bleDevice = yield navigator.bluetooth.requestDevice({
                acceptAllDevices: true,
                optionalServices: [serviceUuid],
            });
            log("Connecting to GATT Server...");
            const server = yield bleDevice.gatt.connect();
            log("Getting Service...");
            const service = yield server.getPrimaryService(serviceUuid);
            log("Getting Characteristic...");
            const characteristic = yield service.getCharacteristic(characteristicUuid);
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
        });
    }
}
//# sourceMappingURL=BLE_Stream.js.map