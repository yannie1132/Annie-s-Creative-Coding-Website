// Configuration
const glitchColors = ['#2b4539', '#61dca3', '#61b3dc'];
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789';
const glitchSpeed = 50;
const smooth = true;

const fontSize = 16;
const charWidth = 10;
const charHeight = 20;

let letters = [];
let columns = 0;
let rows = 0;
let lastGlitchTime = 0;
let colorObjects = [];

// Define clickable links with their positions and text
// Define clickable links with their positions and text
const links = [
  { 
    text: 'ASCII CAMERA', 
    url: 'ASCIIcamera.html',
    x: 0, 
    y: 0,
    cols: 0,
    rows: 0
  },
  { 
    text: 'NOISE BLOCKS', 
    url: 'noiseblocks.html',
    x: 0, 
    y: 0,
    cols: 0,
    rows: 0
  },
  { 
    text: 'LIKES', 
    url: 'likes.html',
    x: 0, 
    y: 0,
    cols: 0,
    rows: 0
  },
];

let hoveredLink = null;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('monospace');
  textSize(fontSize);
  textAlign(LEFT, TOP);
  cursor(ARROW);
  
  colorObjects = glitchColors.map(hex => color(hex));
  
  initializeLetters();
  positionLinks();
  lastGlitchTime = millis();
}

function draw() {
  background(0);
  
  // Update letters periodically
  const now = millis();
  if (now - lastGlitchTime >= glitchSpeed) {
    updateLetters();
    lastGlitchTime = now;
  }
  
  // Handle smooth transitions
  if (smooth) {
    handleSmoothTransitions();
  }
  
  // Check which link is being hovered
  checkHover();
  
  // Draw all letters
  drawLetters();
  
  // Draw vignette
  drawVignette();
}



function mouseClicked() {
  if (hoveredLink) {
    window.location.href = hoveredLink.url;
  }
}

function positionLinks() {
  // Position links in a centered vertical layout
  const startY = height / 2 - (links.length * 60) / 2;
  
  links.forEach((link, index) => {
    link.cols = link.text.length;
    link.rows = 1;
    link.x = (width - link.cols * charWidth) / 2;
    link.y = startY + index * 60;
  });
}

function initializeLetters() {
  columns = Math.ceil(width / charWidth);
  rows = Math.ceil(height / charHeight);
  const totalLetters = columns * rows;
  
  letters = [];
  for (let i = 0; i < totalLetters; i++) {
    letters.push({
      char: getRandomChar(),
      color: getRandomColor(),
      targetColor: getRandomColor(),
      colorProgress: 1,
      isLinkChar: false,
      linkText: '',
      frozen: false
    });
  }
}

function getRandomChar() {
  return characters[Math.floor(Math.random() * characters.length)];
}

function getRandomColor() {
  return colorObjects[Math.floor(Math.random() * colorObjects.length)];
}

function checkHover() {
  hoveredLink = null;
  
  for (let link of links) {
    const linkLeft = link.x;
    const linkRight = link.x + link.cols * charWidth;
    const linkTop = link.y;
    const linkBottom = link.y + link.rows * charHeight;
    
    if (mouseX >= linkLeft && mouseX <= linkRight &&
        mouseY >= linkTop && mouseY <= linkBottom) {
      hoveredLink = link;
      cursor(HAND);
      break;
    }
  }
  
  if (!hoveredLink) {
    cursor(ARROW);
  }
}

function updateLetters() {
  const updateCount = Math.max(1, Math.floor(letters.length * 0.05));
  
  for (let i = 0; i < updateCount; i++) {
    const index = Math.floor(Math.random() * letters.length);
    const letter = letters[index];
    
    // Don't update if this is part of a hovered link
    if (letter.frozen) continue;
    
    letter.char = getRandomChar();
    letter.targetColor = getRandomColor();
    
    if (!smooth) {
      letter.color = letter.targetColor;
      letter.colorProgress = 1;
    } else {
      letter.colorProgress = 0;
    }
  }
}

function handleSmoothTransitions() {
  letters.forEach(letter => {
    if (letter.colorProgress < 1) {
      letter.colorProgress += 0.05;
      if (letter.colorProgress > 1) letter.colorProgress = 1;
      
      letter.color = lerpColor(letter.color, letter.targetColor, 0.05);
    }
  });
}

function getLetterIndex(x, y) {
  const col = Math.floor(x / charWidth);
  const row = Math.floor(y / charHeight);
  return row * columns + col;
}

function drawLetters() {
  // Reset all frozen states
  letters.forEach(letter => {
    letter.frozen = false;
  });
  
  // If hovering over a link, freeze those letters
  if (hoveredLink) {
    for (let i = 0; i < hoveredLink.text.length; i++) {
      const x = hoveredLink.x + i * charWidth;
      const y = hoveredLink.y;
      const index = getLetterIndex(x, y);
      
      if (index >= 0 && index < letters.length) {
        const letter = letters[index];
        letter.frozen = true;
        letter.char = hoveredLink.text[i];
        letter.color = color('#61dca3'); // Highlight color
      }
    }
  }
  
  // Draw all letters
  letters.forEach((letter, index) => {
    const x = (index % columns) * charWidth;
    const y = Math.floor(index / columns) * charHeight;
    
    fill(letter.color);
    noStroke();
    text(letter.char, x, y);
  });
}

function drawVignette() {
  const maxDist = dist(0, 0, width / 2, height / 2);
  
  for (let y = 0; y < height; y += 20) {
    for (let x = 0; x < width; x += 20) {
      const d = dist(x, y, width / 2, height / 2);
      const vignetteStrength = map(d, maxDist * 0.6, maxDist * 1.2, 0, 255, true);
      
      fill(0, vignetteStrength);
      noStroke();
      rect(x, y, 20, 20);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initializeLetters();
  positionLinks();
}
