const { RoutePoint } = require("./route_point");
const { getGpsData, sendWithRadio } = require("./hardware");

console.log("Running...");
const id = generateId();
const destinationLocation = new RoutePoint(
  49.87292059988813,
  8.656861782073976
);

setInterval(updateData, 2000);

function updateData() {
  console.log("Refreshing...");

  const data = {
    evId: id,
    currentLocation: getGpsData(),
  };

  data.route = getRoute(data.currentLocation, destinationLocation);

  sendWithRadio(data);
}

function getRoute(startPoint, endPoint) {
  // calls rescue-track and extracts route points
  const rescueTrackData = getRescueTrackData(startPoint, endPoint);

  // returns array of route points
}

function getRescueTrackData(startPoint, endPoint) {
  // https://apps.rescuetrack.com/api/routing/v3/spatial/route/48.518317061824256/9.05802369117737/49.87292059988813/8.656861782073976
}

function generateId() {
  // returns random id
}
