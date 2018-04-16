import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const auctionSchema = new Schema({
  seller: { type: 'String', required: true },
  startPrice: { type: 'String', required: true },
  endPrice: { type: 'String', required: true },
  duration: { type: 'String', required: true },
  card: { type: 'String', required: true },
  slug: { type: 'String', required: true },
  cuid: { type: 'String', required: true },
  tokenId: { type: 'String', required: true },
  dateAdded: { type: 'Date', default: Date.now, required: true },
});

export default mongoose.model('Auction', auctionSchema);
