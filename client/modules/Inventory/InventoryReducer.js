// Import Actions
import { 
    ADD_CARD, 
    ADD_CARDS, 
    DELETE_CARD, 
    ADD_DECK, 
    ADD_DECKS, 
    DELETE_DECK,
    TOGGLE_ADD_CARD_DECK } from './InventoryActions';

// Initial State
const initialState = { showAddCardDeck: false, data: [] };

const InventoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_CARD:
        return {
            data: [action.card, ...state.data],
        };

    case ADD_CARDS:
        return {
            data: action.cards,
        };

    case DELETE_CARD:
        return {
            data: state.data.filter(card => card.cuid !== action.cuid),
        };

    case ADD_DECK:
        return {
            data: [action.deck, ...state.data],
        };    
    
    case ADD_DECKS:
        return {
            data: action.decks,
        };
        
    case DELETE_DECK:
        return {
            data: state.data.filter(deck => deck.cuid !== action.cuid),
        };
    
    case TOGGLE_ADD_CARD_DECK:
        return {
            showAddCardDeck: !state.showAddCardDeck,
        };    
        
    default:
        return state;
  }
};

/* Selectors */

// get all cards TODO: for user
export const getCards = state => state.cards.data;

// get card by cuid
export const getCard = (state, cuid) => state.cards.data.filter(card => card.cuid === cuid)[0];

// get all decks TODO: for user
export const getDecks = state => state.decks.data;

// get deck by cuid
export const getDeck = (state, cuid) => state.decks.data.filter(deck => deck.cuid === cuid)[0];

// Get showAddCardDeck
export const getShowAddCardDeck = state => state.decks.showAddCardDeck;

//Export Reducer
export default InventoryReducer;
