/**
 * A client-side Client Abstraction for use in the Game object.
 * The Game uses this Client object to communicate with the server
 * as in Client.sendEndTurn() to tell the server you've ended your
 * turn. It also lets the server communicate with the game, using
 * similiar callbacks to the server and calling methods on the 
 * Game object.
 *  */

var Client = {};

//this is what calls on('connection') on the server
Client.socket = io.connect();

//call this to join the lobby, and either wait or get matched with an opponent
//who has the same GameId. NAMES MUST BE UNIQUE!
Client.joinLobby = function(name, gameId, deck){
    //tell the game to set up our player info.
    Game.createPlayer(name, deck);
    //and send a join with what that expects
    Client.socket.emit('join', {name: name, gameId: gameId, deck: deck});
};

Client.sendEndTurn = function(){
    Client.socket.emit('endedMyTurn');
};

//when both people with a certain gameId have joined the server
Client.socket.on('matchFound', function(data){

    Lobby.startGame();
    //tell the Game we've got our opponent, pass in their deck
    Game.addOpponent(data.name, data.deck);

    //when our opponent ends their turn
    Client.socket.on('itsYourTurn', function(){
        //tell the game to start a turn
        console.log("server said it's our turn");
        Game.startNextTurn()
    });

    //as a confirmation after we've ended our turn
    Client.socket.on('itsNotYourTurn', function(){
        //probably don't have to do anything, would've
        //set the Game to be 'unresponsive' when we called to 
        //end our turn
    });

    //we won (they lost)
    Client.socket.on('youWon', function(){
        //Game.displayWonScreen()?
    });

    //we lost (they won)
    Client.socket.on('youLost', function(){
        //Game.displayLostScreen()?
    });


//end on('matchFound')    
});

