/**
 * WebBlutooth example for Arduino Nano BLE 33
 *
 * Author: Danial Chitnis
 * December 2019
 *
 * Please upload the sketch before running this code
 */
var LED = false;
var btConnect = document.getElementById("btConnect");
var btLED = document.getElementById("btLED");
var pLog = document.getElementById("pLog");
btConnect.addEventListener("click", function () {
    navigator.usb.requestDevice({ filters: [{ vendorId: 0x2341 }] })
        .then(function (device) {
        log(device.productName); // "Arduino Micro"
        log(device.manufacturerName); // "Arduino LLC"
    })["catch"](function (error) { log(error); });
});
btLED.addEventListener("click", function () {
    //
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
//# sourceMappingURL=WebUSB.js.map