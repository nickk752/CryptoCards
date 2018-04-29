// Import Actions
import {
  ADD_CARD,
  ADD_CARDS,
  DELETE_CARD,
  ADD_DECK_TO_CARD,
  REMOVE_CARD,
} from './InventoryActions';

// Initial State
const initialState = { data: [] };

const CardReducer = (state = initialState, action) => {
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

    case ADD_DECK_TO_CARD:
      return {
        data: state.data.filter(card => card.cuid !== action.card.cuid),
        data: [action.card, ...state.data],
      };

    case REMOVE_CARD:
      return {
        // not sure about this
        data: state.data.filter(card => card.cuid !== action.card.cuid),
      }  

    default:
      return state;
  }
};

/* Selectors */

// get all cards
export const getCards = state => state.cards.data;

// get cards by user
export const getUserCards = (state, cuid) => state.cards.data.filter(card => card.owner === cuid);

// get card by cuid
export const getCard = (state, cuid) => state.cards.data.filter(card => card.cuid === cuid)[0];

//Export Reducer
export default CardReducer;
