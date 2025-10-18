let stage = 1;
let pulseAmount = 0;
let stars = [];
let numStars = 150;

let soul1, soul2;
let velocity1, velocity2;
let accel1, accel2;

let t = 0;
let numFlows = 8;
let fragments = [];

let heartbeat, fallinginlove, inlove;

//sound
function preload() {
  heartbeat = loadSound("heartbeat.mp3");
  fallinginlove = loadSound("fallinginlove.mp3");
  inlove = loadSound("inlove.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);

  soul1 = createVector(width * 0.2, height * 0.5);
  soul2 = createVector(width * 0.8, height * 0.5);

  //slow movement to avoid immediate touching
  velocity1 = createVector(random(-5, 5), random(-1.5, 1.5));
  velocity2 = createVector(random(-5, 5), random(-1.5, 1.5));

  //for stage 3, background fragments
  for (let i = 0; i < 150; i++) {
    fragments.push({
      x: random(width),
      y: random(-height, 0),
      size: random(8, 20),
      speed: random(1, 3),
      hue: random(320, 360),
    });
  }

  //stars for stage 1
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
    });
  }

  //lay the first stage music automatically
  heartbeat.loop();
}

function draw() {
  if (stage === 1) {
    background(0);
    drawStage1();
  } else if (stage === 2) {
    background(0, 0.1);
    drawStage2();
  } else if (stage === 3) {
    background(0);
    drawStage3();
  }
}

//*** stage 1 ***
function drawStage1() {
  noStroke();
  for (let s of stars) {
    let brightness = map(sin(frameCount * 0.02), -1, 1, 60, 100);
    fill(0, 0, brightness);
    circle(s.x, s.y, s.size);
  }

  updateSouls();

  pulseAmount = map(sin(frameCount * 0.1), -1, 1, 0.8, 1.2);
  drawSoul(soul1, 200, pulseAmount);
  drawSoul(soul2, 330, pulseAmount);

  fill(0, 0, 100);
  textAlign(CENTER);
  textSize(20);
  text("Two souls wander... 🥺 (Press 2)", width / 2, 40);
}

//*** stage 2 ***
function drawStage2() {
  for (let i = 0; i < numFlows; i++) drawFlow(i);
  t += 0.005;

  updateSouls();
  drawSoul(soul1, 200);
  drawSoul(soul2, 330);

  stroke(0, 0, 100, 0.2);
  strokeWeight(10);
  line(soul1.x, soul1.y, soul2.x, soul2.y);

  stroke(0, 0, 100, 1);
  strokeWeight(3);
  line(soul1.x, soul1.y, soul2.x, soul2.y);

  noStroke();

  fill(0, 0, 100);
  textAlign(CENTER);
  textSize(20);
  text("A connection grows...✨ (Press 3)", width / 2, 40);
}

//*** stage 3 ***
function drawStage3() {
  for (let f of fragments) {
    fill(f.hue, 80, 100, 0.6);
    ellipse(f.x, f.y, f.size, f.size);
    f.y += f.speed;
    if (f.y > height) {
      f.y = -f.size;
      f.x = random(width);
    }
  }

  let direction = p5.Vector.sub(soul2, soul1).mult(0.005);
  soul1.add(direction);
  soul2.sub(direction);

  //calculate midpoint for glow
  let midX = (soul1.x + soul2.x) / 2;
  let midY = (soul1.y + soul2.y) / 2;

  //draw multiple ellipses for more effect in stage 3
  noStroke();
  for (let i = 0; i < 5; i++) {
    let size = 200 + i * 30 + sin(frameCount * 0.1) * 20;
    let alpha = 0.15 - i * 0.02;
    fill(330, 90, 100, alpha);
    ellipse(midX, midY, size);
  }

  drawSoul(soul1, 200);
  drawSoul(soul2, 330);

  fill(0, 0, 100);
  textAlign(CENTER);
  textSize(20);
  text("...and they fell in love ❤️", width / 2, 40);
}

function drawFlow(index) {
  let baseY = height / 2 + index * 30 - 30;
  stroke(330, 80, 100, 0.5);
  strokeWeight(3);
  noFill();
  beginShape();
  for (let x = 0; x < width; x += 8) {
    let y = baseY + map(noise(x * 0.005, t + index * 10), 0, 1, -150, 150);
    vertex(x, y);
  }
  endShape();
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

  //prevent souls from touching - Help: https://chatgpt.com/share/68f13e09-11d4-800e-8b5b-3332c49a7218
  let diff = p5.Vector.sub(soul1, soul2);
  let distance = diff.mag();
  let minDistance = 140;

  if (distance < minDistance) {
    // direction to push them apart
    let push = diff
      .copy()
      .normalize()
      .mult((minDistance - distance) * 0.05);
    velocity1.add(push);
    velocity2.sub(push);
  }

  velocity1.add(accel1).limit(8);
  velocity2.add(accel2).limit(8);

  soul1.add(velocity1);
  soul2.add(velocity2);

  if (soul1.x > width || soul1.x < 0) velocity1.x *= -1;
  if (soul1.y > height || soul1.y < 0) velocity1.y *= -1;
  if (soul2.x > width || soul2.x < 0) velocity2.x *= -1;
  if (soul2.y > height || soul2.y < 0) velocity2.y *= -1;
}

function keyPressed() {
  if (key === "1") {
    stage = 1;
    fallinginlove.stop();
    inlove.stop();
    heartbeat.loop();
  }
  if (key === "2") {
    stage = 2;
    heartbeat.stop();
    inlove.stop();
    fallinginlove.loop();
  }
  if (key === "3") {
    stage = 3;
    heartbeat.stop();
    fallinginlove.stop();
    inlove.loop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
