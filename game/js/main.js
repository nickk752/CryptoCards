//noinspection JSCheckFunctionSignatures,JSCheckFunctionSignatures,JSCheckFunctionSignatures
var game = new Phaser.Game(28*32, 22*32, Phaser.AUTO, document.getElementById('game'));
game.state.add('Lobby',Lobby);
game.state.add('Game',Game);
game.state.start('Lobby');
