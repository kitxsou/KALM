let posA = [0, 0];
let posB = [100, 100];

//get the position of pointB compared to pointA (pointA is the center)
function comparePoints(pointA, pointB) {
  let status;
  if (pointB[1] >= pointA[1]) {
    if (pointB[0] >= pointA[0]) {
      //unten rechts
      status = "unten rechts";
    } else {
      //unten links
      status = "unten links";
    }
  } else {
    if (pointB[0] >= pointA[0]) {
      //oben rechts
      status = "oben rechts";
    } else {
      //oben links
      status = "oben links";
    }
  }
  return status;
}

module.exports = {
  comparePoints,
};
