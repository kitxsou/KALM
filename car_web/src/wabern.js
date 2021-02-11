/**
 * Inspiration:
 * 1. Generative Gestaltung Lesson 2
 * 2. https://www.youtube.com/watch?v=ZI1dmHv3MeM
 *
 * color: https://github.com/processing/p5.js/issues/364
 */

//sollte immer = 1 sein
let phase = 1;

/***********************/
/*
 * polygon(
   offSetX
   offSetY     
   Anmount of points
   NoiseWidth,
   Radius,
   Speed
   )
 */
/***********************/

function draw() {
  clear();
  // polygons(3, 100, 200);
  polygons(3);
}

function getCircleSpread(x, y, npoints, noiseVal, noiseMin, noiseMax, speed) {
  let circleSpread = [];

  let angle = TWO_PI / npoints;
  //Polarkoordinate um Punkte auf einem Kreis zu bekommen
  for (let a = 0; a < TWO_PI; a += angle) {
    let offX = map(cos(a), -1, 1, 0, noiseVal);
    let offY = map(sin(a + phase), -1, 1, 0, noiseVal);
    r = map(noise(offX, offY, sin(phase)), 0, 1, noiseMin, noiseMax);
    let sx = x + cos(a) * r;
    let sy = y + sin(a) * r;
    let e = [sx, sy, offX, offY];
    //Koordinaten + Winkel zum Mittelpunkt werden gespeichert
    circleSpread.push(e);
  }
  // phase = phase + phase;
  phase += speed;
  return circleSpread;
}

function polygon(
  x,
  y,
  npoints,
  noiseVal,
  noiseMin,
  noiseMax,
  speed,
  color1,
  color2
) {
  //die Mitte ist der Nullpunkt
  push();
  translate(width / 2, height / 2);
  //ein Array aus Punkten auf einem Kreis

  let circleSpread = getCircleSpread(
    x,
    y,
    npoints,
    noiseVal,
    noiseMin,
    noiseMax,
    speed
  );

  //Aus jedem neuen Punkt wird ein Vector gemacht und als vertex gezeichnet
  noStroke();
  gradientColor(-noiseMax, 0, noiseMax, 0, color1, color2);

  beginShape();
  for (let i = 0; i <= circleSpread.length - 1; i++) {
    let pointX = circleSpread[i][0];
    let pointY = circleSpread[i][1];
    vertex(pointX, pointY);
  }
  endShape(CLOSE);
  pop();
}

function gradientColor(x1, y1, x2, y2, color1, color2) {
  // linear gradient from start to end of line
  var grad = this.drawingContext.createLinearGradient(x1, y1, x2, y2);
  grad.addColorStop(0, color1);
  grad.addColorStop(1, color2);

  this.drawingContext.fillStyle = grad;
}

let getRandomNumber = true;

function polygons(anmount) {
  let positions = [];

  // while (getRandomNumber === true) {
  //   for (let i = anmount; i > 0; i--) {
  //     positions[i] = random(-100, 100);
  //   }
  //   getRandomNumber = false;
  // }

  // console.log(linearSpread);
  for (let i = anmount; i > 0; i--) {
    polygon(
      0,
      0,
      100,
      1,
      i * 50,
      i * 100,
      i / 600,
      color(83, 70, 248),
      color(253, 111, 87)
    );
  }
}
