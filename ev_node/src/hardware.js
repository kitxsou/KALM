const http = require("http").Server();
const { Server } = require("socket.io");
const { RoutePoint } = require("./route_point");

// will be initialized by calling startRadio
let io;

function startRadio() {
  // Create a new socket io server
  io = new Server(http);

  // This method is called when a client connects
  io.on("connection", (socket) => {
    console.log("a user connected");

    // This method is called once the client disconnects
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  // Starts the http server on port 3000
  http.listen(3000, () => {
    console.log("listening on http://localhost:3000");
  });
}

function sendWithRadio(data) {
  console.log(`Sending data:`);
  console.log(data);

  // sends the provided object as json using socket
  io.emit("data", data);
}

function getGpsData() {
  // Cannot use gps module if running on windows
  const isWindows = process.platform === "win32";
  if (true) {
    return new RoutePoint(49.886545, 8.841271);
  }

  return new Promise((resolve, reject) => {
    // returns route point of current location from gps module

    // Tutorial used: https://www.youtube.com/watch?v=ijfBeMTuWhU

    const SerialPort = require("serialport"); // this library ensures we can interface with the gps module (which gets "raw" data)
    const SerialPortParser = require("@serialport/parser-readline"); // part of the Serial Port library, parser puts data coming from GPS in solid lines; the gps api needs solid lines

    const gpsAPI = require("gps"); // allows to parse the "raw" data coming from the gps

    const port = new SerialPort("/dev/ttyS0", { baudRate: 9600 }); // connects to the serial port the data is coming in
    const gpsParser = new gpsAPI(); // initialise gps Parser

    let latitudeLong = "";
    let latitudeShort = "";
    let longitudeLong = "";
    let longitudeShort = "";

    let routePoint = {
      lat: "0",
      lon: "0",
    };

    const parser = port.pipe(new SerialPortParser()); // data coming in will be piped into the variable

    gpsParser.on("data", (data) => {
      // listens for the data updated by the Serial Port Parser into the gps parser
      if (data.type === "GGA") {
        // just the relevant data types, ignores the rest
        if (data.quality !== null) {
          // check if there is something in GGA; GGA is part of the output we get from the gps module
          latitudeLong = data.lat;
          latitudeShort = latitudeLong.toString().substring(0, 9); // substring shortens the string so the whole JSON can be send by radio
          routePoint.lat = latitudeShort;

          longitudeLong = data.lon;
          longitudeShort = longitudeLong.toString().substring(0, 9);
          routePoint.lon = longitudeShort;

          resolve(routePoint);
        }
      }
    });

    // listening for data coming from the Serial Port into that parser
    parser.on("data", (data) => {
      gpsParser.update(data);
    });
  });
}

function buttonPressed() {
  // function for use of button
  // if button is pressed, whole process on rv gets started
  const Gpio = require("pigpio").Gpio; // initialise module to address gpio pins on the RPi

  // Button at GPIO 17
  const button = new Gpio(17, {
    mode: Gpio.INPUT, // listens for input (press of the button)
    pullUpDown: Gpio.PUD_OFF,
    edge: Gpio.RISING_EDGE, // power is recognized while rising (button press)
  });

return new Promise((resolve, reject) => {
    let processRunning = -1;

    button.on("interrupt", (level) => {
      processRunning = -1 * processRunning;
      if(processRunning > 0){
        resolve("Off");
      }else{
        resolve("On");
      }
    });
});
}

function setColorOfLed(r, g, b) {
  //color values are reversed (255 = dark, 0 = bright)

  const Gpio = require("pigpio").Gpio; // initialise module to address gpio pins on the RPi

  // Each color of the LED has an own gpio pin
  const redPin = new Gpio(16, { mode: Gpio.OUTPUT }); // Output: RPi sends signal to the pin
  const greenPin = new Gpio(26, { mode: Gpio.OUTPUT });
  const bluePin = new Gpio(6, { mode: Gpio.OUTPUT });

  // set Color of each pin
  redPin.pwmWrite(r); // pwm is used to use values (0 to 255) other than just on and off (like digitalWrite)
  greenPin.pwmWrite(g);
  bluePin.pwmWrite(b);

  // if LED should be shut down use 255 for each value. Otherwise LED will be on all the time (no matter if program is running or not)
}

module.exports = {
  getGpsData,
  sendWithRadio,
  buttonPressed,
  setColorOfLed,
  startRadio,
};
