import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const deckSchema = new Schema({
    number: { type: 'Number', required: true},
    name: { type: 'String', required: true },
    owner: { type: 'String', required: true },
    // Uncertain if card references should be kept in decks
    //cards: { type: 'Array', required: true},
    slug: { type: 'String', required: true },
    cuid: { type: 'String', required: true },
    dateAdded: { type: 'Date', default: Date.now, required: true },
});

export default mongoose.model('Deck', deckSchema);