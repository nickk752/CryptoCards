/**
 * Root Reducer
 */
import { combineReducers } from 'redux';

// Import Reducers
import app from './modules/App/AppReducer';
import posts from './modules/Post/PostReducer';
import intl from './modules/Intl/IntlReducer';
import cards from './modules/Inventory/CardReducer';
import decks from './modules/Inventory/DeckReducer';

// Combine all reducers into one root reducer
export default combineReducers({
  app,
  posts,
  intl,
  //add cards reducer here
  cards,
  decks,
});
