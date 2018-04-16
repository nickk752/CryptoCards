import Auction from '../models/auction';
import cuid from 'cuid';
import slug from 'limax';
import sanitizeHtml from 'sanitize-html';

/**
 * Get all auctions
 * @param req
 * @param res
 * @returns void
 */
export function getAuctions(req, res) {
  Auction.find().exec((err, auctions) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ auctions });
  });
}

/**
 * Save a auction
 * @param req
 * @param res
 * @returns void
 */
export function addAuction(req, res) {
  if (!req.body.auction.seller || !req.body.auction.card) {
    res.status(403).end();
  }

  const newAuction = new Auction(req.body.auction);

  // Let's sanitize inputs
  newAuction.seller = sanitizeHtml(newAuction.seller);
  newAuction.card = sanitizeHtml(newAuction.card);
  newAuction.startPrice = sanitizeHtml(newAuction.startPrice);
  newAuction.endPrice = sanitizeHtml(newAuction.endPrice);
  newAuction.duration = sanitizeHtml(newAuction.duration);
  newAuction.slug = slug(newAuction.card.toLowerCase(), { lowercase: true });
  newAuction.cuid = cuid();
  newAuction.tokenId = sanitizeHtml(newAuction.tokenId);
  newAuction.save((err, saved) => {
    if (err) {
      console.log("ERROR")
      console.log(err);
      res.status(500).send(err);
    }
    console.log("NO ERROR")
    res.json({ auction: saved });
  });
}

/**
 * Get a single auction
 * @param req
 * @param res
 * @returns void
 */
export function getAuction(req, res) {
  Auction.findOne({ cuid: req.params.cuid }).exec((err, auction) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ auction });
  });
}

/**
 * Delete a auction
 * @param req
 * @param res
 * @returns void
 */
export function deleteAuction(req, res) {
  Auction.findOne({ cuid: req.params.cuid }).exec((err, auction) => {
    if (err) {
      res.status(500).send(err);
    }

    auction.remove(() => {
      res.status(200).end();
    });
  });
}
