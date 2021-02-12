function activateAmbientEffects() {
  // should activate sound and lights
  let val = 0;
  let countUp = true;

  //please add a path to a soundfile
  playSound("./");

  //as long as the button is not pressed, val is counting up or down
  //we should also add a screenIsTouched function here
  while (buttonPressed()) {
    if (countUp === true) {
      val++;
      if (val >= 255) {
        console.log("💫effects💫");
        countUp = false;
      } else {
        val--;
        if (val <= 10) {
          console.log("💫effects💫");
          countUp = true;
        }
      }
    }
    ledIsLit(val);
    vibrationMotorIsVibrating(val);
  }
  if (buttonPressed() === false) {
    val = 0;
    ledIsLit(val);
    vibrationMotorIsVibrating(val);
  }
}

function getGpsData() {
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

        return routePoint;
      }
    }
  });

  // listening for data coming from the Serial Port into that parser
  parser.on("data", (data) => {
    gpsParser.update(data);
  });
}

function buttonPressed() {
  // function for use of button
  // if button is pressed, whole process on rv gets started
  const Gpio = require("pigpio").Gpio; // initialise module to address gpio pins on the RPi

  // Button at GPIO 4
  const button = new Gpio(4, {
    mode: Gpio.INPUT, // listens for input (press of the button)
    pullUpDown: Gpio.PUD_DOWN, // power is just running while button is actively pressed, sends signal
    edge: Gpio.EITHER_EDGE, // power is also recognized while rising or falling
  });

  // suggestion: if processRunning = true whole process is running, else it is stopped
  let processRunning = false;

  button.on("interrupt", (level) => {
    if (processRunning) {
      processRunning = false;
    } else {
      processRunning = true;
    }

    return processRunning;
  });
}

function ledIsLit(level) {
  //color values are NOT reversed (255 = bright, 0 = dark)
  //this is because the led is a common anode instead of a common cathode led

  const Gpio = require("pigpio").Gpio; // initialise module to address gpio pins on the RPi

  const ledPin = new Gpio(17, { mode: Gpio.OUTPUT }); // Output: RPi sends signal to the pin

  // set brightness of the led
  ledPin.pwmWrite(level); // pwm is used to use values (0 to 255) other than just on and off (like digitalWrite)
  // if LED should be shut down use 0 for level. Otherwise LED will be on all the time (no matter if program is running or not)
}

function vibrationMotorIsVibrating(level) {
  const Gpio = require("pigpio").Gpio; // initialise module to address gpio pins on the RPi

  const vibrationMotor = new Gpio(27, { mode: Gpio.INPUT }); // Output: RPi sends signal to the pin

  //set the strength of the vibration (0 - 255) 0 = off
  vibrationMotor.pwmWrite(level); // pwm is used to use values (0 to 255) other than just on and off (like digitalWrite)
  // if vibrationMotor should be shut down use 0 for level. Otherwise it will run all the time (no matter if program is running or not)
}

function playSound(path) {
  //initialise the npm // module may be switched with p5 sound lib
  const player = require("play-sound")((opts = {}));

  //get the path of the soundfile
  const sound = path;

  //plays the sound of the given path. timeout after 300 ms
  player.play(sound, { timeout: 300 }, (err, succ) => {
    if (err) {
      console.log("soundmodule has an error:");
      console.error(err.message);
    }
    console.log("finish");
  });
}

module.exports = {
  getGpsData,
  buttonPressed,
  ledIsLit,
  vibrationMotorIsVibrating,
  playSound,
  activateAmbientEffects,
};
