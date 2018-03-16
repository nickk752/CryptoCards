import {
  ADD_AUCTION,
  ADD_AUCTIONS,
  DELETE_AUCTION,
} from './MarketplaceActions';

// Initial State
const initialState = {
  data: [],
};

const MarketplaceReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_AUCTION :
      return {
        data: [action.auction, ...state.data],
      };

    case ADD_AUCTIONS :
      return {
        data: action.auction,
      };
    case DELETE_AUCTION :
      return {
        data: state.data.filter(auction => auction.cuid !== action.cuid),
      };

    default :
      return state;
  }
};

/* Selectors */

// Get all auctions
export const getAuctions = state => state.auctions.data;

// Get auction by cuid
export const getAuction = (state, cuid) => state.auctions.data.filter(auction => auction.cuid === cuid)[0];

// Export Reducer
export default MarketplaceReducer;
