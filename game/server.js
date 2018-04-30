/**
 * The game server. Basically it just hooks up people into pairs
 * based on gameId, and then facilitates message passing between
 * them. 
 */

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/assets', express.static(__dirname + '/assets'));

<<<<<<< HEAD
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

server.lastPlayderID = 1;

server.listen(process.env.PORT || 8081, function () {
  console.log('Listening on ' + server.address().port);
});

io.on('connection', function (socket) {

  // here we should associate data and control with the passed Username
  socket.on('newplayer', function () {
    socket.player = {
      id: server.lastPlayderID++,
      x: randomInt(100, 400),
      y: randomInt(100, 400),
      cardsInHand: 0,
      BaseLife: 20,
      isTheirTurn: false,
      cardsInDeck: 25
    };
    socket.emit('allplayers', getAllPlayers());
    socket.broadcast.emit('newplayer', socket.player);

    socket.on('click', function (data) {
      console.log('click to ' + data.x + ', ' + data.y);
      socket.player.x = data.x;
      socket.player.y = data.y;
      io.emit('move', socket.player);

      //check to see if they've clicked a card in their hand "select it"

      //check to see if they've clicked a card on their side of the field " select it"
    });

    socket.on('disconnect', function () {
      io.emit('remove', socket.player.id);
    });
  });

  socket.on('test', function () {
    console.log('test received');
  });
});

function getAllPlayers() {
  var players = [];
  Object.keys(io.sockets.connected).forEach(function (socketID) {
    var player = io.sockets.connected[socketID].player;
    if (player) players.push(player);
  });
  return players;
}

function randomInt(low, high) {
  return Math.floor(Math.random() * (high - low) + low);
=======
//serve up our index.html file
app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

//spin up da server and listen on dat port boi, 8081 by default
server.listen(process.env.PORT || 8081,function(){
    console.log('Listening on '+server.address().port);
});

//everytime someone connects this gets called
//its in here that we set up all the other callbacks 
io.on('connection',function(socket){

    //when they send us a 'join' with data (name, gameID, deck)
    socket.on('join', function(data) {

        //set up their representation in the server as a "player" object
        //not to be confused with Player from datastructures, this is basically
        //just some metadata we stick onto a socket (we can put whatever we 
        //want to on the socket)
        socket.player = {
            name: data.name,
            gameId: data.gameId,
            deck: data.deck,
            isTheirTurn: false,
        };
        console.log("set player name to: " + socket.player.name);
        console.log("set player gameId to: " + socket.player.gameId);
        console.log("player's deck's 5th card name: " + socket.player.deck[4].name);
        console.log("and it's cost: " + socket.player.deck[4].cost);

        //going to be their opponents socket object
        //but when they join we just set it to be {}

        //try to find their opponent (if they've already connected)
        Object.keys(io.sockets.connected).forEach(function(socketID){
            var player = io.sockets.connected[socketID].player;
            if (player){
                //if they have the same GameID but a diff name, they're opponents
                if (player.gameId == socket.player.gameId && player.name != socket.player.name){
                    console.log("player gameID: " + player.gameId);
                    console.log("socket.player.name: " + socket.player.name);
                    socket.opponent = io.sockets.connected[socketID];
                    //gotta also set us as their opponent 
                    io.sockets.connected[socketID].opponent = socket;
                }
            }
        });
        
        //if we've found a match (both players with the same gameID joined)
        if (socket.opponent) {

            console.log("found a match");
            //send them down their opponents deck and ID and such
            socket.emit("matchFound", socket.opponent.player);
            socket.opponent.emit("matchFound", socket.player);
            
            //the person who joined first goes first
            socket.opponent.player.isTheirTurn = true;
            socket.player.isTheirTurn = false;        
        }

    //end on join
    });
    socket.on('ready', function(){
        console.log("got one ready");
        // start the game
        socket.opponent.emit('opponentReady')

        // tell the person who joined first it's their turn
        if (socket.player.isTheirTurn){
            console.log("saying it's your turn to start")
            socket.emit('itsYourTurn');
        }

        //when a player ends their turn 
        socket.on('endedMyTurn', function(data){
            console.log("ended turn");
            socket.player.isTheirTurn = false;
            socket.opponent.player.isTheirTurn = true;
            socket.opponent.emit("itsYourTurn");
            socket.emit("itsNotYourTurn");
        });

        socket.on('updatePlayerCard', function(data){
            console.log("updated Player's card");
            socket.opponent.emit('updateOppCard', data);
        });

        socket.on('updateOppCard', function(data){
            console.log("updated Opponents card");
            socket.opponent.emit('updatePlayerCard', data);
        });

        socket.on('updatePileState', function(data){
            console.log("in updatePileState");
            socket.opponent.emit('updatePileState', data);
        });

        //when a player knows they won
        socket.on("iWon", function(){
            socket.opponent.emit("youLost");
        });

        //when a player knows they lost
        socket.on("iLost", function(){
            socket.opponent.emit("youWon");
        });

    });
    
   
});

//does what it says on the tin
function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
>>>>>>> ad357c7eee8e74592d0de1911648da2e26d98867
}
