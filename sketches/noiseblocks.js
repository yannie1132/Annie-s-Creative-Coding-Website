let cols = 25;
let rows = 25;
let counter = 0;
let cellSize;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  noStroke();
  calculateGrid();
}

function draw() {
  background(20);
  
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      // Calculate the center points for each square
      push();
      let X = x * cellSize + cellSize / 2;
      let Y = y * cellSize + cellSize / 2;
      
      // Set the drawing point
      translate(X, Y);
      
      // Calculate distance from mouse
      let d = dist(mouseX, mouseY, X, Y);
      let distmax = width / 4;
      let influence = constrain(map(d, 0, distmax, 1, 0), 0, 1);
      
      // Rotation based on noise and position
      let n = noise(x * 0.1, y * 0.1, counter);
      rotate(n * TWO_PI);
      
      // Color based on position
      let r = map(x, 0, cols, 50, 250);
      let g = map(y, 0, rows, 50, 250);
      fill(r, g, 250);
      
      // Rounded corners influenced by mouse proximity
      let cornerRadius = influence * cellSize * 0.5;
      rect(0, 0, cellSize * 0.8, cellSize * 0.8, cornerRadius);
      pop();
    }
  }
  
  counter += 0.01;
}

function calculateGrid() {
  // Calculate cell size based on the number of columns
  cellSize = width / cols;
  
  // Calculate rows to fill the entire height
  rows = ceil(height / cellSize);
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateGrid();
}