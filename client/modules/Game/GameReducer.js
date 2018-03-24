import { ADD_GAME } from './GameActions';

// Initial State
const initialState = { data: [] };

const GameReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_GAME :
      return {
        data: [action.game, ...state.data],
      };

    default :
      return state;
  }
};

/* Selectors */

// Gets the game object
export const getGame = (state, cuid) => state.game.data.filter(game => game.cuid === cuid)[0];

export const getGames = state => state.game.data;

// Export Reducer
export default GameReducer;
