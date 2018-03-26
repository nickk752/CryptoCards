// Import Actions
import { 
    ADD_DECK, 
    ADD_DECKS, 
    DELETE_DECK } from './InventoryActions';

// Initial State
const initialState = { data: [] };


const DeckReducer = (state = initialState, action) => {
    switch (action.type) {
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
  
      default:
          return state;
    }
};
  
/* Selectors */

// get all decks 
export const getDecks = state => state.decks.data;

// get deck by cuid
export const getDeck = (state, cuid) => state.decks.data.filter(deck => deck.cuid === cuid)[0];

//Export Reducer
export default DeckReducer;
