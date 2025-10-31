let cam;
let scale = 10;
let chars = " .:-=+*#%@";
let cameraReady = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  textAlign(CENTER, CENTER);
  textSize(scale);
  
  // Initialize camera with error handling
  cam = createCapture(VIDEO, 
    function(stream) {
      console.log('Camera ready');
      cameraReady = true;
    }
  );
  cam.hide(); // Hide the raw video feed
  cam.size(windowWidth/scale, windowHeight/scale);
}

function draw() {
  background(0);
  
  if (!cameraReady) {
    // Show loading message
    fill(255);
    noStroke();
    textSize(20);
    text('Waiting for camera access...', width/2, height/2);
    return;
  }
  
  cam.loadPixels();
  translate((width-cam.width*scale)/2, (height-cam.height*scale)/2);
  
  let index = 0;
  for(let y = 0; y < cam.height; y++) {
    for(let x = 0; x < cam.width; x++) {
      if (index + 3 < cam.pixels.length) {  // Check bounds
        let r = cam.pixels[index];
        let g = cam.pixels[index + 1];
        let b = cam.pixels[index + 2];
        let brightness = (r + g + b) / 3;
        let charIndex = floor(map(brightness, 0, 255, 0, chars.length-1));
        
        fill(r, g, b);
        text(chars[charIndex], x*scale + scale/2, y*scale + scale/2);
      }
      index += 4;
    }
  }
  cam.updatePixels();
}