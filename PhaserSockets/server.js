//https://gamedevacademy.org/create-a-basic-multiplayer-game-in-phaser-3-with-socket-io-part-1/
var express = require('express');
var app = express();//this is an express object
var server = require('http').Server(app);//this makes express handle http requests
var io = require('socket.io').listen(server);

var players = {};

var star = {//star position
    x: Math.floor(Math.random() * 700) + 50,
    y: Math.floor(Math.random() * 500) + 50
};
var scores = {//team scores
    blue: 0,
    red: 0
};
}

app.use(express.static(__dirname + '/public'));//static is a built in express middleware
 
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');//set index as root page
});
 
//when event "connection" happens, print these messages
io.on('connection', function (socket) {
  console.log('a user connected');
    //this creates a new player and adds it to the players object
    players[socket.id] = {
        //player data gets stored in players object
        rotation: 0,//rotation x and y are position of player
        x: Math.floor(Math.random() * 700) + 50,
        y: Math.floor(Math.random() * 500) + 50,
        playerId: socket.id,//player ID stored here
        //random team placement
        team: (Math.floor(Math.random() * 2) == 0) ? 'red' : 'blue'
    };
    
    //send player object to the new player
    socket.emit('currentPLayers', players);//current players passes players object to the new player so people already in game appear in the new players game
    
    
    //these occur when new player enters mid game
    //send star to new player
    socket.emit('starLocation', star);
    //send current scores
    socket.emit('scoreUpdate', scores);
    
    //this tells current players when new player joins
    socket.broadcast.emit('newPlayer', players[socket.id]);
    //new player adds new player to the other players' games
    
    
    
  socket.on('disconnect', function () {
    console.log('user disconnected');
    //remove player from players object
    delete players[socket.id];
    
    //emit message to all players to remove this player
    io.emit('disconnect', socket.id);
  });
});

//when a player moves, update the player data
socket.on('playerMovement', function (movementData) {
    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;
    players[socket.id].rotation = movementData.rotation;
    //emit a message to all players about the player that moved
    socket.broadcast.emit('playerMoved', players[socket.id]);
});

//when star collected
socket.on('starCollected', function (){
    if(players[socket.id].team == 'red'){
        scores.red += 10;
    }   else {
        scores.blue += 10;
    }//make new star, update score and emit location of new star
    star.x = Math.floor(Math.random() * 700) + 50;
    star.y = Math.floor(Math.random() * 500) + 50;
    io.emit('starLocation', star);
    io.emit('scoreUpdate', scores);
});



//on server activation, this message will display the port
server.listen(8081, function () {
  console.log(`Listening on ${server.address().port}`);
});