// Import Actions
import { 
    ADD_DECK, 
    ADD_DECKS, 
    DELETE_DECK,
    TOGGLE_ADD_CARD_DECK,
    ADD_DECK_TO_CARD, } from './InventoryActions';

// Initial State
const initialState = { showAddCardDeck: false, data: [] };


const DeckReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_DECK:
            return {
                showAddCardDeck: state.showAddCardDeck,
                data: [action.deck, ...state.data],
            };    
        
        case ADD_DECKS:
            return {
                showAddCardDeck: state.showAddCardDeck,
                data: action.decks,
            };
            
        case DELETE_DECK:
            return {
                showAddCardDeck: state.showAddCardDeck,
                data: state.data.filter(deck => deck.cuid !== action.cuid),
            };    
            
        case TOGGLE_ADD_CARD_DECK:
            return {
                showAddCardDeck: !state.showAddCardDeck,
                data: state.data,
            };     

        default:
            return state;
        }
};
  
/* Selectors */

// get all decks 
export const getDecks = state => state.decks.data;

// get deck by cuid
export const getDeck = (state, cuid) => state.decks.data.filter(deck => deck.cuid === cuid)[0];

// Get showAddCardDeck
export const getShowAddCardDeck = state => state.decks.showAddCardDeck;

//Export Reducer
export default DeckReducer;
