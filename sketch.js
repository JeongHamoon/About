let mountainImg, hologramImg, particles = [];
let sparks = [];
let scanlineOffset = 0;

function preload() {
  hologramImg = loadImage('mountain.jpg'); // 민화 산 배경 이미지
  mountainImg = loadImage('bg.png');       // 메인 붉은 배경 이미지
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  for (let i = 0; i < 100; i++) {
    particles.push(new Particle());
  }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function draw() {
  // 🌌 배경
  background(14, 0, 0);
  image(mountainImg, 0, 0, width, height);

  // ✨ 마우스 주변 입자 효과
  for (let p of particles) {
    p.update();
    p.display();
  }

  // 🌁 홀로그램 효과
  push();
  translate(width / 2, height / 2);
  let scaleAmt = 1 + sin(frameCount * 0.02) * 0.02; // 살짝 흔들리는 듯한 효과
  scale(scaleAmt);
  blendMode(ADD);
  tint(255, 0, 0, 40); // Red layer
  tint(255, 30); // 투명도 설정
  imageMode(CENTER);
  image(hologramImg, -1, -1, width * 0.9, height * 0.9); // 크기 조정
  tint(0, 255, 255, 40); // Cyan layer
  image(hologramImg, 1, 1, width * 0.9, height * 0.9);
  tint(255, 255, 255, 30); // Base ghost image
  image(hologramImg, 0, 0, width * 0.9, height * 0.9);
  blendMode(BLEND);
  pop();
   drawScanLines();      // ✅ 수정
  drawGlowingWave();    // ✅ 반드시 호출해야 함
  
  
  // 🟩 Matrix Symbol
class Symbol {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = random(4, 10);
    this.char = this.getChar();
  }

  getChar() {
    return String.fromCharCode(0x30A0 + int(random(0, 96)));
  }

  fall() {
    this.y += this.speed;
    if (this.y > height) {
      this.y = random(-100, 0);
    }
    if (frameCount % 5 === 0) {
      this.char = this.getChar();
    }
  }

  show() {
    text(this.char, this.x, this.y);
  }
}

// ───────────────────────────────
// ✨ Particle Flow
class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(random(0.5, 1.5));
    this.alpha = 200;
  }

  update() {
    this.pos.add(this.vel);
    this.alpha -= 1;
    if (this.alpha < 0) {
      this.pos = createVector(random(width), random(height));
      this.alpha = 200;
    }
  }

  display() {
    noStroke();
    fill(255, 0, 0, this.alpha);
    ellipse(this.pos.x, this.pos.y, 2);
  }
}

// ───────────────────────────────
// scanlineOffset 사용 함수 수정
function drawScanLines() {
  stroke(255, 0, 0, 25);
  strokeWeight(1);
  for (let y = 0; y < height; y += 8) {
    line(0, (y + scanlineOffset) % height, width, (y + scanlineOffset) % height);
  }
  scanlineOffset += 0.5;
}

// 🌊 강렬한 붉은 단일 파동 라인
function drawGlowingWave() {
  // 여러 겹으로 그려서 glow 효과처럼 보이게 하기
  for (let i = 5; i >= 1; i--) {
    let alpha = map(i, 5, 1, 10, 255); // 바깥쪽이 더 투명
    let weight = i * 2;                // 바깥쪽이 더 두꺼움

    stroke(255, 0, 0, alpha);          // 붉은색 + 투명도
    strokeWeight(weight);
    noFill();

    beginShape();
    for (let x = 0; x < width; x += 5) {
      let y = height * 0.85 + sin(x * 0.015 + frameCount * 0.03) * 20;
      vertex(x, y);
    }
    endShape();
  }
}


// 🔥 Spark
  for (let i = sparks.length - 1; i >= 0; i--) {
    sparks[i].update();
    sparks[i].display();
    if (sparks[i].isFinished()) {
      sparks.splice(i, 1);
    }
  }
}
// Spark 클래스 정의
class Spark {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(1, 4));
    this.alpha = 255;
    this.size = random(2, 6);
    this.color = color(random(200, 255), random(50, 100), random(50, 100));
  }

  update() {
    this.pos.add(this.vel);
    this.alpha -= 4;
  }

  display() {
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), this.alpha);
    ellipse(this.pos.x, this.pos.y, this.size);
  }

  isFinished() {
    return this.alpha <= 0;
  }
}

// 🐾 입자 클래스
class Particle {
  constructor() {
    this.pos = createVector(mouseX, mouseY);
    this.vel = p5.Vector.random2D().mult(random(0.5, 2));
    this.alpha = 255;
  }

  update() {
    this.pos.add(this.vel);
    this.alpha -= 3;
  }

  display() {
    noStroke();
    fill(255, 0, 0, this.alpha);
    ellipse(this.pos.x, this.pos.y, 3);
  }
}
function mousePressed() {
  for (let i = 0; i < 50; i++) {
    sparks.push(new Spark(mouseX, mouseY));
  }
}

function mouseMoved() {
  particles.push(new Particle());
  if (particles.length > 100) {
    particles.splice(0, 1);
  }
}

function drawScanLines() {
  stroke(255, 0, 0, 25);
  strokeWeight(1);
  for (let y = 0; y < height; y += 8) {
    line(0, y, width, y);
  }
}
