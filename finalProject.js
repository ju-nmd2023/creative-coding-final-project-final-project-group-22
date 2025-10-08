let stage = 1;
let pulseAmount = 0;
let stars = [];
let numStars = 150;

let soul1, soul2;
let velocity1, velocity2;
let accel1, accel2;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);

  soul1 = createVector(width * 0.2, height * 0.5);
  soul2 = createVector(width * 0.8, height * 0.5);

  velocity1 = createVector(random(-5, 5), random(-1.5, 1.5));
  velocity2 = createVector(random(-5, 5), random(-1.5, 1.5));

  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
    });
  }
}

function draw() {
  if (stage === 1) {
    background(0);
    drawStage1();
  }
}

function drawStage1() {
  for (let s of stars) {
    fill(brightness);
    circle(s.x, s.y, s.size);
  }

  updateSouls();

  pulseAmount = map(sin(frameCount * 0.1), -1, 1, 0.8, 1.2);
  drawSoul(soul1, 200, pulseAmount);
  drawSoul(soul2, 330, pulseAmount);

  fill(0, 0, 100);
  textAlign(CENTER);
  textSize(20);
  text("Stage 1: Two souls wander... 🥺 (Press 2)", width / 2, 40);
}

function drawSoul(pos, hue, pulse = 1) {
  stroke(hue, 80, 100);
  strokeWeight(2);
  fill(hue, 80, 100, 0.3);
  ellipse(pos.x, pos.y, 80 * pulse);
  fill(hue, 80, 100, 0.8);
  ellipse(pos.x, pos.y, 40 * pulse);
  noStroke();
}

function updateSouls() {
  let mouse = createVector(mouseX, mouseY);

  accel1 = p5.Vector.sub(mouse, soul1).normalize().mult(0.5);
  accel2 = p5.Vector.sub(mouse, soul2).normalize().mult(0.5);

  velocity1.add(accel1).limit(8);
  velocity2.add(accel2).limit(8);

  soul1.add(velocity1);
  soul2.add(velocity2);

  if (soul1.x > width || soul1.x < 0) velocity1.x *= -1;
  if (soul1.y > height || soul1.y < 0) velocity1.y *= -1;
  if (soul2.x > width || soul2.x < 0) velocity2.x *= -1;
  if (soul2.y > height || soul2.y < 0) velocity2.y *= -1;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
