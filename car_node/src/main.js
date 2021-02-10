const { io } = require("socket.io-client");

const client = io("http://localhost:3000");

client.on("data", (data) => {
  console.log("Received data:");
  console.log(data);
});
