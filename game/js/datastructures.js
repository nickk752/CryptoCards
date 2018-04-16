/**
 * A bunch of Game Data Structures. Starts from Cards and builds up to various 
 * Pile subclasses as well as an Opponent and Player class. Should really only
 * be instantiated in the Game object. 
 */


//the Opponent (the person playing against "us")
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
}
Player.prototype = new Participant;

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
	//the Participant's drawcard method
	this.updateSelf = updateSelf;

}
function drawParticipantCard() {
	var card = this.deck.drawCard();
	this.hand.addCard(card);
};
//Participant's update method
function updateSelf(){
	this.cardsInHand = this.hand.cards.length;
	console.log("player cards in hand: " + this.hand.cards.length);
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
}
BuildingRow.prototype = new Pile;

// Lane Constructor
function Lane(cards){
	this.base = Pile;
	this.base(4, cards);
}
Lane.prototype = new Pile;

// Graveyard Constructor
function Graveyard(cards){
	this.base = Pile;
	this.base(40, cards);
}
Graveyard.prototype = new Pile;

// Hand constructor
function Hand(cards){
	this.base = Pile;
	this.base(8, cards)
}
Hand.prototype = new Pile;

// Deck constructor
function Deck(cards){
	this.base = Pile;
	this.base(25, cards);
}
Deck.prototype = new Pile;

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
	var card = this.cards.pop();
	return card;
}

// adds a card to the top of the pile, returns num cards in pile
function addCard(card) {
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

	//add all the text to it
	this.sprite.addChild(game.add.text(x+11, y+63, this.name, font));
	this.sprite.addChild(game.add.text(x+4, y+113, this.stats.atk, font14));
	this.sprite.addChild(game.add.text(x+80, y+113, this.stats.def, font14));
	this.sprite.addChild(game.add.text(x+7, y+1, this.cost.lcost, font));
	this.sprite.addChild(game.add.text(x+37, y+1, this.cost.mcost, font));
	this.sprite.addChild(game.add.text(x+74, y+1, this.cost.rcost, font));

}

function setCardCallbacks(onDragStop){
	//drag and dropping
	this.sprite.input.enableDrag();
	this.sprite.events.onDragStop.add(onDragStop, this);
}

function enableCard(){
	this.sprite.inputEnabled = true;
	//this.sprite.events.onDragStop.add(onDragStop, this);
	//this.sprite.alignIn(Game.zoneSprites.deck, Phaser.CENTER, 0, 0);
}

function disableCard(){
	this.sprite.inputEnabled = false;
}

//testing:
var i = 0;
var cards = [];
for (i ; i < 25; i = i + 5){
	cards[i] = new Card(null, "Timbo", "a loser", new Stats(1,3), new Cost(1,1,1));
	cards[i+1] = new Card(null, "Q", "QQ", new Stats(2,2), new Cost(1,0,2));
	cards[i+2] = new Card(null, "L'Eric", "EEEEEEEEric", new Stats(2,2), new Cost(1,0,2));
	cards[i+3] = new Card(null, "asdf", "ghjkl", new Stats(2,2), new Cost(1,0,2));
	cards[i+4] = new Card(null, "Lan", "Local Area Lan", new Stats(2,2), new Cost(1,0,2));
}

var player = new Player(cards);
player.deck.shuffle();
player.drawCard();
player.drawCard();
player.drawCard();
player.updateSelf();
console.log("should be 3: " + player.cardsInHand);
player.hand.print();
