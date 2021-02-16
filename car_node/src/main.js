const { io } = require("socket.io-client");
const { activateAmbientEffects } = require("./hardware");
const express = require("express");
const app = express();
const client = io("http://192.168.178.46:3000");
const { Status } = require("./status");

// The current status of the car
let status;

// The ids which the user has confirmed by pressing 'yes' on the screen
const confirmedIds = [];

// will be called every time ev_node sends data
client.on("data", updateStatus);

// Handles the data received from ev_node
function updateStatus(data) {
  console.log("Received data:");
  console.log(data);
  // Do nothing if the user has already confirmed this ev
  if (confirmedIds.includes(data.evId)) return;

  // do nothing if current ev hasn't been confirmed
  if (status && !confirmedIds.includes(status.evId)) return;

  // Do nothing if new id is same id as current status
  if (status && status.evId === data.evId) return;

  status = new Status(data.evId, data.message);
  activateAmbientEffects();
}

// Can be called to retrieve the current status of the car
app.get("/api/v1/status", function (req, res) {
  res.send(status);
});

// Will set the provided evId to confirmed
app.post("/api/v1/confirm/:evId", function (req, res) {
  const evId = req.params.evId;
  confirmedIds.push(evId);
  status = null;

  res.send();
});

// serves website of car web
app.use("/", express.static("../car_web/src"));

app.listen(3001);
console.log("listening on http://localhost:3001");
