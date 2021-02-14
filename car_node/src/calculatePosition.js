let rPoints = [
  [10, 10],
  [50, 200],
  [200, 400],
  [420, 302],
  [460, 42],
];
let routePointCar = [80, 300];

//is the car between 2 routePoints?
function isCarBetweenRoutePoints(routePoints, carPosition) {
  //first: are there two routePoints?
  if (routePoints.length >= 2) {
    //get all routePoints
    fill(255, 0, 0);
    circle(carPosition[0], carPosition[1], 10, 10);

    for (let i = 0; i <= routePoints.length - 1; i++) {
      //save every two routePoints
      //if there is one left...
      if (i < routePoints.length - 1) {
        let firstRoutePoint = routePoints[i];
        let secondRoutePoint = routePoints[i + 1];

        stroke(255);
        noFill();
        quad(
          routePoints[i][0],
          routePoints[i][1],
          routePoints[i + 1][0],
          routePoints[i][1],
          routePoints[i + 1][0],
          routePoints[i + 1][1],
          routePoints[i][0],
          routePoints[i + 1][1]
        );
        if (
          carPosition[0] >= firstRoutePoint[0] &&
          carPosition[0] <= secondRoutePoint[0] &&
          carPosition[1] >= firstRoutePoint[1] &&
          carPosition[1] <= secondRoutePoint[1]
        ) {
          //console.log("das Auto befindet sich zwischen zwei routenpunkten");
          return true;
        } else {
          return false;
        }
      }
    }
  } else {
    //console.log("zu wenig Routenpunkte");
    let err = "zu wenig Routenpunkte";
    return err;
  }
}
module.exports = {
  isCarBetweenRoutePoints,
};
