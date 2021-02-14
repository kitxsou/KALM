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
  x,
  y,
  npoints,
  noiseVal,
  noiseMin,
  noiseMax,
  speed,
  color1,
  color2,
  alpha)
   *
   *
   * 
   * 
  polygons(
  x,
  y,
  scale,
  color1,
  color2,
  alpha,
  speed)
 */

//INFO:
//speed = 0.001 = slow
//speed = 0.01 = fast
/***********************/
var sketchWidth;
var sketchHeight;
const speed = window.speed;
function setup() {
  sketchWidth = document.getElementById("sketch").offsetWidth;
  sketchHeight = document.getElementById("sketch").offsetHeight;
  let renderer = createCanvas(sketchWidth, sketchHeight);
  renderer.parent("sketch");
}

function windowResized() {
  sketchWidth = document.getElementById("sketch").offsetWidth;
  sketchHeight = document.getElementById("sketch").offsetHeight;
  resizeCanvas(sketchWidth, sketchHeight);
}

function draw() {
  background(0, 0, 255);
}

function draw() {
  clear();
  background(15, 15, 50);
  polygons(
    0,
    0,
    sketchHeight / 250,
    color(253, 112, 87),
    color(82, 70, 248),
    160,
    speed
  );
}

function getCircleSpread(x, y, npoints, noiseVal, noiseMin, noiseMax, speed) {
  let circleSpread = [];

  let angle = TWO_PI / npoints;
  //Polarkoordinate um Punkte auf einem Kreis zu bekommen
  for (let a = 0; a < TWO_PI; a += angle) {
    let offX = map(cos(a), -1, 1, 0, noiseVal);
    let offY = map(sin(a + phase), -1, 1, 0, noiseVal);
    r = map(noise(offX, offY, sin(phase / 2)), 0, 1, noiseMin, noiseMax);
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
  color2,
  rotation,
  alpha
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
  rotate(rotation);

  gradientColor(-noiseMax + x, 0, noiseMax + x, 0, color1, color2, alpha);

  beginShape();
  for (let i = 0; i <= circleSpread.length - 1; i++) {
    let pointX = circleSpread[i][0];
    let pointY = circleSpread[i][1];
    vertex(pointX, pointY);
  }
  endShape(CLOSE);
  pop();
}

function gradientColor(x1, y1, x2, y2, color1, color2, alpha) {
  // linear gradient from start to end of line
  var grad = this.drawingContext.createLinearGradient(x1, y1, x2, y2);
  color1.setAlpha(alpha);
  color2.setAlpha(alpha);

  grad.addColorStop(0, color1);
  grad.addColorStop(1, color2);

  this.drawingContext.fillStyle = grad;
}

let getRandomNumber = true;

function polygons(x, y, scale, color1, color2, alpha, speed) {
  push();
  translate(x, y);
  polygon(
    0,
    0,
    100,
    0.5,
    70 * scale,
    100 * scale,
    speed,
    color1,
    color2,
    0.9 * PI,
    alpha
  );
  polygon(
    0,
    0,
    100,
    0.6,
    50 * scale,
    100 * scale,
    speed,
    color1,
    color2,
    0.3 * PI,
    alpha
  );
  polygon(
    0,
    0,
    100,
    1,
    50 * scale,
    80 * scale,
    speed,
    color1,
    color2,
    0.6 * PI,
    alpha
  );
}
