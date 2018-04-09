import {
  ADD_AUCTION,
  ADD_AUCTIONS,
  DELETE_AUCTION,
  TOGGLE_CREATE_AUCTION,
} from './MarketplaceActions';

// Initial State
const initialState = {
  showCreateAuction: false,
  data: [],
};

const MarketplaceReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_AUCTION :
      return {
        showCreateAuction: state.showCreateAuction,
        data: [action.auction, ...state.data],
      };

    case ADD_AUCTIONS :
      return {
        showCreateAuction: state.showCreateAuction,
        data: action.auctions,
      };
    case DELETE_AUCTION :
      return {
        showCreateAuction: state.showCreateAuction,
        data: state.data.filter(auction => auction.cuid !== action.cuid),
      };

    case TOGGLE_CREATE_AUCTION :
      return{
        showCreateAuction: !state.showCreateAuction,
        data: state.data,
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

// Get showCreateAuction
export const getShowCreateAuction = state => state.auctions.showCreateAuction;

// Export Reducer
export default MarketplaceReducer;
