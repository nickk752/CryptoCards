import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const cardSchema = new Schema({
  name: { type: 'String', required: true },
  owner: { type: 'String', required: true },
  type: { type: 'String', required: true },
  attack: { type: 'String', required: true },
  defense: { type: 'String', required: true },
  isCombining: { type: 'Boolean', required: true },
  isReady: { type: 'Boolean', required: true },
  cooldownIndex: { type: 'String', required: true },
  nextActionAt: { type: 'String', required: true },
  combiningWithId: { type: 'String', required: true },
  spawnTime: { type: 'String', required: true },
  firstIngredientId: { type: 'String', required: true },
  secondIngredientId: { type: 'String', required: true },
  generation: { type: 'String', required: true },
  /*  nCost: { type: 'Number', required: true},
   lCost: { type: 'Number', required: true},
   rCost: { type: 'Number', required: true}, */
  //effect: { type: 'String', required: true},
  // still very uncertain if we should store deck reference in card documents or the other way around
  decks: [{ type: 'String', required: false }],
  slug: { type: 'String', required: true },
  cuid: { type: 'String', required: true },
  tokenId: { type: 'String', required: true },
  dateAdded: { type: 'Date', default: Date.now, required: true },
});

export default mongoose.model('Card', cardSchema);
