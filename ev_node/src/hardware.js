function getGpsData() {
    // returns route point of current location from gps module
  
    // Tutorial used: https://www.youtube.com/watch?v=ijfBeMTuWhU

    const SerialPort = require("serialport"); // this library ensures we can interface with the gps module (which gets "raw" data)
    const SerialPortParser = require("@serialport/parser-readline"); // part of the Serial Port library, parser puts data coming from GPS in solid lines; the gps api needs solid lines

    const gpsAPI = require("gps"); // allows to parse the "raw" data coming from the gps

    // const request = require("request-promise"); // so we can use promises?? Not using this here

    const port = new SerialPort("/dev/ttyS0", {baudRate: 9600}); // connects to the serial port the data is coming in
    const gpsParser = new gpsAPI(); // initialise gps Parser

    let latitudeLong = "";
    let latitudeShort = "";
    let longitudeLong = "";
    let longitudeShort = "";

    let routePoint = {
    "lat": "0",
    "lon": "0"
    }

    const parser = port.pipe(new SerialPortParser()); // data coming in will be piped into the variable

    gpsParser.on("data", data => { // listens for the data updated by the Serial Port Parser into the gps parser
        if(data.type === "GGA") { // just the relevant data types, ignores the rest
            if(data.quality !== null) { // check if there is something in GGA; GGA is part of the output we get from the gps module 
                latitudeLong = data.lat;
                latitudeShort = latitudeLong.toString().substring(0, 9); // substring shortens the string so the whole JSON can be send by radio
                routePoint.lat = latitudeShort;


                longitudeLong = data.lon;
                longitudeShort = longitudeLong.toString().substring(0, 9);
                routePoint.lon = longitudeShort;
                
                console.log(routePoint);
            }
        }
    });

    // listening for data coming from the Serial Port into that parser
    parser.on("data", data => {
        gpsParser.update(data);
    }); 
}

function sendWithRadio(data) {
  // sends the provided object as json via radio
}

module.exports = {
  getGpsData,
  sendWithRadio,
};
