// SCREENS
// 00: wabern
// 01: titel
// 02: personalisierte-nachricht
// 03: kalm-nachricht
// 04: rettungsgasse-anleitung
// 05: bestaetigung
// 06: richtung
// 07: danke
// 08: weitere-hilfe

// converts current page location to number
// eg. turns '/01/' into 1
const currentPage = Number(document.location.pathname.substr(1, 2));

// The current url search as an object
// Should contain evId and message
const search = new URLSearchParams(document.location.search);

// Wait for page to be fully loaded
window.addEventListener("load", () => {
  if (currentPage === 0) {
    handleWabernScreen();
  } else if (currentPage === 2) {
    handleMessageScreen();
  } else if (currentPage === 5) {
    handleConfirmScreen();
  } else if (currentPage === 8) {
    handleAdditionalHelpScreen();
  } else {
    // Go to next screen after 5 seconds
    setTimeout(goToNextScreen, 5000);
  }
});

function goToNextScreen() {
  // Set the current path name to the next in line
  // Using pathname here to keep the current url search
  document.location.pathname = `/0${currentPage + 1}/`;
}

function handleWabernScreen() {
  // Retrieve the current status from car_node every second
  setInterval(async () => {
    const response = await fetch("/api/v1/status", { method: "GET" });

    // If content is empty do nothing
    // eg. if there is no ev near the car
    const isContentEmpty = response.headers.get("Content-Length") === "0";
    if (isContentEmpty) return;

    const data = await response.json();

    console.log(data.evId);
    console.log(data.message);

    // Navigate to the first screen and add evId and message to the url search
    document.location = `/01/?evId=${data.evId}&message=${data.message}`;
  }, 1000);
}

function handleMessageScreen() {
  // Searches for the message div element
  const messageDiv = document.getElementById("message");

  // Sets the message div text to the message from the url search
  messageDiv.innerText = search.get("message");

  // Go to next screen after 5 seconds
  setTimeout(goToNextScreen, 5 * 1000);
}

function handleConfirmScreen() {
  // Searches for the confirm button element
  const confirmButton = document.getElementById("Ja");

  // Adds function to be executed on click
  confirmButton.addEventListener("click", () => {
    // Get evId from url search
    const evId = search.get("evId");

    // Send confirm request to car_node
    fetch(`/api/v1/confirm/${evId}`, { method: "POST" })
      .then(goToNextScreen)
      .catch(console.error);
  });
}

function handleAdditionalHelpScreen() {
  // Searches for the dismiss button element
  const dismissButton = document.getElementById("Nein_danke");

  // Adds function to be executed on click
  dismissButton.addEventListener("click", () => (document.location = "/00/"));

  // Wait 15 seconds and go to wabern screen
  setTimeout(() => (document.location = "/00/"), 15 * 1000);
}
