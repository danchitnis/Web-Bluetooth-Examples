// chrome://flags/#enable-experimental-web-platform-features
const filter = {
    vendorId: 0x2341 // Arduino SA
  };

const decoder = new TextDecoder();

btConnect.addEventListener('click', async () => {
    let ports = await navigator.serial.getPorts();
    console.log(ports);

    
    const port = await navigator.serial.requestPort({filters: [filter]});
        // Continue connecting to |port|.
    
        // Permission to access a device was denied implicitly or explicitly by the user.
    console.log(port);
    // Populate the UI with options for the user to select or automatically
    // connect to devices.
    await port.open({ baudrate: 9600 });
    const reader = port.readable.getReader();
    console.log(reader);
    while (true) {
        const { value, done } = await reader.read();
        console.log(decoder.decode(value));
        if (done) {
          // |reader| has been canceled.
          break;
        }
        // Do something with |value|...
    }

});

navigator.serial.addEventListener('connect', e => {
    // Add |e.port| to the UI or automatically connect.
    console.log("conncted!");
});

navigator.serial.addEventListener('disconnect', e => {
// Remove |e.port| from the UI. If the device was open the disconnection can
// also be observed as a stream error.
});