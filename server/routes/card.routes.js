import { Router } from 'express';
import * as CardController from '../controllers/card.controller';
const router = new Router();

// get all Cards. This should not be used for production
router.route('/cards').get(CardController.getCards);

// TODO: get all Cards for specific user


// get one card by cuid
router.route('/cards/:cuid').get(CardController.getCard);

// add a new card. Dont use for production
router.route('/cards').post(CardController.addCard);//TODO: change to userid

// TODO: add a card for user

// delete a card by cuid
router.route('/cards/:cuid').delete(CardController.deleteCard);

export default router;
