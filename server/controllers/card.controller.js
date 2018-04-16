import Card from '../models/card';
import cuid from 'cuid';
import slug from 'limax';
import sanitizeHtml from 'sanitize-html';

/**
 * Get all card
 * @param req
 * @param res
 * @returns void
 */

export function getCards(req, res) {
    Card.find().exec((err, cards) => {
        if(err) {
            res.status(500).send(err);
        }
        res.json({ cards });
    });
}

export function getUserCards(req, res) {
    var query = { owner: req.params.cuid };
    Card.find(query).exec((err, cards) => {
        if(err) {
            res.status(500).send(err);
        }
        res.json({ cards });
    });
}

/**
 * Save a card
 * @param req
 * @param res
 * @returns void
 */

export function addCard(req, res) {
if(!req.body.card.name || !req.body.card.owner){
        res.status(403).end();
}

const newCard = new Card(req.body.card);

// sanitize input and ur mum
newCard.name = sanitizeHtml(newCard.name);
newCard.owner = sanitizeHtml(newCard.owner);
newCard.type = sanitizeHtml(newCard.type);
newCard.attack = sanitizeHtml(newCard.attack);
newCard.defense = sanitizeHtml(newCard.defense);
newCard.slug = slug(newCard.name.toLowerCase(), { lowercase: true });
newCard.cuid = cuid();
newCard.decks = sanitizeHtml(newCard.decks);
newCard.tokenId = sanitizeHtml(newCard.tokenId);
newCard.save((err, saved) => {
    if(err) {
        res.status(500).send(err);
    }
    res.json({ card: saved });
});
}

// transfer card to new owner
export function transferCard(req, res) {
    console.log('card tokenId: ' + req.params.tokenId + ' owner: ' + req.params.ownerCuid);
    Card.findOneAndUpdate({ tokenId: req.params.tokenId }, { $set: { owner: req.params.ownerCuid } }).exec((err, card) => {
        if(err){
            res.status(500).send(err);
        }
        res.json( {card} )
    });
}

 /**
 * Get a single card
 * @param req
 * @param res
 * @returns void
 */
export function getCard(req, res) {
    Card.findOne({ cuid: req.params.cuid }).exec((err, card) => {
      if (err) {
        res.status(500).send(err);
      }
      res.json({ card });
    });
}

/**
 * Delete a card
 * @param req
 * @param res
 * @returns void
 */
export function deleteCard(req, res) {
    Card.findOne({ cuid: req.params.cuid }).exec((err, card) => {
        if (err) {
            res.status(500).send(err);
        }

        card.remove(() => {
            res.status(200).end();
        });
    });
}

export function addDeckToCard(req, res) {
    console.log('card and deck: ' + req.params.cardCuid + ', ' + req.params.deckCuid);
    Card.findOneAndUpdate({ cuid: req.params.cardCuid }, { $push: { decks: req.params.deckCuid } }).exec((err, card) => {
        if(err){
            res.status(500).send(err);
        }
        res.json( {card} )
    });
}
