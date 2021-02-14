const { RoutePoint } = require("./route_point");
const { getGpsData, sendWithRadio, startRadio } = require("./hardware");
const fetch = require("node-fetch");
const uuid = require("uuid");

console.log("Running...");
const evId = generateId();
const customMessage = "Wir müssen gleich an dir vorbei fahren!";
// https://goo.gl/maps/9qMrHZfTZEYFB6L97 Kaufland Dieburg
const destinationLocation = new RoutePoint(49.886545, 8.841271);

startRadio();

// updates data every 10s
setInterval(() => updateData().catch(console.error), 10 * 1000);

async function updateData() {
  console.log("Refreshing...");

  // creates data object with id and current location taken from gps module
  const data = {
    evId: evId,
    message: customMessage,
    currentLocation: await getGpsData(),
  };

  // gets route from current location to destination location
  data.route = await getRoute(data.currentLocation, destinationLocation);

  sendWithRadio(data);
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
