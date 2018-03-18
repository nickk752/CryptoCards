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
newCard.slug = slug(newCard.name.toLowerCase(), { lowercase: true });
newCard.cuid = cuid();
newCard.save((err, saved) => {
    if(err) {
        res.status(500).send(err);
    }
    res.json({ card: saved });
});
}

 /**
 * Get a single post
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
 * Delete a post
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

