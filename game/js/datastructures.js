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
	//override the draw (render) methods for all the pile subclasses? or tell them to 
	//render  in different spots.
	//maybe include checking the type of the object we are in the functions?
}
Opponent.prototype = new Participant;

//the Player (the person playing on "our" side of the table)
function Player(name, deckCards){
	this.base = Participant;
	this.base(name, deckCards);
	this.setInteractable = playerSetInteractable;
}
Player.prototype = new Participant;

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
	this.cardsInHand = 0;

	this.deck = new Deck(deckCards);
	this.hand = new Hand();
	this.graveyard = new Pile(40);
	this.leftLane = new Lane();
	this.rightLane = new Lane();
	this.buildings = new BuildingRow();
	this.graveyard = new Graveyard();

	this.drawCard = drawParticipantCard;
	this.updateSelf = updateSelf;
	this.associateRefZones = associateRefZones;
	this.render = participantRender;

};

function participantRender(){
	this.hand.render();
	this.deck.render();
	this.graveyard.render();
}
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
	this.render = handRender;
	this.setInteractable = rowPileSetInteractable;

}
BuildingRow.prototype = new Pile;

// Lane Constructor
function Lane(cards){
	this.base = Pile;
	this.base(4, cards);
	// same as hand because they work the same
	this.associateRefZones = handAssociateRefZones;
	this.render = handRender;
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
	this.targetZone = refZones[0];
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
	this.render = handRender;
	this.setInteractable = rowPileSetInteractable;
};
Hand.prototype = new Pile;

// TODO rename b/c its used by more than hand.
// the render function for the Hand
function handRender(){	
	//check to see if we're a player or Opponent 
	if (this.targetZones){
		let i = 0;
		console.log("rowRender, length is: " + this.targetZones.length);
		console.log("rowRender, [0].x = " + this.targetZones[1].x);
		for (let i = 0; i < this.cards.length; i++){
			//because certain zones (buildings, lanes) can have empty spots
			if(this.cards[i]){
				this.cards[i].render({x: this.targetZones[i].x, y: this.targetZones[i].y});
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
	this.targetZone = refZones[0];
};

function deckRender(){
	let x = this.targetZone.x;
	let y = this.targetZone.y;

		if (this.cards.length >= 0){
			// TODO show cardback instead of blank.
			this.sprite = game.add.sprite(x,y,'blank_card_sprite');
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
	this.max = max || 999;
	this.addCard = addCard;
	this.addCardToBottom = addCardToBottom;
	this.drawCard = drawPileCard;
	this.shuffle = shuffle;
	this.swapCards = swapCards;
	this.print = printCards;
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
	this.setCallbacks = setCardCallbacks;
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

//takes a point (anything with x and y properties), and draws itself to the
//screen with its upper left corner at that point.
function renderCard(point){
	//the x and y point properties
	var spot = point || {x:0, y:0};
	var x = spot.x;
	var y = spot.y;
	var font = {font: "12px Arial", fill: "#000000"};
	var font14 = {font: "14px Arial", fill: "#000000"};

	//create the card sprite
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

}
// for setting card callbacks dynamically, as they may require references to 
// direct game objects.
function setCardCallbacks(onDragStop){
	//drag and dropping
	if (onDragStop) {
		this.sprite.events.onDragStop.add(onDragStop, this);
	}
};

function enableCard(){
	this.sprite.inputEnabled = true;
	this.sprite.input.enableDrag();
	//this.sprite.events.onDragStop.add(onDragStop, this);
	//this.sprite.alignIn(Game.zoneSprites.deck, Phaser.CENTER, 0, 0);
};

function disableCard(){
	this.sprite.inputEnabled = false;
	if (this.sprite.input){
		this.sprite.input.disableDrag();
	}
};