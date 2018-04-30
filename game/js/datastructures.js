/**
 * A bunch of Game Data Structures. Starts from Cards and builds up to various 
 * Pile subclasses as well as an Opponent and Player class. Should really only
 * be instantiated in the Game object. 
 */


//the Opponent (the person playing against "us")
//The idea behind updating the opponent state is this:
	// the opponent has an array of cards, since we don't care about their in-depth 
	// state, and we trust them not to lie about the feasibility of their actions
	// we'll track card state in that array. They say cardlist[13] is now this new 
	// card object? perf, we'll set it. Each card in the list will also have a 
	// location property, and they can update that as well.
function Opponent(name, deckCards){
	this.base = Participant;
	this.base(name, deckCards);
	this.deckList = deckCards;
	console.log("in Opponent Constructor: ");
	console.log("deckList[0].name:" + this.deckList[0].name);
	console.log("deckList[0].render: " + this.deckList[0].render);

	this.render = opponentRender;
	this.updateToMatchState = updateToMatchState;
	//override the draw (render) methods for all the pile subclasses? or tell them to 
	//render  in different spots.
	//maybe include checking the type of the object we are in the functions?

}
Opponent.prototype = new Participant;

// if you call this make sure you call Game.opponent.render()
// right after or else shit'll b fucked 4 real m80
function updateToMatchState(){
	let state = this.state;
	console.log("in updateToMatchState");
	console.log("state.deck: " + state.deck);

	// TODO replace forEach's with for loops, skipping index if
	// the state[index] is null;
	this.deck.cards = [];
	state.deck.forEach(cardInd => {
		this.deck.cards.push(this.deckList[cardInd]);
	});
	this.hand.cards = [];
	state.hand.forEach(cardInd => {
		this.hand.cards.push(this.deckList[cardInd]);
	});

	this.buildings.cards = [];
	let i;
	for (i = 0; i < state.buildings.length; i++){
		if (state.buildings[i] != null){
			let index = (state.buildings.length - i) -1;
			console.log("upDateToMatchState: index: " + index);
			this.buildings.setCardAtIndex(this.deckList[state.buildings[i]], index);
		}
	}
	
	this.leftLane.cards = [];
	for (i = 0; i < state.leftLane.length; i++){
		if (state.leftLane[i]){
			console.log("leftlane index: " + state.leftLane[i]);
			this.leftLane.setCardAtIndex(this.deckList[state.leftLane[i]], (state.leftLane.length - i) -1);
		}
	}

	this.rightLane.cards = [];
	for (i = 0; i < state.rightLane.length; i++){
		if (state.rightLane[i]){
			console.log("rightlane index: " + state.rightLane[i]);
			this.rightLane.setCardAtIndex(this.deckList[state.rightLane[i]], (state.rightLane.length - i) -1);
		}
	}
};

function opponentRender(){
	this.leftLane.render();
	this.rightLane.render();
	this.buildings.render();
}

// the Player (the person playing on "our" side of the table)
function Player(name, deckCards){
	//this.deckList = deckCards;
	//deckCards.shift();
	//deckCards.shift();
	//deckCards.shift();
	this.base = Participant;
	this.base(name, deckCards);

	this.resources = {
		left: 0,
		mid: 0,
		right: 0,
	}

	this.setInteractable = playerSetInteractable;
	this.render = playerRender;
	this.canPay = canPay;
	this.pay = pay;
	this.updateResourceTracker = updateResourceTracker;
}
Player.prototype = new Participant;

function updateResourceTracker(){
	console.log("in updateResourceTracker():");
	console.log("resources.left: " + this.resources.left);
	console.log("resources.mid: " + this.resources.mid);
	console.log("resources.right: " + this.resources.right);

	if (this.resources.left == 0){
		Game.leftResourceBar.visible = false;
	} else {
		Game.leftResourceBar.visible = true;
		Game.leftResourceBar.frame = this.resources.left - 1;
	}

	if (this.resources.mid == 0){
		Game.midResourceBar.visible = false;
	} else {
		Game.midResourceBar.visible = true;
		Game.midResourceBar.frame = this.resources.mid - 1;
	}

	if (this.resources.right == 0){
		Game.rightResourceBar.visible = false;
	} else {
		Game.rightResourceBar.visible = true;
		Game.rightResourceBar.frame = this.resources.right - 1;
	}
	console.log("leaving updateResourceTracker()...");

}

function pay(cost){
	console.log("in pay():");
	console.log("lcost: " + cost.lcost);
	this.resources.left = this.resources.left - cost.lcost;
	console.log("mcost: " + cost.mcost);
	this.resources.mid = this.resources.mid - cost.mcost;
	console.log("rcost: " + cost.rcost);
	this.resources.right = this.resources.right - cost.rcost;
	console.log("leaving pay()...")

}

function canPay(cost){
	if (this.resources.left - cost.lcost >= 0){
		if (this.resources.mid - cost.mcost >= 0){
			if (this.resources.right - cost.rcost >= 0){
				return true;
			}
		}
	}
	return false;
}

function playerRender(){
	this.hand.render();
	this.deck.render();
	this.graveyard.render();
	this.leftLane.render();
	this.rightLane.render();
	this.buildings.render();
}

function playerSetInteractable(bool){
	this.hand.setInteractable(bool);
	this.leftLane.setInteractable(bool);
	this.rightLane.setInteractable(bool);
	// buildings can't be dragged, but they can be activated 
	this.buildings.setInteractable(bool);
}

// ---PARTICIPANT---PARTICIPANT---PARTICIPANT---PARTICIPANT---PARTICIPANT
// everything below this is Participant stuff
// ---PARTICIPANT---PARTICIPANT---PARTICIPANT---PARTICIPANT---PARTICIPANT

//Participant constructor
// refZones are the zones for each of the pile subclasses to draw themselves
// in reference to (an opponent wouldn't get passed anything for a hand, 
// for example. A player would get passed a collection of cardslots that
// correspond to where the player's hand goes)

function Participant(name, deckCards){
	this.name = name;
	this.currCard = null;
	this.currSource = null;
	this.cardsInHand = 0;

	this.deck = new Deck(deckCards);
	this.hand = new Hand();
	this.graveyard = new Pile(40);
	// clearly this isn't a mistake
	let nullLane = [null, null, null, null];
	let nullBuildingRow = [null, null, null, null, null];
	this.leftLane = new Lane(nullLane);
	this.rightLane = new Lane(nullLane);
	this.buildings = new BuildingRow(nullBuildingRow);
	this.graveyard = new Graveyard();

	this.drawCard = drawParticipantCard;
	this.updateSelf = updateSelf;
	this.associateRefZones = associateRefZones;
	this.setState = setState;

};
function setState(state){
	this.state = state;
};

function associateRefZones(refZones) {
	this.deck.associateRefZones(refZones.deck);
	this.hand.associateRefZones(refZones.hand);
	this.graveyard.associateRefZones(refZones.graveyard);
	this.leftLane.associateRefZones(refZones.leftLane);
	this.rightLane.associateRefZones(refZones.rightLane);
	this.buildings.associateRefZones(refZones.buildings);
}

function drawParticipantCard() {
	let card = this.deck.drawCard();
	console.log("in drawCard, cardname is: " + card.name);
	this.hand.addCard(card);
};
//Participant's update method
function updateSelf(){
	this.cardsInHand = this.hand.cards.length;
	//console.log("player cards in hand: " + this.hand.cards.length);
	this.cardsInDeck = this.deck.cards.length;
	//this.baseHealth = this.buildings.cards[2].stats.def;
}

// PILE SUBCLASSES---PILE SUBCLASSES---PILE SUBCLASSES---PILE SUBCLASSES---
// everything below this is pile subclass stuff
// PILE SUBCLASSES---PILE SUBCLASSES---PILE SUBCLASSES---PILE SUBCLASSES---

// BuildingRow Constructor
function BuildingRow(cards){
	this.base = Pile;
	this.base(5, cards);
	// same as hand because they work the same
	this.associateRefZones = handAssociateRefZones;
	this.render = rowRender;
	this.setInteractable = rowPileSetInteractable;

}
BuildingRow.prototype = new Pile;

// Lane Constructor
function Lane(cards){
	this.base = Pile;
	this.base(4, cards);
	// same as hand because they work the same
	this.associateRefZones = handAssociateRefZones;
	this.render = rowRender;
	this.setInteractable = rowPileSetInteractable;

}
Lane.prototype = new Pile;

// Graveyard Constructor
function Graveyard(cards){
	this.base = Pile;
	this.base(40, cards);
	this.targetZone = null;
	this.render = graveRender;
	this.associateRefZones = graveAssociateRefZones;
}
Graveyard.prototype = new Pile;

function graveAssociateRefZones(refZones){
	if (refZones){
		this.targetZone = refZones[0];
	}
};

function graveRender(){
	let x = this.targetZone.x;
	let y = this.targetZone.y;

	if (this.cards.length > 0){
		let card = cards[cards.length - 1];
		card.render({x:x, y:y});
	} else {
		// TODO display empty grave?
	}
};

// Hand constructor
function Hand(cards){
	this.base = Pile;
	this.base(8, cards)
	this.targetZones = null;
	this.associateRefZones = handAssociateRefZones;
	this.render = rowRender;
	this.setInteractable = rowPileSetInteractable;
};
Hand.prototype = new Pile;


// TODO rename b/c its used by more than hand.
// the render function for the Hand
function rowRender(){	
	// check to see if we're a player or Opponent 
	if (this.targetZones){
		let i;
		console.log("rowRender, length is: " + this.targetZones.length);
		console.log("rowRender, [0].x = " + this.targetZones[1].x);
		for (let i = 0; i < this.cards.length; i++){
			// because certain zones (buildings, lanes) can have empty spots (as null s)
			if(this.cards[i]){
				console.log("about to render " + this.cards[i].name);
				if (this.cards[i].render == undefined){
					let oldCard = this.cards[i];
					this.cards[i] = new Card(null, oldCard.name, oldCard.desc, oldCard.stats, oldCard.cost, oldCard.effects);
				}
				// console.log("rowRender: " + this.cards[i].render);
				this.cards[i].render({x: this.targetZones[i].x, y: this.targetZones[i].y});
				this.cards[i].home = {x: this.targetZones[i].x, y: this.targetZones[i].y};
			}
		}
	}
}

function handAssociateRefZones(refZones){
	this.targetZones = refZones;
};

//for hands lanes and building rows.
function rowPileSetInteractable(bool){
	for (let i = 0; i < this.cards.length; i++){
		if (this.cards[i]){
			if (bool){
				this.cards[i].enable();
			} else {
				this.cards[i].disable();
			}
		}
	}
}

// Deck constructor
function Deck(cards){
	this.base = Pile;
	this.base(25, cards);
	this.targetZone = null;
	this.render = deckRender;
	this.associateRefZones = deckAssociateRefZones;
};
Deck.prototype = new Pile;

function deckAssociateRefZones(refZones){
	if (refZones){
		this.targetZone = refZones[0];
	}
};

function deckRender(){
	let x = this.targetZone.x;
	let y = this.targetZone.y;

		if (this.cards.length >= 0){
			// TODO show cardback instead of blank.
			this.sprite = game.add.sprite(x,y,'cardback_sprite');
		} else {
			// TODO show empty deck sprite
		}
}

// ----PILE----PILE----PILE----PILE----PILE----PILE----PILE----
// everything below this is Pile stuff
// ----PILE----PILE----PILE----PILE----PILE----PILE----PILE----

// constructor for a pile, takes an optional existing array of cards.
// (the "top" of the pile (where you draw from) is the end of the array) as well
// as a required max number of cards
function Pile(max, cards) {
	this.cards = cards || [];
	this.max = max || 40;
	this.addCard = addCard;
	this.addCardToBottom = addCardToBottom;
	this.drawCard = drawPileCard;
	this.shuffle = shuffle;
	this.swapCards = swapCards;
	this.print = printCards;
	this.removeAtIndex = removeAtIndex;
	this.insertCardAtIndex = insertCardAtIndex;
	this.setCardAtIndex = setCardAtIndex;
}
function setCardAtIndex(card, index){
	this.cards[index] = card;
}

function insertCardAtIndex(card, index){
	this.cards.splice(index, 0, card);
}

function removeAtIndex(index){
	this.cards.splice(index, 1);
}

//prints all the cards in the pile
function printCards(){
	this.cards.forEach(function(card) {
		card.print();
	});
}

//swaps two cards
function swapCards(i, j){
	var tempCard = this.cards[i];
	this.cards[i] = this.cards[j];
	this.cards[j] = tempCard;
}

//shuffles the Pile
function shuffle() {
	var j, x, i;
    for (i = this.cards.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = this.cards[i];
        this.cards[i] = this.cards[j];
        this.cards[j] = x;
    }
}

// adds a card to the bottom of the pile, returns num cards in pile
function addCardToBottom(card) {
	if (!card) {
		console.log("addCard requires argument: card");
		return;
	}
	if (this.cards.length >= this.max){
		console.log("attempted to add a card to a full pile!");
		return;
	}
	var cardsInpile = this.cards.unshift(card);
	return cardsInpile;
}

// draws from the top (end) of the array, returns the card.
function drawPileCard() {
	let card = this.cards.pop();
	console.log("in drawPileCard, card is: " + card);
	return card;
}

// adds a card to the top of the pile, returns num cards in pile
function addCard(card) {
	console.log("in addCard, card is: " + card);
	if (!card) {
		console.log("addCard requires argument: card");
		return;
	}
	if (this.cards.length >= this.max){
		console.log("attempted to add a card to a full pile!");
		return;
	}
	var cardsInpile = this.cards.push(card);
	return cardsInpile;
}

// ----CARD----CARD----CARD----CARD----CARD----CARD----CARD----
// everything below this is card stuff
// ----CARD----CARD----CARD----CARD----CARD----CARD----CARD----


// Card constructor, takes an optional CryptoCardsNumber (ccnum), 
// or all the necessary info to make a card.
function Card(ccnum, name, desc, stats, cost, effects) {
	if (ccnum){
		// fetch from DB?
	} else {
		this.name = name;
		this.desc = desc;
		this.stats = stats;
		this.cost = cost;
	}
	//expecting effects to be an array of strings.
	this.effects = effects;
	this.print = printCard;
	this.render = renderCard;
	this.enable = enableCard;
	this.disable = disableCard;
	this.setId = setId;
	this.getSprite = getSprite;
	this.moveTo = moveTo;
}

function getSprite(){
	return this.sprite;
}

function setId(id){
	this.id = id;
}

function Cost(lcost, mcost, rcost){
	this.lcost = lcost;
	this.mcost = mcost;
	this.rcost = rcost;
}

function Stats(atk, def){
	this.atk = atk;
	this.def = def;
}

function printCard(){
	console.log("name: " + this.name);
	console.log("desc: " + this.desc);
}


function moveTo(point){
	let x = point.x;
	let y = point.y;
	let distance = Phaser.Math.distance(x,y,this.sprite.centerX,this.sprite.centerY);
	let duration = distance*2;
	let tween = game.add.tween(this.sprite);
	tween.to({x:x,y:y}, duration);
	tween.start();
}

// takes a point (anything with x and y properties), and draws itself to the
// screen with its upper left corner at that point.
function renderCard(point){
	// the x and y point properties
	var spot = point || this.home;
	var x = spot.x;
	var y = spot.y;
	var font = {font: "12px Arial", fill: "#000000"};
	var font14 = {font: "14px Arial", fill: "#000000"};

	// create the card sprite
	this.sprite = game.add.sprite(x,y,'blank_card_sprite');

	// TODO better common/rarity indicator/text?
	// TODO include description on card?
	// add all the text to it
	this.sprite.addChild(game.add.text(11, 63, this.name, font));
	this.sprite.addChild(game.add.text(4, 113, this.stats.atk, font14));
	this.sprite.addChild(game.add.text(80, 113, this.stats.def, font14));
	this.sprite.addChild(game.add.text(7, 1, this.cost.lcost, font));
	this.sprite.addChild(game.add.text(37, 1, this.cost.mcost, font));
	this.sprite.addChild(game.add.text(74, 1, this.cost.rcost, font));

	// id is set in deckloader atm
	this.sprite.parentCard = this;

	this.sprite.events.onDragStop.add(onDragStop, this);
	this.sprite.events.onDragStart.add(onDragStart, this);
}

function cardOnDragStart(sprite, pointer, startX, startY) {
	let card = sprite.parentCard;
	Game.player.currCard = card;
	console.log("onDragStart card name: " + card.name);

	let source = Game.zoneGroup.getClosestTo({x:startX, y:startY});
	console.log("onDragStart source: " + source.zoneName + "[" + source.zoneIndex + "]");
	Game.player.currSource = source;
}

function cardOnDragStop(sprite, pointer) {
	let card = sprite.parentCard;
	let location = { x: sprite.centerX, y: sprite.centerY };
	let target = Game.zoneGroup.getClosestTo(location);

	// check if they dragged TO a zone.
	// might want to move this inside doCurrAction as we'll have
	// to also check if they're trying to cast a card that doesn't target
	// a single other card.
	if (!(Phaser.Rectangle.contains(target, location.x, location.y))){
		card.moveTo(card.home);
	} else {
		Game.player.doCurrActionTo(target);
	}
}

function doCurrActionTo(target){
	let card = Game.player.currCard;
	let source = Game.player.currSource;


}

function onDragStart(sprite, pointer, startX, startY) {
	let card = sprite.parentCard;
	Game.player.currCard = card;
	console.log("parent card name: " + card.name);

	//TODO find source by point (startX, startY)?
	//let source = findSourceByPoint({x:startX, y:startY});
	let source = Game.zoneGroup.getClosestTo({x:startX, y:startY});
	console.log("onDragStart source: " + source.zoneName);

	Game.player.currSource = source;
}

function onDragStop(sprite, pointer) {
	let card = sprite.parentCard;
	let target = findTargetByPoint({x:sprite.centerX, y:sprite.centerY});

	//if target is null, it's invalid, just put it back where it was
	if (target == null){
		card.moveTo(card.home);
		return;
	} else if (target.action == 'cast') {
		console.log("casting a spell");
		if (Game.player.canPay(card.cost)){
			console.log("player can afford it");
			Game.player.pay(card.cost);
			Game.player.updateResourceTracker();
			card.home = target.zone;
			target.zone.currCard = card;
			card.moveTo(card.home);
		} else {
			card.moveTo(card.home);
		}
	} else if (target.action == 'fight') {
		//get the card we're trying to fight
		console.log("fighting a creature");
		if (target.card){
			console.log("targeted cards name: " + target.card.name);
			fight(target.card, card);
			target.card.render();
			card.render(card.home);

			card.moveTo(card.home);
		} else {
			card.moveTo(card.home);
		}
		card.home = target.zone;
		card.moveTo(card.home);
	} else {
		card.home = target.zone;
		card.moveTo(card.home);
	}
	//check to see if they're casting a card from their hand
	//check to see if they're attacking with a creature in a lane
	

	//Remove the card from the source and put it in the target;
	let source = Game.player.currSource;
	if (source){
		if (source.zoneName){
			switch (source.zoneName){
				case 'playerLeftLane' :
					Game.player.leftLane.removeAtIndex(source.zoneIndex);
					break;
				case 'playerRightLane' :
					Game.player.rightLane.removeAtIndex(source.zoneIndex);
					break;
				case 'playerHand' :
					Game.player.hand.removeAtIndex(source.zoneIndex);
					break;
				default :
					console.log("got to the bottom of onDragStop source switch");
			}
		}
	}
	if (target){
		if (target.zoneName){
			switch (target.zoneName){
				case 'playerLeftLane' :
					console.log("targeting LeftLane, index: " + target.zoneIndex);
					Game.player.leftLane.setCardAtIndex(card, target.zoneIndex);
					break;
				case 'playerRightLane' :
					console.log("targeting rightLane, index: " + target.zoneIndex);
					Game.player.rightLane.setCardAtIndex(card, target.zoneIndex);
					break;
				case 'opponentLeftLane' :
					Game.opponent.leftLane.setCardAtIndex(card, target.zoneIndex);
					break;
				case 'opponentRightLane' :
					Game.opponent.rightLane.setCardAtIndex(card, target.zoneIndex);
					break;
				case 'playerBuildings' :
					console.log("targeting buildings, index: " + target.zoneIndex);
					Game.player.buildings.setCardAtIndex(card, target.zoneIndex);
					break;
				case 'opponentBuildings' :
					Game.opponent.buildings.setCardAtIndex(card, target.zoneIndex);
					break;
				default :
					console.log("got to the bottom of onDragStop target switch");
			}
		}
	}
	Client.updatePileStates(Game.getPlayerPileState());
}

function fight(card1, card2){
	card1.def = card1.def - card2.atk;
	if (card1.def < 0){
		card1.def = 0;
	}

	card2.def = card2.def - card1.atk;
	if (card2.def < 0){
		card2.def = 0;
	}
}

function enableCard(){
	if (this.sprite != undefined){
		this.sprite.inputEnabled = true;
		this.sprite.input.enableDrag();
	}
	//this.sprite.events.onDragStop.add(onDragStop, this);
	//this.sprite.alignIn(Game.zoneSprites.deck, Phaser.CENTER, 0, 0);
};

function disableCard(){
	if (this.sprite != undefined){
		this.sprite.inputEnabled = false;
		if (this.sprite.input){
			this.sprite.input.disableDrag();
		}
	}
};


function findTargetByPoint(point){
	let x = point.x;
	let y = point.y;

	let target = null;
	console.log("in findTargetByPoint");

	Game.player.leftLane.targetZones.forEach(zone => {
		if (Phaser.Rectangle.contains(zone.getBounds(), x, y)){
			target = {};
			target.zone = zone;
			target.zoneName = zone.zoneName;
			target.zoneIndex = zone.zoneIndex;
			target.action = 'cast';
		}
	});
	Game.player.rightLane.targetZones.forEach(zone => {
		if (Phaser.Rectangle.contains(zone.getBounds(), x, y)){
			target = {};
			target.zone = zone;
			target.zoneName = zone.zoneName;
			target.zoneIndex = zone.zoneIndex;
			target.action = 'cast';
		}
	});
	Game.player.buildings.targetZones.forEach(zone => {
		if (Phaser.Rectangle.contains(zone.getBounds(), x, y)){
			target = {};
			target.zone = zone;
			target.zoneName = zone.zoneName;
			target.zoneIndex = zone.zoneIndex;
			target.action = 'cast';
		}
	});
	Game.opponent.leftLane.targetZones.forEach(zone => {
		if (Phaser.Rectangle.contains(zone.getBounds(), x, y)){
			target = {};
			target.zone = zone;
			target.zoneName = zone.zoneName;
			target.zoneIndex = zone.zoneIndex;
			target.action = 'fight';
		}
	});
	Game.opponent.rightLane.targetZones.forEach(zone => {
		if (Phaser.Rectangle.contains(zone.getBounds(), x, y)){
			target = {};
			target.zone = zone;
			target.zoneName = zone.zoneName;
			target.zoneIndex = zone.zoneIndex;
			target.action = 'fight';
		}
	});
	Game.opponent.buildings.targetZones.forEach(zone => {
		if (Phaser.Rectangle.contains(zone.getBounds(), x, y)){
			target = {};
			target.zone = zone;
			target.zoneName = zone.zoneName;
			target.zoneIndex = zone.zoneIndex;
			target.action = 'fight';
		}
	});

	if (target) {
		//see if we're targeting a card.
		target.card = null;
		Game.opponent.leftLane.cards.forEach(card => {
			if (card) {
				if (card.sprite){
					if (Phaser.Rectangle.contains(card.sprite.getBounds(), x, y)){
						target.card = card;
					}
				}
			}
		});

		Game.opponent.rightLane.cards.forEach(card => {
			if (card) {
				if (card.sprite){
					if (Phaser.Rectangle.contains(card.sprite.getBounds(), x, y)){
						target.card = card;
					}
				}
			}
		});

		Game.opponent.buildings.cards.forEach(card => {
			if (card) {
				if (card.sprite){
					if (Phaser.Rectangle.contains(card.sprite.getBounds(), x, y)){
						target.card = card;
					}
				}
			}
		});
	}

	return target;
}

function findSourceByPoint(point){
	let x = point.x;
	let y = point.y;

	let target = null;
	console.log("in findSourceByPoint");
	Game.player.leftLane.targetZones.forEach(zone => {
		if (Phaser.Rectangle.contains(zone.getBounds(), x, y)){
			console.log("source is in left lane");
			target = {};
			target.zoneName = zone.zoneName;
			target.zoneIndex = zone.zoneIndex;
			target.action = 'cast';
		}
	});
	Game.player.rightLane.targetZones.forEach(zone => {
		if (Phaser.Rectangle.contains(zone.getBounds(), x, y)){
			console.log("source is in right lane");
			target = {};
			target.zoneName = zone.zoneName;
			target.zoneIndex = zone.zoneIndex;
			target.zone = zone;
			target.action = 'cast';
		}
	});
	Game.player.hand.targetZones.forEach(zone => {
		if (Phaser.Rectangle.contains(zone.getBounds(), x, y)){
			console.log("source is in hand");
			target = {};
			target.zoneName = zone.zoneName;
			target.zoneIndex = zone.zoneIndex;
			target.zone = zone;
			target.action = 'cast';
		}
	});


	return target;
}
