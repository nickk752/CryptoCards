import callApi from '../../util/apiCaller';
// import { web3, accounts, coreAbi, auctionAbi } from '../../util/blockchainApiCaller';

// Export Constants
export const ADD_AUCTION = 'ADD_AUCTION';
export const ADD_AUCTIONS = 'ADD_AUCTIONS';
export const DELETE_AUCTION = 'DELETE_AUCTION';
export const TOGGLE_CREATE_AUCTION = 'TOGGLE_CREATE_AUCTION';

import { getAuctions } from '../../util/blockchainApiCaller';

// Export Actions
export function addAuction(auction) {
  return {
    type: ADD_AUCTION,
    auction,
  };
}

export function addAuctionRequest(auction) {
  return (dispatch) => {
    console.log('adddddauction')
    console.log(auction)
    return callApi('auctions', 'post', {
      auction: {
        seller: auction.seller,
        card: auction.card,
        startPrice: auction.startPrice,
        endPrice: auction.endPrice,
        duration: auction.duration,
        tokenId: auction.tokenId,
      },
    }).then(res => {
      console.log(res.auction)
      dispatch(addAuction(res.auction))
    });
  };
}

export function addAuctions(auctions) {
  return {
    type: ADD_AUCTIONS,
    auctions,
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

export function fetchAuctions() {
  return (dispatch) => {
    let dbAuctions;
    let dbAuctionsFinal = [];
    let replaced = [];
    return callApi('auctions').then(res => {
      dbAuctions = res.auctions;
      return getAuctions().then(result => {
        console.log('dbauctions');
        console.log(dbAuctions);
        const dbTokens = {};
        dbAuctions.forEach((auc) => {
          dbTokens[auc.tokenId] = auc.cuid;
        });

        console.log('auctions')
        console.log(result);
        result.forEach((auc) => {
          if (auc.tokenId in dbTokens) {
            if (auc.cuid !== dbTokens[auc.tokenId]) {
              dispatch(deleteAuctionRequest(dbTokens[auc.tokenId]));
              dispatch(addAuctionRequest(auc));
              replaced.push(auc.tokenId);
            }
          } else {
            dispatch(addAuctionRequest(auc));
          }
        });
        dbAuctions.forEach(auc => {
          if (replaced.indexOf(auc.tokenId) <= -1) {
            dbAuctionsFinal.push(auc);
          }
        });

        dispatch(addAuctions(dbAuctionsFinal));
      });

    });
  };
}

export function fetchAuction(cuid) {
  return (dispatch) => {
    return callApi(`auctions/${cuid}`).then(res => dispatch(addAuction(res.auction)));
  };
}

export function toggleCreateAuction() {
  return {
    type: TOGGLE_CREATE_AUCTION,
  };
}