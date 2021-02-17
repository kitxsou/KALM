const { RoutePoint } = require("./route_point");
const { getGpsData, sendWithRadio, startRadio, setColorOfLed } = require("./hardware");
const fetch = require("node-fetch");
const uuid = require("uuid");

console.log("Running...");
const evId = generateId();
const customMessage = "Wir müssen gleich an dir vorbei fahren!";
// https://goo.gl/maps/9qMrHZfTZEYFB6L97 Kaufland Dieburg
const destinationLocation = new RoutePoint(49.886545, 8.841271);

startRadio();






// BUTTON
let updateInterval;

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
        console.log("Off");
        determineIfOnOrOff = "Off";
        clearInterval(updateInterval);
      }else{
        console.log("On");
        determineIfOnOrOff = "On";
        // if button is on "On", the code stars sending data
        updateInterval =  setInterval(() => updateData().catch(console.error), 10 * 1000);
      }
    });
});


async function updateData() {
  console.log("Refreshing...");
  setColorOfLed(255, 0, 255); // green light while data is send

  // creates data object with id and current location taken from gps module
  const data = {
    evId: evId,
    message: customMessage,
    currentLocation: await getGpsData(),
  };

  // gets route from current location to destination location
  data.route = await getRoute(data.currentLocation, destinationLocation);

  sendWithRadio(data);
  setColorOfLed(0, 120, 255); // orange light while waiting for update of data
}


// calls rescue-track and extracts route points
// returns array of route points
async function getRoute(startPoint, endPoint) {
  // returns rescue track data as object
  const rescueTrackData = await getRescueTrackData(startPoint, endPoint);

  const allRoutePoints = rescueTrackData.item1;

  // takes first 3 route point from rescue-track item1 api
  return allRoutePoints.splice(0, 3);
}

async function getRescueTrackData(startPoint, endPoint) {
  const api = "https://apps.rescuetrack.com";
  const url = `${api}/api/routing/v3/spatial/route/${startPoint.lat}/${startPoint.lng}/${endPoint.lat}/${endPoint.lng}`;

  console.log(`RescueTrack: ${url}`);
  const response = await fetch(url);
  if (response.status != 200) {
    // throw error if response status is not Ok
    throw Error("RescueTrack error");
  }

  const json = await response.json();

  return json;
}

function generateId() {
  return uuid.v4(); // create unique user id from uuid npm package
}
