let cam;
let scale = 10;
let chars = " .:-=+*#%@";

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  textAlign(CENTER, CENTER);
  textSize(scale);
  
  // Initialize camera
  cam = createCapture(VIDEO);
  cam.size(windowWidth/scale, windowHeight/scale);
  cam.hide();
}

function draw() {
  background(0);
  
  // Check if camera is ready by checking its width
  if (cam.width === 0) {
    fill(255);
    noStroke();
    textSize(20);
    text('Waiting for camera access...', width/2, height/2);
    return;
  }
  
  cam.loadPixels();
  
  // Check if pixels are actually loaded
  if (cam.pixels.length === 0) {
    return;
  }
  
  translate((width - cam.width * scale) / 2, (height - cam.height * scale) / 2);
  
  let index = 0;
  for(let y = 0; y < cam.height; y++) {
    for(let x = 0; x < cam.width; x++) {
      let r = cam.pixels[index];
      let g = cam.pixels[index + 1];
      let b = cam.pixels[index + 2];
      let brightness = (r + g + b) / 3;
      let charIndex = floor(map(brightness, 0, 255, 0, chars.length - 1));
      
      fill(r, g, b);
      noStroke();
      text(chars[charIndex], x * scale + scale / 2, y * scale + scale / 2);
      
      index += 4;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cam.size(windowWidth/scale, windowHeight/scale);
}
