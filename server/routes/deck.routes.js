import { Router } from 'express';
import * as DeckController from '../controllers/deck.controller';
const router = new Router();

// get all Decks. This should not be used for production
router.route('/decks').get(DeckController.getDecks);

// get all Decks for specific user
router.route('/decks/users/:cuid').get(DeckController.getUserDecks);

// get one deck by cuid
router.route('/decks/:cuid').get(DeckController.getDeck);

// add a new deck. 
router.route('/decks').post(DeckController.addDeck);//TODO: change to userid

// delete a deck by cuid
router.route('/decks/:cuid').delete(DeckController.deleteDeck);

// Set Deck to active and set all other decks from user to inactive
router.route('/decks/activate/:userCuid-:deckCuid').post(DeckController.activate);

export default router;
