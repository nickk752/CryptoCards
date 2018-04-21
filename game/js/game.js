/**
 * The Main Game Object, extends Phaser.State
 * Uses structures from datastructures.js to represent 
 * the game state, and uses the Client obj to communicate
 * back and forth with the server.  
 * 
 * IN THIS FILE THE PLAYER (you) IS ALWAYS PLAYER 1 (if it comes up)
 */

var Game = {};

//called first, before preload
Game.init = function(){
	game.stage.disableVisibilityChange = true;
	game.scale.pageAlignHorizontally = true;
	game.scale.pageAlignVertically = true;
};

//called after preload and before create()
Game.preload = function() {
	//load in the tilemap and spritesheet it
    game.load.tilemap('map', 'assets/map/desktop_board_map4.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.spritesheet('tileset', 'assets/map/gameboard_tilesheet.png',32,32);
	//load in all the other assets
	game.load.image('blank_card_sprite','assets/sprites/blank_card_sprite.png');
	game.load.image('creaturezone_sprite','assets/sprites/creaturezone_sprite.png');
	game.load.image('buildingzone_sprite','assets/sprites/buildingzone_sprite.png');
	game.load.image('endturnbutton_sprite','assets/sprites/endturnbutton_sprite.png');
	game.load.image('yourturnbanner_sprite', 'assets/sprites/yourturn_sprite.png');
};

// called after preload, right before we enter the main loop
// since we all callbacks now, it's here where we set up most
// of our logic, create game state and whatnot
Game.create = function(){

	//Game.deck = {};
	//Game.deck2 = {};
	//Game.hand = {count: 0};

	//we need to do this for dragging (i think?) - tim
	game.physics.startSystem(Phaser.Physics.ARCADE);

	//adding our map to the background
	var map = game.add.tilemap('map');
	// tilesheet is the key of the tileset in map's JSON file
	map.addTilesetImage('gameboard_tilesheet', 'tileset'); 
	//our map only has 1 layer for now
    var layer;
    for(var i = 0; i < map.layers.length; i++) {
        layer = map.createLayer(i);
	}
	// Allows clicking on the map ; it's enough to do it on the last layer
	layer.inputEnabled = true; 
	//create the zone and ref sprites
	//var refZones = createZoneSprites();
	//Game.player.associateRefZones(refZones.playerZones);
	//Game.opponent.associateRefZones(refZones.opponentZones);

	//create the end turn button
	Game.endTurnButton = game.add.button(25*32 , 13 * 32, 'endturnbutton_sprite', Game.onEndTurnPressed);

	//Load our deck from JSON
	Game.cardList = [].concat(DeckLoader.loadDeck());
	console.log("local First Cards name: " + Game.cardList[0].name);
};

//gets called by Client when Lobby tries to join a game (when we know our name and deck and gameId)
Game.createPlayer = function(name, deck){
	console.log("createplayer");
	Game.player = new Player(name, deck);
	console.log(Game.player);
};

Game.startNextTurn = function(){
	console.log("in Game.startNextTurn");
	//here we should do all the start of turn checks and effects
	//start by flashing up the "its your turn" banner
	var yourTurnBanner = game.add.sprite(9 * 32, 6 * 32, 'yourturnbanner_sprite');
	game.add.tween(yourTurnBanner).to({alpha: 0}, 2000, null, true, 500);
	//and re-enabling interactivity 


};

Game.onEndTurnPressed = function(){
	//here we should do all the end of turn checks and effects

	//and then disable interaction until it's our turn again

	//tell the server we're done.
	Client.sendEndTurn();
};

// called by Client when the server tells us we've found a match
// passes us a name to call our opponent, and a deck to use as 
// their card list
Game.addOpponent = function(name, deck){
	//in here we need to set up our opponents state, generate their card list
	//and also perform other start game actions, or cause them to be performed
	//stuff like making bases and the two resource buildings, etc.
	Game.opponent = new Opponent(name, deck);
	//console.log("Opponents name: " + Game.opponent.name);
	//console.log("Opponents 4th card name: " + deck[3].name);
	//setUpDeck();
	//drawCards(8);
};

//creates invisible sprites that represent any zones we might have to check
//collision with, used as reference to tell the Pile subclasses where to 
//render themselves. This should also be the point of seperation for mobile,
//so we should check somehow to see if we're on mobile and then create the 
//zones in different places?
RefZones = function(){
	//have to look up how to check which platform we're on.
	//if (desktop){
	//	doZonesForDesktop
	//} else {
	//	doZonesForAndroid
	//}
	this.opponentZones = {
		graveyard: null,
		hand: null,
		deck: null,
		leftLane: [],
		rightLane: [],
		buildings: [],
	};

	this.playerZones = {
		graveyard: [],
		hand: [],
		deck: [],
		leftLane: [],
		rightLane: [],
		buildings: [],
	}

	//assign the singletons (deck, graveyard)
	this.playerZones.deck.push(game.add.sprite(25*32, 18*32, 'creaturezone_sprite'));
	this.playerZones.graveyard.push(game.add.sprite(25*32, 14*32, 'creaturezone_sprite'));

	for (var i = 0; i < 4; i++){
		//assign the players lanes
		this.playerZones.leftLane.push(game.add.sprite(0+(32*3*i), 320, 'creaturezone_sprite'));
		this.playerZones.rightLane.push(game.add.sprite(416+(32*3*i), 320, 'creaturezone_sprite'));
		//assign the opponents lanes
		this.opponentZones.leftLane.push(game.add.sprite(416+(32*3*i), 128, 'creaturezone_sprite'));
		this.opponentZones.rightLane.push(game.add.sprite(0+(32*3*i), 128, 'creaturezone_sprite'));
	}

	for (var j = 0; j < 5; j++){
		//assign the building zones
		this.playerZones.buildings.push(game.add.sprite(0+(32*5*j), 14*32, 'buildingzone_sprite'));
		this.opponentZones.buildings.push(game.add.sprite(0+(32*5*j), 0, 'buildingzone_sprite'));
	}
		/*
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
		*/
};

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

		Game.deck2[i] = {
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
};

drawCards = function(numCards){
	for (var i = 0; i < numCards; i++){
		var deckIndex = Game.deck.curr + i;
		//CHECK TO SEE IF YOU'VE OVEDRAWN
		Game.deck[deckIndex].sprite = game.add.sprite(0,0,'blank_card_sprite');
		Game.deck[deckIndex].sprite.nameText = game.add.text(11, 63, Game.deck[deckIndex].name, {font: "12px Arial", fill: "#000000"});
		Game.deck[deckIndex].sprite.atkText = game.add.text(4, 113, Game.deck[deckIndex].atk, {font: "14px Arial", fill: "#000000"});
		Game.deck[deckIndex].sprite.defText = game.add.text(80, 113, Game.deck[deckIndex].def, {font: "14px Arial", fill: "#000000"});
		Game.deck[deckIndex].sprite.lcostText = game.add.text(7, 1, Game.deck[deckIndex].lcost, {font: "12px Arial", fill: "#000000"});
		Game.deck[deckIndex].sprite.mcostText = game.add.text(37, 1, Game.deck[deckIndex].mcost, {font: "12px Arial", fill: "#000000"});
		Game.deck[deckIndex].sprite.rcostText = game.add.text(74, 1, Game.deck[deckIndex].rcost, {font: "12px Arial", fill: "#000000"});

		Game.deck[deckIndex].sprite.addChild(Game.deck[deckIndex].sprite.nameText);
		Game.deck[deckIndex].sprite.addChild(Game.deck[deckIndex].sprite.atkText);
		Game.deck[deckIndex].sprite.addChild(Game.deck[deckIndex].sprite.defText);
		Game.deck[deckIndex].sprite.addChild(Game.deck[deckIndex].sprite.lcostText);
		Game.deck[deckIndex].sprite.addChild(Game.deck[deckIndex].sprite.mcostText);
		Game.deck[deckIndex].sprite.addChild(Game.deck[deckIndex].sprite.rcostText);

		Game.deck[deckIndex].sprite.inputEnabled = true;
		Game.deck[deckIndex].sprite.input.enableDrag();
		Game.deck[deckIndex].sprite.events.onDragStop.add(onDragStop, this);
		Game.deck[deckIndex].sprite.alignIn(Game.zoneSprites.deck, Phaser.CENTER, 0, 0);
		Game.deck[deckIndex].sprite.dindex = deckIndex;

		//var handBounds = Game.zoneSprites.hand[Game.hand.count+i].getBounds();
		//var cardBounds = Game.deck[deckIndex].sprite.getBounds();

		Game.deck[deckIndex].sprite.moveTo = function(zone, deckIndex){
			var cardBounds = Game.deck[deckIndex].sprite.getBounds();
			var zoneBounds = zone.getBounds();
			var distance = Phaser.Math.distance(zoneBounds.x,zoneBounds.y,cardBounds.x,cardBounds.y);
	    	var tween = game.add.tween(Game.deck[deckIndex].sprite);
	    	var duration = distance*2;
	    	tween.to({x:zoneBounds.x,y:zoneBounds.y}, duration);
	    	tween.start();
		}
		Game.deck[deckIndex].sprite.home = Game.zoneSprites.hand[Game.hand.count+i];
		Game.deck[deckIndex].sprite.moveTo(Game.zoneSprites.hand[Game.hand.count+i], deckIndex);
    //var distance = Phaser.Math.distance(handBounds.x,handBounds.y,cardBounds.x,cardBounds.y);
    //var tween = game.add.tween(Game.deck[deckIndex].sprite);
    //var duration = distance*5;
    //tween.to({x:handBounds.x,y:handBounds.y}, duration);
    //tween.start();
	}
	Game.deck.curr += numCards;
	Game.hand.count += numCards;
}

function onDragStop(sprite, pointer) {
	for (var i = 0; i < 4; i++){
		var zone = Game.zoneSprites.crt.p1.lane1[i];
		if (Phaser.Rectangle.contains(zone.getBounds(), sprite.centerX, sprite.centerY)) {
				sprite.home = zone;
				sprite.homeName = "p1crtl1" + i;

		} else {
			zone = Game.zoneSprites.crt.p1.lane2[i];
			if (Phaser.Rectangle.contains(zone.getBounds(), sprite.centerX, sprite.centerY)) {
					sprite.home = zone;
					sprite.homeName = "p1crtl2" + i;

			} else {
				zone = Game.zoneSprites.crt.p2.lane2[i];
				if (Phaser.Rectangle.contains(zone.getBounds(), sprite.centerX, sprite.centerY)) {
					sprite.home = zone;
					sprite.homeName = "p2crtl2" + i;

				} else {
					zone = Game.zoneSprites.crt.p2.lane1[i];
					if(Phaser.Rectangle.contains(zone.getBounds(), sprite.centerX, sprite.centerY)){
						sprite.home = zone;
						sprite.homeName = "p2crtl1" + i;
					}
				}
			}
		}
	}
	for (var i = 0; i < 5; i++){
		zone = Game.zoneSprites.bld.p1[i];
		if (Phaser.Rectangle.contains(zone.getBounds(), sprite.centerX, sprite.centerY)){
			sprite.home = zone;
			sprite.homeName = "p1bld" + i;
		} else {
			zone =  Game.zoneSprites.bld.p2[i];
			if (Phaser.Rectangle.contains(zone.getBounds(), sprite.centerX, sprite.centerY)){
				sprite.home = zone;
				sprite.homeName = "p2bld" + i;

			}
		}
	}
	sprite.moveTo(sprite.home, sprite.dindex);
	//Client.sendMovedCard(sprite.dindex,sprite.homeName);
}

Game.placeCard = function(dindex, homeName) {
	var deckIndex = dindex;
	Game.deck2[deckIndex].sprite = game.add.sprite(0,0,'blank_card_sprite');
	Game.deck2[deckIndex].sprite.nameText = game.add.text(11, 63, Game.deck[deckIndex].name, {font: "12px Arial", fill: "#000000"});
	Game.deck2[deckIndex].sprite.atkText = game.add.text(4, 113, Game.deck[deckIndex].atk, {font: "14px Arial", fill: "#000000"});
	Game.deck2[deckIndex].sprite.defText = game.add.text(80, 113, Game.deck[deckIndex].def, {font: "14px Arial", fill: "#000000"});
	Game.deck2[deckIndex].sprite.lcostText = game.add.text(7, 1, Game.deck[deckIndex].lcost, {font: "12px Arial", fill: "#000000"});
	Game.deck2[deckIndex].sprite.mcostText = game.add.text(37, 1, Game.deck[deckIndex].mcost, {font: "12px Arial", fill: "#000000"});
	Game.deck2[deckIndex].sprite.rcostText = game.add.text(74, 1, Game.deck[deckIndex].rcost, {font: "12px Arial", fill: "#000000"});

	Game.deck2[deckIndex].sprite.addChild(Game.deck[deckIndex].sprite.nameText);
	Game.deck2[deckIndex].sprite.addChild(Game.deck[deckIndex].sprite.atkText);
	Game.deck2[deckIndex].sprite.addChild(Game.deck[deckIndex].sprite.defText);
	Game.deck2[deckIndex].sprite.addChild(Game.deck[deckIndex].sprite.lcostText);
	Game.deck2[deckIndex].sprite.addChild(Game.deck[deckIndex].sprite.mcostText);
	Game.deck2[deckIndex].sprite.addChild(Game.deck[deckIndex].sprite.rcostText);

	Game.deck2[deckIndex].sprite.inputEnabled = true;
	Game.deck2[deckIndex].sprite.input.enableDrag();
	Game.deck2[deckIndex].sprite.events.onDragStop.add(onDragStop, this);

	Game.deck2[deckIndex].sprite.moveTo = function(zone, deckIndex){
		var cardBounds = Game.deck2[deckIndex].sprite.getBounds();
		var zoneBounds = zone.getBounds();
		var distance = Phaser.Math.distance(zoneBounds.x,zoneBounds.y,cardBounds.x,cardBounds.y);
		var tween = game.add.tween(Game.deck[deckIndex].sprite);
		var duration = distance*2;
		tween.to({x:zoneBounds.x,y:zoneBounds.y}, duration);
		tween.start();
	}
	switch (homeName) {
		case 'p1crtl10':
			zone = Game.zoneSprites.crt.p2.lane1[0];
			break;
		case 'p1crtl11':
			zone = Game.zoneSprites.crt.p2.lane1[1];
			break;
		case 'p1crtl12':
			zone = Game.zoneSprites.crt.p2.lane1[2];
			break;
		case 'p1crtl13':
			zone = Game.zoneSprites.crt.p2.lane1[3];
			break;

		case 'p1crtl20':
			zone = Game.zoneSprites.crt.p2.lane2[0];
			break;
		case 'p1crtl21':
			zone = Game.zoneSprites.crt.p2.lane2[1];
			break;
		case 'p1crtl22':
			zone = Game.zoneSprites.crt.p2.lane2[2];
			break;
		case 'p1crtl23':
			zone = Game.zoneSprites.crt.p2.lane2[3];
			break;

		case 'p2crtl10':
			zone = Game.zoneSprites.crt.p1.lane1[0];
			break;
		case 'p2crtl11':
			zone = Game.zoneSprites.crt.p1.lane1[1];
			break;
		case 'p2crtl12':
			zone = Game.zoneSprites.crt.p1.lane1[2];
			break;
		case 'p2crtl13':
			zone = Game.zoneSprites.crt.p1.lane1[3];
			break;


		case 'p2crtl20':
			zone = Game.zoneSprites.crt.p1.lane2[0];
			break;
		case 'p2crtl21':
			zone = Game.zoneSprites.crt.p1.lane2[1];
			break;
		case 'p2crtl22':
			zone = Game.zoneSprites.crt.p1.lane2[2];
			break;
		case 'p2crtl23':
			zone = Game.zoneSprites.crt.p1.lane2[3];
			break;

		case 'p1bld0':
			zone = Game.zoneSprites.bld.p2[0];
			break;
		case 'p1bld1':
			zone = Game.zoneSprites.bld.p2[1];
			break;
		case 'p1bld2':
			zone = Game.zoneSprites.bld.p2[2];
			break;
		case 'p1bld3':
			zone = Game.zoneSprites.bld.p2[3];
			break;
		case 'p1bld4':
			zone = Game.zoneSprites.bld.p2[4];
			break;

		case 'p2bld0':
			zone = Game.zoneSprites.bld.p1[0];
			break;
		case 'p2bld1':
			zone = Game.zoneSprites.bld.p1[1];
			break;
		case 'p2bld2':
			zone = Game.zoneSprites.bld.p1[2];
			break;
		case 'p2bld3':
			zone = Game.zoneSprites.bld.p1[3];
			break;
		case 'p2bld4':
			zone = Game.zoneSprites.bld.p1[4];
			break;

	}

	Game.deck2[deckIndex].sprite.dindex = deckIndex;
	Game.deck2[deckIndex].sprite.moveTo(zone, deckIndex);
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
