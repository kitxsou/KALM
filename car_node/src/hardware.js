function activateAmbientEffects() {
  console.log("Entering activateAmbientEffects()");
  const isWindows = process.platform === "win32";
  //if (true) {
  //  console.log("💫effects💫");
  //  return;
  //}

  let counter = 0;
  let val = 0;
  let countingUp = true;

  //please add a path to a soundfile
  playSound("./assets/notification.mp3");
//Do While ist wie While, nur der Inhalt der Funktion wird mindestens einmal durchgespielt
do {
  if (countingUp === true) {
    val++;
    //console.log("💫fading in💫" + val);
    //hohe Zahl, damit das Pulsieren länger anhält

    if (val >= 25500) {
      countingUp = false;
    }
  } else {
    val--;
    //console.log("💫fading out💫" + val);
    if (val <= 1000) {
      countingUp = true;
      counter++;
    }
  }
  //da die LED und der Button einen integer wollen, wird die Zahl nach oben gerundet.
  nVal = Math.ceil(val / 100);
  //console.log(nVal);
  //LED und vibrationMotor werden aktiviert
  ledIsLit(nVal);
  //falls der Vibrationsmotor immernoch nicht pulsieren will, schreibe hier einfach eine Zahl rein. Ansonsten habe ich unten noch eine Alternative
  vibrationMotorIsVibrating(nVal);
  //wenn der Button gedrückt wird, wird das hier ausgegeben
  if (counter === 5) {
    console.log("finished");
    ledIsLit(0);
  }
  //Solange der Button nicht gedrückt wird, wird die Schleife ausgeführt.
} while (counter <= 5);
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

    //Ein Array mit Zahlen zwischen 0 und 60 in zweierschritten
    let arr = [];
    for (let i = 0; i <= 60; i = i + 2) {
      arr.push(i);
    }
    let l1 = level;
    let l2;
    let d = new Date();
    let s = d.getSeconds();
    //alle zwei Sekunden wird der level ausgegeben (das mit l1 und l2
    //funktioniert leider irgendwie nicht. Mein Plan war es, dass der console log nur bei einer neuen Zahl ausgeführt wird.
    //vielleicht funktioniert es auch so?)
    if (arr.includes(s) && l2 !== l1) {
      console.log("VibrationMotor: " + level);
      vibrationMotor.pwmWrite(level); // pwm is used to use values (0 to 255) other than just on and off (like digitalWrite)
    }
    l2 = level;
  //set the strength of the vibration (0 - 255) 0 = off
 
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
