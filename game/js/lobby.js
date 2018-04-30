/**
 * Lobby object, implements Phaser.State.
 * Collects the player's name and GameID, as well as possibly decklist? 
 * then starts the Game state.
 */

var Lobby = {};

Lobby.init = function(){
    game.stage.disableVisibilityChange = true;
    game.scale.pageAlignHorizontally = true;
	game.scale.pageAlignVertically = true;
};

Lobby.preload = function(){
    game.load.image('joingamebutton_sprite', 'assets/sprites/joingamebutton_sprite.png');
};

Lobby.create = function(){

    Lobby.joinGameButton = game.add.button(game.world.centerX , game.world.centerY, 'joingamebutton_sprite', Lobby.onJoinGamePressed);
    Lobby.joinGameButton.centerX = game.world.centerX;
    Lobby.joinGameButton.centerY = game.world.centerY;
};

Lobby.onJoinGamePressed = function(){
    //get our decklist
    var deckList = [].concat(DeckLoader.loadDeck());

    //get our name
    var nameEntry = document.getElementById('playerNameEntry');
    var name = nameEntry.value;
    //name = randomInt(1,1000);

    //get our gameId
    var gameIdEntry = document.getElementById('gameIDEntry');
    var gameId = gameIdEntry.value;
    //gameId = "12"

    //they have to enter a name to continue
    if (name == "" || gameId == ""){
        var style = { font: "bold 32px Arial", fill: "#f22" };
        Lobby.errorText = game.add.text(20, 20, "^Must Enter a Name and GameID to join", style);
    } else {
        //remove the error if it's there
        if (Lobby.errorText){
            Lobby.errorText.destroy();
        }

        //try to join the match
        Client.joinLobby(name, gameId, deckList);

        //put up a message if they're still around
        var style = { font: "bold 32px Arial", fill: "#2f2" };
        Lobby.waitText = game.add.text(20, 20, "Waiting for match...", style);
    }
};

Lobby.startGame = function(){
    //hide the entry form
    var form = document.getElementById('form');
    form.hidden = true;

    //start the game state
    game.state.start('Game');

}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}