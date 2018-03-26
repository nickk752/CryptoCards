import { Router } from 'express';
import * as GameController from '../controllers/game.controller';
const router = new Router();

router.route('/game').get(GameController.getGames);

router.route('/game/:cuid').get(GameController.getGame);

router.route('/game').post(GameController.addGame);

export default router;
