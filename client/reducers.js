/**
 * Root Reducer
 */
import { combineReducers } from 'redux';

// Import Reducers
import app from './modules/App/AppReducer';
import posts from './modules/Post/PostReducer';
import intl from './modules/Intl/IntlReducer';
import auctions from './modules/Marketplace/MarketplaceReducer';
//import login from './modules/Login/LoginReducer';
// import game from './modules/Game/GameReducer';
import { reducer as form } from 'redux-form';
import cards from './modules/Inventory/CardReducer';
import decks from './modules/Inventory/DeckReducer';

// Combine all reducers into one root reducer
export default combineReducers({
  app,
  posts,
  auctions,
  intl,
  //login,
  //form,
  // game,
  cards,
  decks,
});
