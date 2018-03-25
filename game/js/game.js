/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com

 IN THIS FILE "YOU" ARE ALWAYS PLAYER 1
 */

var Game = {};

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

Game.preload = function() {
    game.load.tilemap('map', 'assets/map/desktop_board_map4.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('tileset', 'assets/map/gameboard_tilesheet.png',32,32);
    game.load.image('sprite','assets/sprites/sprite.png');
		game.load.image('blank_card_sprite','assets/sprites/blank_card_sprite.png');
		game.load.image('creaturezone_sprite','assets/sprites/test_creaturezone_sprite.png');
		game.load.image('buildingzone_sprite','assets/sprites/test_buildingzone_sprite.png');
};

Game.create = function(){
    Game.playerMap = {};
		Game.deck = {};
		Game.hand = {count: 0};
		game.physics.startSystem(Phaser.Physics.ARCADE);
    var testKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    testKey.onDown.add(Client.sendTest, this);
    var map = game.add.tilemap('map');
    map.addTilesetImage('gameboard_tilesheet', 'tileset'); // tilesheet is the key of the tileset in map's JSON file
    var layer;
    for(var i = 0; i < map.layers.length; i++) {
        layer = map.createLayer(i);
    }

    layer.inputEnabled = true; // Allows clicking on the map ; it's enough to do it on the last layer
    layer.events.onInputUp.add(Game.getCoordinates, this);
		createZoneSprites();
    Client.askNewPlayer();
};

Game.getCoordinates = function(layer,pointer){
    Client.sendClick(pointer.worldX,pointer.worldY);
};

Game.addNewPlayer = function(id,x,y,player){
		Game.player2 = player;
    Game.playerMap[id] = game.add.sprite(x,y,'sprite');

		if (id == 2){
			setUpDeck();
			drawCards(8);
		}
};

Game.movePlayer = function(id,x,y){
    var player = Game.playerMap[id];
    var distance = Phaser.Math.distance(player.x,player.y,x,y);
    var tween = game.add.tween(player);
    var duration = distance*10;
    tween.to({x:x,y:y}, duration);
    tween.start();
};

Game.removePlayer = function(id){
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};

//creates invisible sprites that represent any zones we might have to check
//collision with.
createZoneSprites = function(){
		Game.zoneSprites = {
			//creatures
			crt: { p1: { lane1: {}, lane2: {}}, p2: {lane1: {}, lane2: {}}},
			//buildings
			bld: { p1: {}, p2: {}},
			hand: {}
		};
		for (var i = 0; i < 4; i++){
			Game.zoneSprites.crt.p1.lane1[i] = game.add.sprite(0+(32*3*i), 320, 'creaturezone_sprite');
			Game.zoneSprites.crt.p1.lane2[i] = game.add.sprite(416+(32*3*i), 320, 'creaturezone_sprite');
			Game.zoneSprites.crt.p2.lane2[i] = game.add.sprite(0+(32*3*i), 128, 'creaturezone_sprite');
			Game.zoneSprites.crt.p2.lane1[i] = game.add.sprite(416+(32*3*i), 128, 'creaturezone_sprite');
		}

		for (var j = 0; j < 5; j++){
			Game.zoneSprites.bld.p1[j] = game.add.sprite(0+(32*5*j), 14*32, 'buildingzone_sprite');
			Game.zoneSprites.bld.p2[j] = game.add.sprite(0+(32*5*j), 0, 'buildingzone_sprite');
		}

		for (var k = 0; k < 8; k++){
			Game.zoneSprites.hand[k] = game.add.sprite(0+(32*3*k), 18*32, 'creaturezone_sprite');
		}

		Game.zoneSprites.deck = game.add.sprite(25*32, 18*32, 'creaturezone_sprite');
		Game.zoneSprites.graveyard = game.add.sprite(25*32, 14*32, 'creaturezone_sprite');
}

setUpDeck = function(){
	Game.deck = {curr: 0}
	for (var i = 0; i < 25; i++){
		Game.deck[i] = {
			name: 'lil punchy',
			type: 'creature',
			lcost: 0, mcost: 1, rcost: 0,
			atk: 1, def: 1,
			traits: {
				lifesteal: false,
				taunt: false,
				charge: false
			}
		}
	}
}

drawCards = function(numCards){
	for (var i = 0; i < numCards; i++){
		var deckIndex = Game.deck.curr + i;
		//CHECK TO SEE IF YOU'VE OVEDRAWN
		Game.deck[deckIndex].sprite = game.add.sprite(0,0,'blank_card_sprite');
		Game.deck[deckIndex].nameText = game.add.text(11, 63, Game.deck[deckIndex].name, {font: "12px Arial", fill: "#000000"});
		Game.deck[deckIndex].atkText = game.add.text(4, 113, Game.deck[deckIndex].atk, {font: "14px Arial", fill: "#000000"});
		Game.deck[deckIndex].defText = game.add.text(80, 113, Game.deck[deckIndex].def, {font: "14px Arial", fill: "#000000"});
		Game.deck[deckIndex].lcostText = game.add.text(7, 1, Game.deck[deckIndex].lcost, {font: "12px Arial", fill: "#000000"});
		Game.deck[deckIndex].mcostText = game.add.text(37, 1, Game.deck[deckIndex].mcost, {font: "12px Arial", fill: "#000000"});
		Game.deck[deckIndex].rcostText = game.add.text(74, 1, Game.deck[deckIndex].rcost, {font: "12px Arial", fill: "#000000"});

		Game.deck[deckIndex].sprite.addChild(Game.deck[deckIndex].nameText);
		Game.deck[deckIndex].sprite.addChild(Game.deck[deckIndex].atkText);
		Game.deck[deckIndex].sprite.addChild(Game.deck[deckIndex].defText);
		Game.deck[deckIndex].sprite.addChild(Game.deck[deckIndex].lcostText);
		Game.deck[deckIndex].sprite.addChild(Game.deck[deckIndex].mcostText);
		Game.deck[deckIndex].sprite.addChild(Game.deck[deckIndex].rcostText);

		Game.deck[deckIndex].sprite.inputEnabled = true;
		Game.deck[deckIndex].sprite.input.enableDrag();
		Game.deck[deckIndex].sprite.alignIn(Game.zoneSprites.deck, Phaser.CENTER, 0, 0);

		var handBounds = Game.zoneSprites.hand[Game.hand.count+i].getBounds();
		var cardBounds = Game.deck[deckIndex].sprite.getBounds();

    var distance = Phaser.Math.distance(handBounds.x,handBounds.y,cardBounds.x,cardBounds.y);
    var tween = game.add.tween(Game.deck[deckIndex].sprite);
    var duration = distance*5;
    tween.to({x:handBounds.x,y:handBounds.y}, duration);
    tween.start();
	}
}
