import callApi from '../../util/apiCaller';
import { getCardsForUser } from '../../util/blockchainApiCaller';

/* Export Constants */
// Cards
export const ADD_CARD = 'ADD_CARD';
export const ADD_CARDS = 'ADD_CARDS';
export const DELETE_CARD = 'DELETE_CARD';
export const ADD_DECK_TO_CARD = 'ADD_DECK_TO_CARD';
export const TRANSFER_CARD = 'TRANSFER_CARD';
export const REMOVE_CARD = 'REMOVE_CARD';
// Decks
export const ADD_DECK = 'ADD_DECK';
export const ADD_DECKS = 'ADD_DECKS';
export const DELETE_DECK = 'DELETE_DECK';
export const TOGGLE_ADD_CARD_DECK = 'TOGGLE_ADD_CARD_DECK';
export const TOGGLE_ACTIVE = 'TOGGLE_ACTIVE';

/* Export Actions */
// Cards
export function addCard(card) {
  return {
    type: ADD_CARD,
    card,
  };
}

export function addCardRequest(card) {
  return (dispatch) => {
    return callApi('cards', 'post', {
      card: {
        name: card.name,
        owner: card.owner,
        type: card.type,
        attack: card.attack,
        defense: card.defense,
        decks: card.decks,
        tokenId: card.tokenId,
        isCombining: card.isCombining,
        isReady: card.isReady,
        cooldownIndex: card.cooldownIndex,
        nextActionAt: card.nextActionAt,
        combiningWithId: card.combiningWithId,
        spawnTime: card.spawnTime,
        firstIngredientId: card.firstIngredientId,
        secondIngredientId: card.secondIngredientId,
        generation: card.generation,
      },
    }).then(res => dispatch(addCard(res.card)));
  };
}

export function addCards(cards) {
  return {
    type: ADD_CARDS,
    cards,
  };
}

export function transferCard(card) {
  return {
    type: TRANSFER_CARD,
    card,
  };
}

export function transferCardRequest(tokenId, ownerCuid) {
  return (dispatch) => {
    return callApi(`cards/transfer/${tokenId}-${ownerCuid}`, 'post')
      .then(res => dispatch(transferCard(res.card)));
  };
}


export function fetchCards() {
  return (dispatch) => {
    return callApi('cards').then(res => {
      dispatch(addCards(res.cards));
    });
  };
}

export function fetchUserCards(owner) {
  return (dispatch) => {
    let dbCards;
    let bcCards;
    return callApi(`cards/users/${owner}`).then(res => {
      dbCards = res.cards;
      return getCardsForUser(owner).then((result) => {
        bcCards = result;
        console.log('db');
        console.log(dbCards);
        console.log('bc');
        console.log(bcCards);
        bcCards.forEach(card => {
          console.log('bouta add')
          console.log(card);
          dispatch(addCardRequest({
            name: card.name,
            owner,
            type: card.type,
            attack: card.attack,
            defense: card.defense,
            decks: card.decks,
            tokenId: card.tokenId,
            isCombining: card.isCombining,
            isReady: card.isReady,
            cooldownIndex: card.cooldownIndex,
            nextActionAt: card.nextActionAt,
            combiningWithId: card.combiningWithId,
            spawnTime: card.spawnTime,
            firstIngredientId: card.firstIngredientId,
            secondIngredientId: card.secondIngredientId,
            generation: card.generation,
          }));
        })
        //dispatch(addCards(result));
      });
    });
  };
}

export function fetchCard(cuid) {
  return (dispatch) => {
    return callApi(`cards/${cuid}`).then(res => dispatch(addCard(res.card)));
  };
}

export function deleteCard(cuid) {
  return {
    type: DELETE_CARD,
    cuid,
  };
}

export function deleteCardRequest(cuid) {
  return (dispatch) => {
    return callApi(`cards/${cuid}`, 'delete').then(() => dispatch(deleteCard(cuid)));
  };
}

// Decks
export function addDeck(deck) {
  return {
    type: ADD_DECK,
    deck,
  };
}

export function addDeckRequest(deck) {
  return (dispatch) => {
    return callApi('decks', 'post', {
      deck: {
        number: deck.number,
        name: deck.name,
        owner: deck.owner,
        active: deck.active,
      },
    }).then(res => dispatch(addDeck(res.deck)));
  };
}

export function addDecks(decks) {
  return {
    type: ADD_DECKS,
    decks,
  };
}

export function fetchDecks() {
  return (dispatch) => {
    return callApi('decks').then(res => {
      dispatch(addDecks(res.decks));
    });
  };
}

export function fetchUserDecks(cuid) {
  return (dispatch) => {
    return callApi(`decks/users/${cuid}`).then(res => {
      dispatch(addDecks(res.decks));
    });
  };
}

export function fetchDeck(cuid) {
  return (dispatch) => {
    return callApi(`decks/${cuid}`).then(res => dispatch(addDeck(res.deck)));
  };
}

export function deleteDeck(cuid) {
  return {
    type: DELETE_DECK,
    cuid,
  };
}

export function deleteDeckRequest(cuid) {
  return (dispatch) => {
    return callApi(`decks/${cuid}`, 'delete').then(() => dispatch(deleteDeck(cuid)));
  }
}

export function toggleAddCardDeck() {
  return {
    type: TOGGLE_ADD_CARD_DECK,
  };
}


export function addDeckToCardRequest(cardCuid, deckCuid) {
  return (dispatch) => {
    return callApi(`cards/${cardCuid}-${deckCuid}`, 'post', )
      .then(res => dispatch(addDeckToCard(res.card)));
  };
}

export function addDeckToCard(card) {
  return {
    type: ADD_DECK_TO_CARD,
    card,
  }
}

export function removeCardRequest(cardCuid, deckCuid) {
  return (dispatch) => {
    return callApi(`cards/remove/${cardCuid}-${deckCuid}`, 'post', )
      .then(res => dispatch(removeCard(cardCuid, deckCuid)));
  };
}

export function removeCard(cardCuid, deckCuid) {
  return {
    type: REMOVE_CARD,
    cardCuid,
  }
}

// activateing deck and un-activating all others
export function activateRequest(userCuid, deckCuid) {
  return (dispatch) => {
    return callApi(`decks/activate/${userCuid}-${deckCuid}`, 'post', )
      .then(res => dispatch(activate(deckCuid)));
  }
}

export function activate(deckCuid) {
  return {
    type: TOGGLE_ACTIVE,
    deckCuid,
  }
}
