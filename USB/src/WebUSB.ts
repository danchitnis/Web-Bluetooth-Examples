/**
 * WebBlutooth example for Arduino Nano BLE 33
 *
 * Author: Danial Chitnis
 * December 2019
 *
 * Please upload the sketch before running this code
 */

 let LED = false;

 let btConnect = document.getElementById("btConnect") as HTMLButtonElement;
 let btLED = document.getElementById("btLED") as HTMLButtonElement;

 let pLog = document.getElementById("pLog") as HTMLParagraphElement;


 btConnect.addEventListener("click", () => {
    navigator.serial.getDevices().then( (device) => {
        console.log(device);
    });

 });


 btLED.addEventListener("click", () => {
   //
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
