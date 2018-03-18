// Import Actions
import { ADD_CARD, ADD_CARDS, DELETE_CARD  } from './InventoryActions';

// Initial State
const initialState = { data: [] };

const InventoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_CARD:
        return{
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

    default:
      return state;
  }
};

/* Selectors */

//get all cards that belong to user
export const getCards = state => state.cards.data;

// get card by cuid
export const getCard = (state, cuid) => state.cards.data.filter(card => card.cuid === cuid)[0];

//Export Reducer
export default InventoryReducer;