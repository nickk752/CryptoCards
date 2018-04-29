import Deck from '../models/deck';
import cuid from 'cuid';
import slug from 'limax';
import sanitizeHtml from 'sanitize-html';

/**
 * Get all decks
 * @param req
 * @param res
 * @returns void
 */

export function getDecks(req, res) {
  Deck.find().exec((err, decks) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ decks });
  });
}

export function getUserDecks(req, res) {
  var query = { owner: req.params.cuid }
  Deck.find(query).exec((err, decks) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ decks });
  });
}

/**
 * Save a deck
 * @param req
 * @param res
 * @returns void
 */

export function addDeck(req, res) {
  if (!req.body.deck.name || !req.body.deck.owner) {
    res.status(403).end();
  }

  const newDeck = new Deck(req.body.deck);

  // sanitize input and ur mum
  newDeck.number = sanitizeHtml(newDeck.number);
  newDeck.name = sanitizeHtml(newDeck.name);
  newDeck.owner = sanitizeHtml(newDeck.owner);
  newDeck.cards = sanitizeHtml(newDeck.cards);
  newDeck.slug = slug(newDeck.name.toLowerCase(), { lowercase: true });
  newDeck.cuid = cuid();
  newDeck.save((err, saved) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ deck: saved });
  });
}

/**
* Get a single deck
* @param req
* @param res
* @returns void
*/
export function getDeck(req, res) {
  Deck.findOne({ cuid: req.params.cuid }).exec((err, deck) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ deck });
  });
}

/**
 * Delete a deck
 * @param req
 * @param res
 * @returns void
 */
export function deleteDeck(req, res) {
  Deck.findOne({ cuid: req.params.cuid }).exec((err, deck) => {
    if (err) {
      res.status(500).send(err);
    }

    deck.remove(() => {
      res.status(200).end();
    });
  });
}

export async function activate(req, res) {
  let deactive = await Deck.update({ owner: req.params.userCuid, cuid: { $ne: req.params.deckCuid } }, { active: false }, ).exec((err, deck) => {
    if (err) {
      res.status(500).send(err);
    }
  });
  let active = await Deck.findOneAndUpdate({ cuid: req.params.deckCuid }, { active: true }).exec((err, deck) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ deck });
  });
}
