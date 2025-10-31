let hearts = [];

class Heart{
  constructor(x,y){
    //define position
    this.x = x
    this.y = y
    
    //define variables
    this.size = random(30, 80);
    this.pulseSpeed = random(0.03, 0.1);
    this.pulseStart = 0;
    this.floatSpeed = random(0.5, 2);
    this.fadeSpeed = random(0.5, 2);
    
    //define color
    this.col = color(random(200, 255), random(50, 150), random(100, 200));
    this.opacity = 255;//renaming alpha here for better understanding
  }
  
  move(){
    //floating
    this.y -= this.floatSpeed //negative to go upward
    //pulsing
    this.pulseStart += this.pulseSpeed;
    //fading
    this.opacity -= this.fadeSpeed; 
  }
  
  display(){
    //individual frames using push & pop
    push();
    translate(this.x, this.y);
    
    //pulsing
    let pulse = sin(this.pulseStart)*0.3 + 1;
    let size = this.size * pulse;
    
    fill(red(this.col), green(this.col), blue(this.col), this.opacity);
    noStroke();
    
    //drawing heart, heart curve formula from AI
    beginShape();
    //angle goes from 0 to 360, increases by 0.1 radians
    for (let angle=0; angle<TWO_PI; angle+=0.1){
      let x = size*16*pow(sin(angle), 3); 
      let y = -size*(13*cos(angle) - 5*cos(2*angle) - 2*cos(3*angle) - cos(4*angle)); 
      vertex(x/16, y/16); //scale down the 16 in the formula
    }
    endShape(CLOSE);
    
    pop();
  }
  
  end(){
    //return when heart completely fades out
    return this.opacity <= 0;
  }
}


function setup(){
  createCanvas(windowWidth, windowHeight);
}

function draw(){
  background(0,10);
  
  //backward loop since I need to remove faded out hearts
  for (let i=hearts.length-1; i>=0; i--){
    hearts[i].move();
    hearts[i].display();
    
    if (hearts[i].end()){
      hearts.splice(i, 1);
    }
  }
}

function mousePressed(){
  hearts.push(new Heart(mouseX, mouseY));
}