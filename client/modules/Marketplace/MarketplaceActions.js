import callApi from '../../util/apiCaller';

// Export Constants
export const ADD_AUCTION = 'ADD_AUCTION';
export const ADD_AUCTIONS = 'ADD_AUCTIONS';
export const DELETE_AUCTION = 'DELETE_AUCTION';
export const TOGGLE_CREATE_AUCTION = 'TOGGLE_CREATE_AUCTION';

// Export Actions
export function addAuction(auction) {
  return {
    type: ADD_AUCTION,
    auction,
  };
}

export function addAuctionRequest(auction) {
  return (dispatch) => {
    return callApi('auctions', 'post', {
      auction: {
        seller: auction.seller,
        card: auction.card,
      },
    }).then(res => dispatch(addAuction(res.auction)));
  };
}

export function addAuctions(auctions) {
  return {
    type: ADD_AUCTIONS,
    auctions,
  };
}

export function fetchAuctions() {
  return (dispatch) => {
    return callApi('auctions').then(res => {
      dispatch(addAuctions(res.auctions));
    });
  };
}

export function fetchAuction(cuid) {
  return (dispatch) => {
    return callApi(`auctions/${cuid}`).then(res => dispatch(addAuction(res.auction)));
  };
}

export function deleteAuction(cuid) {
  return {
    type: DELETE_AUCTION,
    cuid,
  };
}

export function deleteAuctionRequest(cuid) {
  return (dispatch) => {
    return callApi(`auctions/${cuid}`, 'delete').then(() => dispatch(deleteAuction(cuid)));
  };
}

export function toggleCreateAuction() {
  return {
    type: TOGGLE_CREATE_AUCTION,
  };
}