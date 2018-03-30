import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  game: { type: 'String', required: true },
  cuid: { type: 'String', required: true },
});

export default mongoose.model('Game', gameSchema);
