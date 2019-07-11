let canvasWidth = 750;

let minutes = 0;
let seconds = 0;
let counter = 0;
let finalTime;

let gamePoints = 0;

let playerImg;
let player;
let lasers = [];

let hits = 0;

let obstacles = [];
let obstacleSpeed = 3;

let heartImg;
let hearts = [heartImg, heartImg, heartImg];

let randomNum;

function percentOf(pCent, num){
  return num/100*pCent;
}

function drawGameTimer(){
  let time;

  if (Math.trunc(millis())/1000 > counter){
    counter+=1;
    seconds+=1;
  }

  if (seconds >= 60){
    minutes += 1;
    seconds = 0;
  }

  time = minutes+":"+seconds;
  finalTime = minutes*60 + seconds;

  textSize(percentOf(3, window.innerHeight));
  noStroke();
  fill(255,255,255);
  text("Time: "+time, percentOf(1.5, canvasWidth), percentOf(8, window.innerHeight));
}

function drawGamePoints(){
  textSize(percentOf(3, window.innerHeight));
  noStroke();
  fill(255,255,255);
  text("Points: "+ gamePoints, percentOf(1.5, canvasWidth), percentOf(4.5, window.innerHeight));
}

function endGameScreen(){
  textSize(percentOf(11, window.innerHeight));
  noStroke();
  fill(255,255,255);
  text("GAME OVER!", percentOf(6, canvasWidth), percentOf(30, window.innerHeight));

  textSize(percentOf(3, window.innerHeight));
  noStroke();
  fill(255,255,255);
  text("Points: "+ gamePoints, percentOf(40, canvasWidth), percentOf(35, window.innerHeight));
  text("Time: "+ finalTime+"s", percentOf(40, canvasWidth), percentOf(39, window.innerHeight));
  text("Final Score: "+ Math.trunc(gamePoints/finalTime*100), percentOf(40, canvasWidth), percentOf(43, window.innerHeight));

  textSize(percentOf(4, window.innerHeight));
  noStroke();
  fill(255,255,255);
  text("Reload the Page to Play Again...", percentOf(16, canvasWidth), percentOf(50, window.innerHeight));
}

function drawHearts(){
  if (hits === 1){
    hearts[0] = brokenHeartImg
  } else if (hits === 2){
    hearts[1] = brokenHeartImg;
  } else if (hits === 03){
    hearts[2] = brokenHeartImg;
    noLoop();
    endGameScreen();
  }

  image(hearts[0], percentOf(86, canvasWidth), percentOf(1.5, window.innerHeight), 35, 35);
  image(hearts[1], percentOf(93, canvasWidth), percentOf(1.5, window.innerHeight), 35, 35);
  image(hearts[2], percentOf(89.5, canvasWidth), percentOf(5.5, window.innerHeight), 35, 35);
}

function preload(){
  playerImg = loadImage("Assets/flyingSaucer.png");
  laserImg = loadImage("Assets/fireEmoji.png");
  earthImg = loadImage("Assets/earthEmoji.png");
  heartImg = loadImage("Assets/heartEmoji.png");
  brokenHeartImg = loadImage("Assets/brokenHeartEmoji.png");
  backgroundImg = loadImage("Assets/starsBackground.png");
  hearts = [heartImg, heartImg, heartImg];
}

function setup(){
  createCanvas(750 , window.innerHeight);
  background(backgroundImg);
  player = new playerObject();
  lasers.push(new laserObject());
  obstacles.push(new obstacleObject(obstacleSpeed));
}

function draw(){
  createCanvas(canvasWidth , window.innerHeight);
  background(backgroundImg);

  randomNum = random(0,2);

  for (let i = 0; i < lasers.length; i++){
    lasers[i].show();
    lasers[i].move();
  }

  for (let i = 0; i < obstacles.length; i++){
    obstacles[i].show(randomNum);
    obstacles[i].move();
  }

  drawHearts();

  player.show();

  //Dynamically positions time and score text
  drawGamePoints();
  drawGameTimer();

  //Dynamicly positions white line one
  let whiteLineOneY = percentOf(80, window.innerHeight);
  stroke(255,255,255);
  line(0, whiteLineOneY, canvasWidth,  whiteLineOneY);

  //Dynamicaly positions white line two
  let whiteLineTwoY = percentOf(10, window.innerHeight);
  stroke(255,255,255);
  line(0, whiteLineTwoY, canvasWidth,  whiteLineTwoY);

  if (keyIsDown(65)){
    //rint(player.x);
    player.left();
    }
  if (keyIsDown(68)){
    //print(player.x)
    player.right();
  }

  if (lasers[lasers.length-1].y < whiteLineOneY){
    if(keyIsDown(87)){
      print("Player is shooting");
      lasers.push(new laserObject());
    }
  }

  if (lasers.length >  1){
    if (lasers[0].y <  whiteLineTwoY){
      lasers.splice(0,1)
    }
  }

  if (obstacles.length >  1){
    if (obstacles[0].y > window.innerHeight + obstacles.width){
      obstacles.splice(0,1)
    }
  }

  //Creates new earth object when the previous object hits the white line
  if (obstacles[obstacles.length-1].y > whiteLineTwoY){
    obstacles.push(new obstacleObject(obstacleSpeed, randomNum));
  }

  //Detects obsacles being hit with lasers and reduces thier size or desroys them.
  for (let i = 0; i < lasers.length; i++){
    for (let j = 0; j < obstacles.length; j++){
      if (lasers[i].isHit(obstacles[j])){
        obstacles[j].width = obstacles[j].width - 5
        obstacles[j].height = obstacles[j].height - 5
        obstacles[j].x = obstacles[j].x + 2.5
        obstacles[j].y = obstacles[j].y + 2.5

        if (obstacles[j].height < 75){
          if (obstacles.length >  1){
            image(laserImg, obstacles[j].x-5, obstacles[j].y-5, 75, 75);
            obstacleSpeed += 0.25;
            player.speed += 0.125;
            obstacles.splice(0,1)
            gamePoints += 1;

          }
        }
      }
    }
  }

  //Detects if player is hit.
  for (let i = 0; i < obstacles.length; i++){
    if(player.isHit(obstacles[i])){
      obstacles.splice(obstacles[i],1);
      hits += 1;
    }
  }


}

class playerObject{
  constructor(s){
    this.x = canvasWidth/2;
    this.y = percentOf(90, window.innerHeight);
    this.width = 75;
    this.height = 75;
    this.speed = 9;
  }

  show(){
    image(playerImg, this.x-this.width/2, this.y-this.width/2, this.width, this.height);
  }

  left(){
    if (player.x >= 1){
      this.x = this.x - this.speed;
    }
  }

  right(){
    if (player.x + this.width <= canvasWidth-1){
      this.x = this.x + this.speed;
    }
  }

  isHit(obst){
    let d = dist(this.x, this.y, obst.x, obst.y);
    if (d < this.height/2 + obst.height/2){
      return true;
    } else{
      return false;
    }
  }

}

class laserObject{
  constructor(){
    this.x = player.x;
    this.y = player.y;
    this.width = 20;
    this.height = 40;
    this.speed = 11;
    return this
  }

  show(){
    image(laserImg, this.x, this.y, this.width, this.height);
    return this
  }

  move(){
    this.y = this.y - this.speed;
    return this
  }

  isHit(obst){
    let d = dist(this.x, this.y, obst.x, obst.y);
    if (d < this.height/2 + obst.height/2){
      return true;
    } else{
      return false;
    }
  }

}

class obstacleObject{
  constructor(s, w, h){
    this.x = random(0,canvasWidth);
    this.y = -500;
    this.width = 150;
    this.height = 150;
    this.speed = s;
    this.type = random(0,2);
  }

  show(){
    image(earthImg, this.x, this.y, this.width, this.height);
  }

  move(){
    this.y = this.y + this.speed;
  }
}
