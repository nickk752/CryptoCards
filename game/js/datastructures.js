//the Opponent (the person playing against "us")
function Opponent(deckCards){
	this.base = Participant;
	this.base(deckCards);

}
Opponent.prototype = new Participant;

//the Player (the person playing on "our" side of the table)
function Player(deckCards){
	this.base = Participant;
	this.base(deckCards);
}
Player.prototype = new Participant;

//Participant constructor
function Participant(deckCards){
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

// BuildingRow Constructor
function BuildingRow(cards){
	this.base = Pile;
	this.base(5, cards);
}
BuildingRow.prototype = new Pile;

//Lane Constructor
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

//Hand constructor
function Hand(cards){
	this.base = Pile;
	this.base(8, cards)
}
Hand.prototype = new Pile;

//Deck constructor
function Deck(cards){
	this.base = Pile;
	this.base(25, cards);
}
Deck.prototype = new Pile;

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



// Card constructor, takes an option CryptoCardsNumber (ccnum), or all the
// necessary info to make a card.
function Card(ccnum, name, desc, stats, cost) {
	if (ccnum){
		// fetch from DB?
	} else {
		this.name = name;
		this.desc = desc;
		this.stats = stats;
		this.cost = cost;
	}
	this.print = printCard;
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
//screen with its bottom left corner at that point.
function drawSelf(point){
	
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
