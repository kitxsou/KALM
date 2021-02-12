const serialPort = require("serialport");
const serialPortParser = require("@serialport/parser-readline");
const GPS = require("gps");

const port = new serialPort("/dev/ttyS0", {
  baudRate: 9600,
});
const gps = new GPS();

const parser = port.pipe(new serialPortParser());

gps.on("data", (data) => {
  if (data.type == "GGA") {
    if (data.quality != null) {
      //important data (long / lat)
      console.log(data);
    }
  }
});

parser.on("data", (data) => {
  console.log(data);
});
