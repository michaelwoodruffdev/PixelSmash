//think of this as the client side, objects like the origin which are made in this file will not be shared among all players.  Rather, only this player will have this one origin, so he can be attached to it and rotate around it

var config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  } 
};
 
var game = new Phaser.Game(config);
var pngPath = "/assets/Guy.png";
 
function preload() {
    this.load.image('star', 'temp/star_gold.png');
    this.load.image('cowboy', pngPath);
    console.log(pngPath);
    //add object for enemy players
    this.load.image('otherPlayer', pngPath);
}

//create holds event listeners
function create() {
    var self = this;
    this.socket = io();
    
    this.socket.on('playerMoved', function(playerInfo){
        self.otherPlayers.getChildren().forEach(function (otherPlayer) {
            if(playerInfo.playerId == otherPlayer.playerId){
                otherPlayer.setRotation(playerInfo.rotation);
                otherplayer.setPosition(playerInfo.x, playerInfo.y);
            }
        });
    });
    
    //this listens for the currentPlayers function
    this.socket.on('currentPlayers', function (players) { 
        //loop through all players to see if players id matches current players socket id
        //objecct.keys makes array of all keys from passed in object
        Object.keys(players).forEach(function (id) {//for each makes the loop
            if (players[id].playerId === self.socket.id){
                addPLayer(self, players[id]);
            } else {//if player is not the current player
                addOtherPlayers(self, players[id]);
            }
        });
    });
    //on event newPlayer, call addOtherPlayers
    this.socket.on('newPlayer', function (playerInfo){
        addOtherPlayers(self, playerInfo);//this adds new player on user connection
    });
    this.socket.on('disconnect', function (playerId){
        //getChildren returns array of all game objects in that group, loop through this array with the forEach
        self.otherPlayers.getChildren().forEach(function (otherPlayer) {//remove player from game on disconnect
            if(playerId === otherPlayer.playerId) {
                otherPlayer.destroy();//remove object
            }
        });
    });
    //populates cursor objectt with for movement keys
    this.cursors = this.input.keyboard.createCursorKeys();
    
    //star logic for client
    //making the text fields here
    this.blueScoreText = this.add.test(16,16, '', { fontSize: '32px', fill: '#0000FF'});
    this.redScoreText = this.add.test(584, 16, '', { fontSize: '32px', fill: '#FF0000'});
    
    //when score is updated, update text above
    this.socket.on('scoreUpdate', function (scores){
        //set text updates the game objects
        self.blueScoreText.setText('Blue: ' + scores.blue);
        self.redScoreText.setText('Red: ' + scores.red);
    });
    
    //listener for star location
    this.socket.on('starLocation', function (starLocation){
        if(self.star) self.star.destroy();//destroy if it exists
        //add new object to the game, populate its info
        self.star = self.physics.add.image(starLocation.x, starLocation.y, 'star');
        
        //THIS CHECKS OBJECT COLLISION
        //run star collected if collision with player
        self.physics.add.overlap(self.ship, self.star, function () {
            this.socket.emit('starCollected');
        }, null, self);
        });
    })
}
 
function update() {
    //adding keyboard inputs
    if(this.ship)
    {//if left or right is pressed, rotate ship
        if (this.cursors.left.isDown) {
            this.ship.setAngularVelocity(-150);
        }else if (this.cursors.right.isDown) {
            this.ship.setAngularVelocity(150);
        } else {
            this.ship.setAngularVelocity(0);
        }
        
        if(this.cursors.up.isDown){//go fast if up is pressed
            this.physics.velocityFromRotation(this.ship.rotation + 1.5, 100, this.ship.body.acceleration);
            }
        else {//if no key is pressed, velocity is 0
            this.ship.setAcceleration(0);
        }
        //running off the edge makes you appear on the other side
        this.physics.world.wrap(this.ship, 5);
        
        //tracking movement of other players
        var x = this.ship.x;
        var y = this.ship.y;
        var r = this.ship.rotation;
        
        //this if compares old position of other players to current position, if a change has occured, emit player movement and alter the player's position
        if(this.ship.oldPosition && (x !== this.ship.oldPosition.x || y !== this.ship.oldPosition.y || r !== this.ship.oldPosition.rotation)) {
            this.socket.emit('playerMovement', {x: this.ship.x, y: this.ship.y, rotation: this.ship.rotation});
        }
        
        //save old position data
        this.ship.oldPosition = {
            x: this.ship.x,
            y: this.ship.y,
            rotation: this.ship,rotation};
        }
    }


function addPlayer(self,playerInfo){
    //using self.physics.add allows game object to use arcade physics
    //used setOrigin to set origin in middle of object
    //setDisplaySize sets size of object
    self.cowboy = self.physics.add.image(playerInfo.x, playerInfo.y, 'cowboy').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
    if(playerInfo.team == 'blue'){
        self.cowboy.setTint(0x0000ff);
    } else {
        self.cowboy.setTint(0xff0000);
    }//these are physics variables
    self.cowboy.setDrag(100);
    self.cowboy.setAngularDrag(100);
    self.cowboy.setMaxVelocity(200);
}

//this is the same as addPlayer but this adds the other players
function addOtherPlayers(self, playerInfo) {
    const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'otherPlayer').setOrigin(0.5, 0.5).setDisplaySize(53,  40);
    if(playerInfo.team === 'blue') {
        otherPlayer.setTint(0x000ff);
    } else {
        otherPlayer.setTin(0xff0000);
    }
    otherPlayer.playerId = playerInfo.playerId;
    self.otherPlayers.add(otherPlayer);
}