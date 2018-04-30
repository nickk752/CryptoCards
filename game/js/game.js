/**
 * The Main Game Object, extends Phaser.State
 * Uses structures from datastructures.js to represent
 * the game state, and uses the Client obj to communicate
 * back and forth with the server
 *
 * IN THIS FILE THE PLAYER (you) IS ALWAYS PLAYER 1 (if it comes up)
 */

var Game = {};

// called first, before preload
Game.init = function () {
	game.stage.disableVisibilityChange = true;
	game.scale.pageAlignHorizontally = true;
	game.scale.pageAlignVertically = true;
};

// called after preload and before create()
Game.preload = function () {
	// load in the tilemap and spritesheet it
	game.load.tilemap('map', 'assets/map/desktop_board_map4.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.spritesheet('tileset', 'assets/map/gameboard_tilesheet.png', 32, 32);
	// load in all the other assets
	game.load.image('blank_card_sprite', 'assets/sprites/blank_card_sprite.png');
	game.load.image('creaturezone_sprite', 'assets/sprites/creaturezone_sprite.png');
	game.load.image('buildingzone_sprite', 'assets/sprites/buildingzone_sprite.png');
	game.load.image('endturnbutton_sprite', 'assets/sprites/endturnbutton_sprite.png');
	game.load.image('yourturnbanner_sprite', 'assets/sprites/yourturn_sprite.png');
	game.load.image('cardback_sprite', 'assets/sprites/cardback_sprite.png');
	game.load.image('resourcetracker_sprite', 'assets/sprites/resourcetracker_sprite.png');
	game.load.image('quitbutton_sprite', 'assets/sprites/quitbutton_sprite.png');
	game.load.image('winbanner_sprite', 'assets/sprites/winbanner_sprite.png');
	game.load.image('losebanner_sprite', 'assets/sprites/losebanner_sprite.png');
	game.load.spritesheet('leftresourcebar', 'assets/sprites/leftresourcebar_spritesheet.png', 24, 195, 10);
	game.load.spritesheet('midresourcebar', 'assets/sprites/midresourcebar_spritesheet.png', 24, 195, 10);
	game.load.spritesheet('rightresourcebar', 'assets/sprites/rightresourcebar_spritesheet.png', 24, 195, 10);

};

//  called after preload, right before we enter the main loop
//  since we all callbacks now, it's here where we set up most
//  of our logic, create game state and whatnot
//  by the time we get here, the Player and Opp have been created
Game.create = function () {

	// we need to do this for dragging (i think?) - tim
	game.physics.startSystem(Phaser.Physics.ARCADE);

	// adding our map to the background
	var map = game.add.tilemap('map');
	//  tilesheet is the key of the tileset in map's JSON file
	map.addTilesetImage('gameboard_tilesheet', 'tileset');
	// our map only has 1 layer for now
	var layer;
	for (var i = 0; i < map.layers.length; i++) {
		layer = map.createLayer(i);
	}
	//  Allows clicking on the map ; it's enough to do it on the last layer
	layer.inputEnabled = true;

	// create the end turn button
	// TODO use button ref sprite instead;
	Game.endTurnButton = game.add.button(25 * 32, 12 * 32, 'endturnbutton_sprite', Game.onEndTurnPressed);
	Game.endTurnButton.input.enabled = false;

	Game.quitButton = game.add.button(25 * 32, 3 * 32, 'quitbutton_sprite', Game.onQuitPressed);

	//initialize the resource tracker
	Game.resourceTracker = game.add.sprite(25 * 32, 5 * 32, 'resourcetracker_sprite');
	Game.leftResourceBar = Game.resourceTracker.addChild(game.add.sprite(5,5,'leftresourcebar'));
	Game.midResourceBar = Game.resourceTracker.addChild(game.add.sprite(36,5,'midresourcebar'));
	Game.rightResourceBar = Game.resourceTracker.addChild(game.add.sprite(68,5,'rightresourcebar'));
	Game.currentTurn = 0;
	Game.player.updateResourceTracker();

	// create the reference zones
	var refZones = new RefZones();

	// associate the zones for rendering purposes
	// the player and opp obj are created by pre-create calls
	Game.player.associateRefZones(refZones.playerZones);
	Game.opponent.associateRefZones(refZones.opponentZones);

	// shuffle the deck, and draw 8 cards
	Game.player.deck.shuffle();
	Game.initialDraw();

	// render 
	Game.player.render();
	Client.sendReady();
};

Game.displayWinScreen = function(){
	var youWinBanner = game.add.sprite(9 * 32, 6 * 32, 'winbanner_sprite');
}

Game.onQuitPressed = function(){
	Client.sendQuit();
	var youLostBanner = game.add.sprite(9 * 32, 6 * 32, 'losebanner_sprite');

}

Game.startGame = function(){
	//place our bases and energy buildings
	Game.player.leftBuilding = Game.player.deckList[1];
	Game.player.base = Game.player.deckList[0];
	Game.player.rightBuilding = Game.player.deckList[2];

	Game.player.buildings.insertCardAtIndex(Game.player.leftBuilding, 0);
	Game.player.buildings.insertCardAtIndex(Game.player.base, 2);
	Game.player.buildings.insertCardAtIndex(Game.player.rightBuilding, 4);

	// shuffle the deck, and draw 8 cards
	Game.player.deck.shuffle();
	Game.initialDraw();
	console.log("about to call player.render in StartGame ");
	Game.player.render();

	// send our initial state
	let state = Game.getPlayerPileState();
	Client.updatePileStates(state);
};

// Called by Client when our opponent updates their pile state
Game.updateOpponentPileState = function(state){
	console.log("in UpdateOpponentPileState");
	Game.opponent.setState(state);
	Game.opponent.updateToMatchState();
	Game.opponent.render();
};

// Called by Client when our opponent updates one of their cards 
Game.updateOpponentCard = function(cardInd, card){
	Game.opponent.deckList[cardInd] = card;

	Game.player.deck.cards.forEach(oldCard => {
		if (oldCard.id == arguments[0]){
			oldCard = card;
			Game.player.deck.render();
		}
	});
	Game.player.hand.cards.forEach(oldCard => {
			if (oldCard.id == arguments[0]){
				oldCard = card;
				Game.player.hand.render();
			}
	});
	Game.player.leftLane.cards.forEach(oldCard => {
		if (oldCard){
			if (oldCard.id == arguments[0]){
				oldCard = card;
				Game.player.leftLane.render();
			}
		}
	});
	Game.player.rightLane.cards.forEach(oldCard => {
		if (oldCard){
			if (oldCard.id == arguments[0]){
				oldCard = card;
				Game.player.rightLane.render();
			}
		}
	});
	Game.player.graveyard.cards.forEach(oldCard => {
		if (oldCard.id == arguments[0]){
			oldCard = card;
			Game.player.graveyard.render();
		}
	});
	Game.player.buildings.cards.forEach(oldCard => {
		if (oldCard){
			if (oldCard.id == arguments[0]){
				oldCard = card;
				Game.player.buildings.render();
			}
		}
	});
};

// called by Client when our opponent update one of our cards
// (as the result of a fight or something)
// in here we change our deckList, then find the card in our 
// actual data structures and update it?
Game.updatePlayerCard = function(cardInd, card){
	Game.player.deckList[cardInd] = card;
	// arguments[0] = cardInd cause arrow funcs don't have their
	// own arguments

	Game.player.deck.cards.forEach(oldCard => {
		if (oldCard.id == arguments[0]){
			oldCard = card;
			Game.player.deck.render();
		}
	});
	Game.player.hand.cards.forEach(oldCard => {
			if (oldCard.id == arguments[0]){
				oldCard = card;
				Game.player.hand.render();
			}
	});
	Game.player.leftLane.cards.forEach(oldCard => {
		if (oldCard){
			if (oldCard.id == arguments[0]){
				oldCard = card;
				Game.player.leftLane.render();
			}
		}
	});
	Game.player.rightLane.cards.forEach(oldCard => {
		if (oldCard){
			if (oldCard.id == arguments[0]){
				oldCard = card;
				Game.player.rightLane.render();
			}
		}
	});
	Game.player.graveyard.cards.forEach(oldCard => {
		if (oldCard.id == arguments[0]){
			oldCard = card;
			Game.player.graveyard.render();
		}
	});
	Game.player.buildings.cards.forEach(oldCard => {
		if (oldCard){
			if (oldCard.id == arguments[0]){
				oldCard = card;
				Game.player.buildings.render();
			}
		}
	});
	
};

Game.initialDraw = function(){
	Game.player.drawCard();
	Game.player.drawCard();
	Game.player.drawCard();
	Game.player.drawCard();
	Game.player.drawCard();
	Game.player.drawCard();
	Game.player.drawCard();
	Game.player.drawCard();
};

// BOTH THE CREATEPLAYER AND CREATEOPPONENT METHODS ARE CALLED BEFORE!!!! GAME.CREATE
// gets called by Client when Lobby tries to join a game (when we know our name and deck and gameId)
Game.createPlayer = function (name, deckList) {
	console.log("createplayer");
	// make the deck from the deckList 
	let deck = deckList.slice(3);
	// make the player object
	Game.player = new Player(name, deck);
	// set the player's decklist
	Game.player.deckList = deckList
	console.log(Game.player);
};

// BOTH THE CREATEPLAYER AND CREATEOPPONENT METHODS ARE CALLED BEFORE!!!! GAME.CREATE
//  called by Client when the server tells us we've found a match
//  passes us a name to call our opponent, and a deck to use as 
//  their card list
Game.createOpponent = function (name, deckList) {
	// make the deck from the deckList 
	let deck = deckList.slice(3);
	// make the opponent object
	Game.opponent = new Opponent(name, deck);
	// set the opponents deckList
	Game.opponent.deckList = deckList;
	console.log("Opponents name: " + Game.opponent.name);
	console.log("Opponents 4th card name: " + deck[3].name);
	console.log("Opponents 4th card render: " + deck[3].render);
};

Game.startNextTurn = function () {
	console.log("in Game.startNextTurn");
	// here we should do all the start of turn checks and effects
	// start by flashing up the "its your turn" banner
	var yourTurnBanner = game.add.sprite(9 * 32, 6 * 32, 'yourturnbanner_sprite');
	game.add.tween(yourTurnBanner).to({ alpha: 0 }, 2000, null, true, 500);
	// updating resources
	Game.currentTurn++;
	Game.player.resources.mid = Game.currentTurn;
	if (Game.currentTurn % 2 == 0){
		Game.player.resources.left = Game.currentTurn / 2;
		Game.player.resources.right = Game.currentTurn / 2;
	} else {
		Game.player.resources.left = (Game.currentTurn - 1) / 2;
		Game.player.resources.right = (Game.currentTurn - 1) / 2;

	}
	Game.player.updateResourceTracker();
	// and re-enabling interactivity 
	Game.player.setInteractable(true);
	Game.endTurnButton.input.enabled = true;
	//Game.player.render();

};

Game.onEndTurnPressed = function () {
	// here we should do all the end of turn checks and effects

	// and then disable interaction until it's our turn again
	Game.player.setInteractable(false);

	Game.endTurnButton.input.enabled = false;
	// tell the server we're done.
	Client.sendEndTurn();
};



// Get a list of which cards go where, to send to our opponent
Game.getPlayerPileState = function(){
	var state = {
		hand: [],
		deck: [],
		graveyard: [],
		leftLane: [],
		rightLane: [],
		buildings: [],
	};

	let i;

	Game.player.deck.cards.forEach(card => {
		state.deck.push(card.id);
	});
	Game.player.hand.cards.forEach(card => {
		state.hand.push(card.id);
	});
	Game.player.graveyard.cards.forEach(card => {
		state.graveyard.push(card.id);
	});

	console.log("getPileState: leftLane.length: " + Game.player.leftLane.cards.length);
	for (i = 0; i < 4; i++){
		if (Game.player.leftLane.cards[i]){
			console.log("getPileState: leftlane pushing ID: " + Game.player.leftLane.cards[i].id);
			state.leftLane.push(Game.player.leftLane.cards[i].id);
		} else {
			state.leftLane.push(null);
		}
	}

	for (i = 0; i < 4; i++){
		if (Game.player.rightLane.cards[i]){
			console.log("getPileState: rightlane pushing ID: " + Game.player.rightLane.cards[i].id);
			state.rightLane.push(Game.player.rightLane.cards[i].id);
		} else {
			state.rightLane.push(null);
		}
	}

	for (i = 0; i < 5; i++){
		if (Game.player.buildings.cards[i]){
			console.log("getPPileState: buildings: abt to push: " + Game.player.buildings.cards[i].name)
			state.buildings.push(Game.player.buildings.cards[i].id);
		} else {
			state.buildings.push(null);
		}
	}

	console.log("getPlayerPileState:");
	console.log("state.deck: " + state.deck);
	console.log("state.leftLane: " + state.leftLane);

	return state;
};

// creates invisible sprites that represent any zones we might have to check
// collision with, used as reference to tell the Pile subclasses where to 
// render themselves. This should also be the point of seperation for mobile,
// so we should check somehow to see if we're on mobile and then create the 
// zones in different places?
RefZones = function () {
	// have to look up how to check which platform we're on.
	// if (desktop){
	// 	doZonesForDesktop
	// } else {
	// 	doZonesForAndroid
	// }
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

	Game.zoneGroup = game.add.group();

	// assign the singletons (deck, graveyard)
	let zone;

	zone = game.add.sprite(25 * 32, 18 * 32, 'creaturezone_sprite');
	this.playerZones.deck.push(zone);
	zone.currCard = null;
	Game.zoneGroup.add(zone);

	zone = game.add.sprite(25 * 32, 14 * 32, 'creaturezone_sprite');
	this.playerZones.graveyard.push(zone);
	zone.currCard = null;
	Game.zoneGroup.add(zone);


	for (var i = 0; i < 4; i++) {
		// assign the players lanes
		zone = game.add.sprite(0 + (32 * 3 * i), 320, 'creaturezone_sprite');
		zone.zoneName = "playerLeftLane"
		zone.zoneIndex = i;
		zone.currCard = null;
		this.playerZones.leftLane.push(zone);
		Game.zoneGroup.add(zone);

		zone = game.add.sprite(416 + (32 * 3 * i), 320, 'creaturezone_sprite');
		zone.zoneName = "playerRightLane"
		zone.zoneIndex = i;
		zone.currCard = null;
		this.playerZones.rightLane.push(zone);
		Game.zoneGroup.add(zone);


		//this.playerZones.rightLane.push(game.add.sprite(416 + (32 * 3 * i), 320, 'creaturezone_sprite'));
		// assign the opponents lanes
		zone = game.add.sprite(416 + (32 * 3 * i), 128, 'creaturezone_sprite');
		zone.zoneName = "opponentLeftLane"
		zone.zoneIndex = i;
		zone.currCard = null;
		this.opponentZones.leftLane.push(zone);
		Game.zoneGroup.add(zone);


		zone = game.add.sprite(0 + (32 * 3 * i), 128, 'creaturezone_sprite');
		zone.zoneName = "opponentRightLane"
		zone.zoneIndex = i;
		zone.currCard = null;
		this.opponentZones.rightLane.push(zone);
		Game.zoneGroup.add(zone);


		//this.opponentZones.leftLane.push(game.add.sprite(416 + (32 * 3 * i), 128, 'creaturezone_sprite'));
		//this.opponentZones.rightLane.push(game.add.sprite(0 + (32 * 3 * i), 128, 'creaturezone_sprite'));
	}

	for (var j = 0; j < 5; j++) {
		// assign the building zones
		zone = game.add.sprite(0 + (32 * 5 * j), 14 * 32, 'buildingzone_sprite');
		zone.zoneName = "playerBuildings"
		zone.zoneIndex = j;
		zone.currCard = null;
		this.playerZones.buildings.push(zone);
		Game.zoneGroup.add(zone);

		zone = game.add.sprite(0 + (32 * 5 * j), 0, 'buildingzone_sprite');
		zone.zoneName = "opponentBuildings"
		zone.zoneIndex = j;
		zone.currCard = null;
		this.opponentZones.buildings.push(zone);
		Game.zoneGroup.add(zone);

		//this.playerZones.buildings.push(game.add.sprite(0 + (32 * 5 * j), 14 * 32, 'buildingzone_sprite'));
		//this.opponentZones.buildings.push(game.add.sprite(0 + (32 * 5 * j), 0, 'buildingzone_sprite'));
	}
	for (let k = 0; k < 8; k++) {
		// assign the hand zones
		zone = game.add.sprite(0+(32*3*k), 18*32, 'creaturezone_sprite');
		zone.zoneName = "playerHand"
		zone.zoneIndex = k;
		zone.currCard = null;
		this.playerZones.hand.push(zone);
		Game.zoneGroup.add(zone);

		//this.playerZones.hand.push(game.add.sprite(0+(32*3*k), 18*32, 'creaturezone_sprite'))
	}
};



function randomInt(low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}

/*
	for (var i = 0; i < 4; i++) {
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
					if (Phaser.Rectangle.contains(zone.getBounds(), sprite.centerX, sprite.centerY)) {
						sprite.home = zone;
						sprite.homeName = "p2crtl1" + i;
					}
				}
			}
		}
	}
	for (var i = 0; i < 5; i++) {
		zone = Game.zoneSprites.bld.p1[i];
		if (Phaser.Rectangle.contains(zone.getBounds(), sprite.centerX, sprite.centerY)) {
			sprite.home = zone;
			sprite.homeName = "p1bld" + i;
		} else {
			zone = Game.zoneSprites.bld.p2[i];
			if (Phaser.Rectangle.contains(zone.getBounds(), sprite.centerX, sprite.centerY)) {
				sprite.home = zone;
				sprite.homeName = "p2bld" + i;

			}
		}
	}
	sprite.moveTo(sprite.home, sprite.dindex);
*/










































/*
setUpDeck = function () {
	Game.deck = { curr: 0 }
	for (var i = 0; i < 25; i++) {
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

drawCards = function (numCards) {
	for (var i = 0; i < numCards; i++) {
		var deckIndex = Game.deck.curr + i;
		// CHECK TO SEE IF YOU'VE OVEDRAWN
		Game.deck[deckIndex].sprite = game.add.sprite(0, 0, 'blank_card_sprite');
		Game.deck[deckIndex].sprite.nameText = game.add.text(11, 63, Game.deck[deckIndex].name, { font: "12px Arial", fill: "#000000" });
		Game.deck[deckIndex].sprite.atkText = game.add.text(4, 113, Game.deck[deckIndex].atk, { font: "14px Arial", fill: "#000000" });
		Game.deck[deckIndex].sprite.defText = game.add.text(80, 113, Game.deck[deckIndex].def, { font: "14px Arial", fill: "#000000" });
		Game.deck[deckIndex].sprite.lcostText = game.add.text(7, 1, Game.deck[deckIndex].lcost, { font: "12px Arial", fill: "#000000" });
		Game.deck[deckIndex].sprite.mcostText = game.add.text(37, 1, Game.deck[deckIndex].mcost, { font: "12px Arial", fill: "#000000" });
		Game.deck[deckIndex].sprite.rcostText = game.add.text(74, 1, Game.deck[deckIndex].rcost, { font: "12px Arial", fill: "#000000" });

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

		// var handBounds = Game.zoneSprites.hand[Game.hand.count+i].getBounds();
		// var cardBounds = Game.deck[deckIndex].sprite.getBounds();

		Game.deck[deckIndex].sprite.moveTo = function (zone, deckIndex) {
			var cardBounds = Game.deck[deckIndex].sprite.getBounds();
			var zoneBounds = zone.getBounds();
			var distance = Phaser.Math.distance(zoneBounds.x, zoneBounds.y, cardBounds.x, cardBounds.y);
			var tween = game.add.tween(Game.deck[deckIndex].sprite);
			var duration = distance * 2;
			tween.to({ x: zoneBounds.x, y: zoneBounds.y }, duration);
			tween.start();
		}
		Game.deck[deckIndex].sprite.home = Game.zoneSprites.hand[Game.hand.count + i];
		Game.deck[deckIndex].sprite.moveTo(Game.zoneSprites.hand[Game.hand.count + i], deckIndex);
		// var distance = Phaser.Math.distance(handBounds.x,handBounds.y,cardBounds.x,cardBounds.y);
		// var tween = game.add.tween(Game.deck[deckIndex].sprite);
		// var duration = distance*5;
		// tween.to({x:handBounds.x,y:handBounds.y}, duration);
		// tween.start();
	}
	Game.deck.curr += numCards;
	Game.hand.count += numCards;
}
*/
