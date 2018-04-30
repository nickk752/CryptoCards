/**
 * A deck loader, loads a deck from JSON and turns it into an array of cards. The first 3 cards are always
 * the base and the two energy buildings.
 */

var DeckLoader = {};

DeckLoader.loadDeck = function(deckString){

    // the entire deck as a string on one line
    // var deckJSONstr = '{"cards":[{"Name":"Lil Punchy","Type":"Creature","NCost":1,"LCost":0,"RCost":0,"Att":1,"Def":1,"Effect":"","NumInDeck":3},{"Name":"Lil Blocky","Type":"Creature","NCost":1,"LCost":0,"RCost":0,"Att":0,"Def":2,"Effect":"","NumInDeck":3},{"Name":"Mid Blocky","Type":"Creature","NCost":2,"LCost":0,"RCost":0,"Att":1,"Def":2,"Effect":"","NumInDeck":2},{"Name":"Mid Punchy","Type":"Creature","NCost":2,"LCost":0,"RCost":0,"Att":2,"Def":1,"Effect":"","NumInDeck":2},{"Name":"Lil Vamp","Type":"Creature","NCost":1,"LCost":1,"RCost":0,"Att":2,"Def":1,"Effect":"Lifesteal","NumInDeck":2},{"Name":"Lil Troll","Type":"Creature","NCost":1,"LCost":0,"RCost":1,"Att":1,"Def":2,"Effect":"Taunt","NumInDeck":2},{"Name":"Big Vamp","Type":"Creature","NCost":2,"LCost":0,"RCost":1,"Att":3,"Def":2,"Effect":"Lifesteal","NumInDeck":1},{"Name":"Big Troll","Type":"Creature","NCost":2,"LCost":1,"RCost":0,"Att":2,"Def":3,"Effect":"Taunt","NumInDeck":1},{"Name":"Big Punchy","Type":"Creature","NCost":3,"LCost":1,"RCost":0,"Att":4,"Def":2,"Effect":"","NumInDeck":1},{"Name":"Big Blocky","Type":"Creature","NCost":3,"LCost":0,"RCost":1,"Att":2,"Def":4,"Effect":"Taunt","NumInDeck":1},{"Name":"Hospital","Type":"Building","NCost":2,"LCost":1,"RCost":0,"Att":0,"Def":8,"Effect":"1 Def / turn","NumInDeck":1},{"Name":"Barrack","Type":"Building","NCost":2,"LCost":0,"RCost":1,"Att":0,"Def":8,"Effect":"1 Att / turn","NumInDeck":1},{"Name":"Biggs Lamb","Type":"Augment","NCost":2,"LCost":0,"RCost":0,"Att":0,"Def":0,"Effect":"Destroy creature","NumInDeck":2},{"Name":"DU Lift","Type":"Augment","NCost":3,"LCost":0,"RCost":0,"Att":0,"Def":0,"Effect":"Give +1/+1 Creature","NumInDeck":1},{"Name":"Thicc Walls","Type":"Augment","NCost":2,"LCost":0,"RCost":0,"Att":0,"Def":0,"Effect":"Building 0/+2","NumInDeck":1},{"Name":"Art Hillary","Type":"Augment","NCost":3,"LCost":0,"RCost":0,"Att":0,"Def":0,"Effect":"Deal 2 damage","NumInDeck":1}]}';
    //turning the JSON into a Javascript object
    console.log('DECK LOADER');
    console.log(deckString);
    var rawDeck = JSON.parse(deckString);
    console.log(rawDeck);
    var deck = [];

    //first we should create the base, and the two energy buildings, and push those into the array
    deck.push(makeBaseCard());
    deck.push(makeLEnergyBuilding());
    deck.push(makeREnergyBuilding());

    //then we create card objs and push the rest
    rawDeck.cards.forEach(rawCard => {
        var stats = new Stats(rawCard.Att, rawCard.Def);
        var cost = new Cost(rawCard.LCost, rawCard.NCost, rawCard.RCost);
        var effects = [rawCard.Effect];
        var desc = "" + rawCard.Type + "\n" + rawCard.Effect;
        var i;
        console.log('pushing');
        console.log('pushing');
        deck.push(new Card(null, rawCard.Name, desc, stats, cost, effects));
    
    });
    for (let i = 0; i < deck.length; i++){
        deck[i].setId(i);
    }
    console.log("Deckloader says deck is: ");
    console.log(deck);
    return deck;
};

makeLEnergyBuilding = function() {
    var stats = new Stats(0, 25);
    var cost = new Cost(0, 0, 0);
    var effects = [];
    var desc = "Building \n Your Base and \n scrap  \n generator";
    var base = new Card(null, "LeftBuilding", desc, stats, cost, effects);
    return base;
}

makeREnergyBuilding = function() {
    var stats = new Stats(0, 25);
    var cost = new Cost(0, 0, 0);
    var effects = [];
    var desc = "Building \n Your Base and \n scrap  \n generator";
    var base = new Card(null, "RightBuilding", desc, stats, cost, effects);
    return base;
}

makeBaseCard = function() {
    var stats = new Stats(0, 25);
    var cost = new Cost(0, 0, 0);
    var effects = [];
    var desc = "Building \n Your Base and \n scrap  \n generator";
    var base = new Card(null, "Base", desc, stats, cost, effects);
    return base;
};
