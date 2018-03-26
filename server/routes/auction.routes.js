import { Router } from 'express';
import * as AuctionController from '../controllers/auction.controller';
const router = new Router();

// Get all Auctions
router.route('/auctions').get(AuctionController.getAuctions);

// Get one auction by cuid
router.route('/auctions/:cuid').get(AuctionController.getAuction);

// Add a new Auction
router.route('/auctions').post(AuctionController.addAuction);

// Delete an Auction by cuid
router.route('/auctions/:cuid').delete(AuctionController.deleteAuction);

export default router;
