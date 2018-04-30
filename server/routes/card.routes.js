import { Router } from 'express';
import * as CardController from '../controllers/card.controller';
const router = new Router();

// get all Cards. This should not be used for production
router.route('/cards').get(CardController.getCards);

// get all Cards for specific user
router.route('/cards/users/:cuid').get(CardController.getUserCards);

// get one card by cuid
router.route('/cards/:cuid').get(CardController.getCard);

// add a new card. 
router.route('/cards').post(CardController.addCard);

// card transfer
router.route('/cards/transfer/:tokenId-:ownerCuid').post(CardController.transferCard);

// delete a card by cuid
router.route('/cards/:cuid').delete(CardController.deleteCard);

// add a deck to card
router.route('/cards/:cardCuid-:deckCuid').post(CardController.addDeckToCard);

// remove card from deck
router.route('/cards/remove/:cardCuid-:deckCuid').post(CardController.removeCard);

export default router;
