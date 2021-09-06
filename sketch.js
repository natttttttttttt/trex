var trex, trex_running, edges;
var groundImage, ground, invisibleground;
var nube, cloudImage;
var sun, sunImage;
var luna, lunaImage;
var restart, restartI, gameover, gameoverI;

var obstaculo, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;

var num, nom;
var score = 0;
var ave, ave1, ave2;
var obstaclesGroup, cloudsGroup, aveGroup;
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var DIA = 1;

var trexcollided;

var checkPointS, dieS, jumpS;

function preload(){
  trex_running = loadAnimation("trex_1.png","trex_2.png","trex_3.png");
  groundImage = loadImage("ground.png");
  cieloImage = loadImage("cielo.png");
  cloudImage = loadImage("cloud.png");
  sunImage = loadImage("sun.png");
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  ave1 = loadImage("ave1.png");
  ave2 = loadImage("ave2.png");
  lunaImage = loadImage("luna.png");
  trexcollided = loadAnimation("trex_collided.png");
  restartI = loadImage("restart.png");
  gameoverI = loadImage("gameOver.png")
  
  jumpS = loadSound("jump.mp3");
  dieS = loadSound("die.mp3");
  checkPointS = loadSound("checkPoint.mp3");
}


function setup(){
  createCanvas(600,200);
  
  //crea el sol
  sun = createSprite(500, 60, 20, 20);
  sun.addImage(sunImage);
  sun.scale = 0.15
  console.log(sun.depth);
  
  //crea el piso
  ground = createSprite(300, 200, 600, 20);
  ground.addImage(groundImage);
  
  //crea el Trex
  trex = createSprite(60,170,20,50);
  trex.addAnimation("running", trex_running);
  edges = createEdgeSprites();
  
  //añade escala y posición al Trex
  trex.scale = 0.1;
  trex.x = 50;
  
  //suelo invisble
  invisibleground = createSprite (100, 180, 300, 10);
  invisibleground.visible = false;
  
  //posición y escala del piso
  ground.y = 210
  ground.scale = 0.7
  
  trex.debug = true;
  trex.setCollider("circle", 0, 60, 20);
  
  trex.addAnimation("collided", trexcollided);
  
  //crea los grupos 
  obstaclesGroup = new Group();
  cloudsGroup = new Group(); 
  aveGroup = new Group();
  
  gameover = createSprite(300, 80, 20, 20);
  gameover.addImage(gameoverI);
  gameover.scale = 0.6;
  gameover.visible = false;
  
  restart = createSprite(300, 120, 10, 10);
  restart.addImage(restartI);
  restart.scale = 0.06;
  restart.visible = false;
  
}
   

function draw(){
  //establece un color de fondo 
  if(DIA === 1){
    background(cieloImage);
  }
   
  if(DIA === 2){
    noche();
  }
  
  //suelo continuo
  if(ground.x<0){
    ground.x = ground.width/4;
  }
  
  //evita que el Trex caiga
  //trex.collide(invisibleground);
  trex.collide(ground);
  
  //puntuación
  text("Puntuación: "+score, 500, 20);
  

  
  if(gameState === PLAY){
        
    //velocidad del suelo
    ground.velocityX = -(6+score/100);    
    
    //agrega la gravedad
    trex.velocityY = trex.velocityY + 0.8;
  
    //salta cuando se presiona la barra espaciadora
    if(keyDown("space")&&trex.y >= 100){
      trex.velocityY = -10;
      jumpS.play();
    }
  
    score = score + Math.round(frameCount/400);
    
    spawnClouds();
    crearobstauclo();
    
    
    if(frameCount%1000 === 0){
      crearave();
    }
    
    if(score%100 === 0 && score > 0){
      checkPointS.play();
      
    }
    
    if (frameCount%1500 === 0){
      DIA = 2;
      sun.visible = false;
      restart.depth = luna.depth;
      restart.depth = restart.depth+1;
    }
        
    if(obstaclesGroup.isTouching(trex)){
      gameState = END;
      dieS.play();
      
    }
    
  }
  else if(gameState === END){
    
    trex.velocityY = 0;
    ground.velocityX = 0;
    
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    aveGroup.setVelocityXEach(0);
    
    trex.velocityY = trex.velocityY + 0.8;
    
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    aveGroup.setLifetimeEach(-1);
    
    trex.changeAnimation("collided", trexcollided);
    
    restart.visible = true;
    gameover.visible = true;

     }

  if(mousePressedOver(restart)){
    reset();
  }
  
  //noche();
  drawSprites();
}

function spawnClouds(){
  
  if(frameCount%60 === 0){
    nube = createSprite(600, 100, 20, 20);
    nube.y = Math.round(random(10, 120));
    nube.velocityX = -3;
    nube.addImage(cloudImage);
    nube.scale = 0.5;
    //profundidad de los sprites
   
    trex.depth = nube.depth;
    trex.depth = trex.depth+1;
    sun.depth = nube.depth;
    sun.depth = sun.depth+1;
    nube.depth = nube.depth+1;
    
    nube.lifetime = 200;
    
    cloudsGroup.add(nube);
  } 
  
}

function crearobstauclo(){
  
  if(frameCount%120 === 0){
    obstaculo = createSprite(600, 160, 20, 40);
    obstaculo.velocityX = -(4+score/600);
    
    //obstaculos aleatorios
    num = Math.round(random(1,2));
    switch(num){
      case 1: obstaculo.addImage(obstaculo1);
        break;
    case 2: obstaculo.addImage(obstaculo2);
        break;
    case 3: obstaculo.addImage(obstaculo3);
        break;
    case 4: obstaculo.addImage(obstaculo4);
        break;
    default: break;
    }
    
    obstaculo.scale = 0.3;
    obstaculo.lifetime = 150;
    
    obstaclesGroup.add(obstaculo);
  }
}

function crearave(){
  if(frameCount%200 === 0){
    ave = createSprite(600, 100, 20, 20);
    ave.velocityX = -3;
    ave.y = Math.round(random(10, 130));
    
    nom = Math.round(random(1,2));
    switch(nom){
      case 1: ave.addImage(ave1);
        break;
      case 2: ave.addImage(ave2);
        break;
      default: break;
    }
    ave.scale = 0.1
    ave.lifetime = 200;
    ave.depth = sun.depth;
    ave.depth = ave.depth+1;
  
    aveGroup.add(ave);
  }
}

function noche(){
  background(0);
  luna = createSprite (300, 100, 40, 40);
  luna.addImage(lunaImage)
  luna.scale = 0.1;

  
  if(luna.x < width/2){
    luna.velocityY = 0.5;
  }
  
  if(luna.x < 0){
    luna.velocityX = 0;
    luna.velocityY = 0;
    luna.x = width;
  }

}

function reset(){
  gameState = PLAY;
  trex.changeAnimation("running", trex_running);
  gameover.visible = false;
  restart.visible = false;
  score = 0;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  aveGroup.destroyEach();
}
