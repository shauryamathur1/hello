var dog,sadDog,happyDog,garden,washroom, database;
var foodS,foodStock;
var fedTime,lastFed,currentTime;
var feed,addFood;
var foodObj;
var gameState,readState;

function preload(){
sadDog=loadImage("Images/Dog.png");
happyDog=loadImage("Images/happy dog.png");
garden=loadImage("Images/Garden.png");
washroom=loadImage("Images/Wash Room.png");
bedroom=loadImage("Images/Bed Room.png");
}

function setup() {
  database=firebase.database();
  createCanvas(400,500);
  
  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  //read game state from database
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
   
  dog=createSprite(200,400,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}

function draw() {

  if(foodS==0){
    dog.addImage(happyDog)
    milkBottle2.visible=false;
  }else{
    dog.addImage(sadDog);
    milkBottle2.visible=true;
  }
    if(gameState==1){
      Dog.addImage(happyDog);
      dog.scale=0.175;
      Dog.y=250;
    }
      if(gameState==2){
        Dog.addImage(sadDog);
        dog.scale=0.175;
        milkBottle2.visible=false;
        Dog.y=250;
  
        var Bath=createButton("I want to take bath");
        Bath.position(580,125);
      if(Bath.mousePressed(function(){
        gameState=3;
        database.ref('/').update({'gameState':gameState})
      }));
  
      var sleep=createButton("I am very sleepy");
      sleep.poition(710,125);
      if(sleep.mousePressed(function(){
      gameState=4;
      database.ref('/').update({'gameState':gameState})  
    }))
  
    var playGarden=createButton("Lets play in the park");
    PlayInGarden.position(585,160);
    if(playInGarden.mousePressed(function(){
      gameState=5;
      database.ref('/').update({'gameState':gameState});
    }))
    if(gameState===6){
      dog.y=175;
      dog.addImage(garden);
      dog.scale=1;
      milkBottle2.visiblee=false;
    }
  
    if(gameState==4){
      Dog.addImage(bedroom);
      dog.scale=1;
      milkBottle2.visible=false;
    }
    
    fedTime=database.ref('FeedTime');
    fedTime.on("value",function(data){
      lastFed=data.val();
    });
   
  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }
   
   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
   }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x){
  database.ref('/').update({
    food:x
  })
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

//update gameState
function update(state){
  database.ref('/').update({
    gameState:state
  })
}}