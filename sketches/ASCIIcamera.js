let cam
let scale = 10
let chars = " .:-=+*#%@"
function setup() {
  createCanvas(windowWidth, windowHeight);
  cam = createCapture(VIDEO,{ flipped:true });
  cam.size(windowWidth/scale, windowHeight/scale);
  textAlign(CENTER, CENTER);
  textSize(scale);
}
function draw() {
  background(0);
  cam.loadPixels()
  translate((width-cam.width*scale)/2,(height-cam.height*scale)/2)
  
  let index = 0;
  for(let y = 0; y<cam.height; y++){
    for(let x = 0; x< cam.width; x++){
      let r = cam.pixels[index]
      let g = cam.pixels[index +1]
      let b = cam.pixels[index +2]
      let brightness = (r+g+b)/3
      let charIndex = floor(map(brightness, 0, 255, 0, chars.length))
      
      fill(r, g, b)
      text(chars[charIndex], x*scale + scale/2, y*scale + scale/2)
      index+=4  
    }
  }
  cam.updatePixels()
}