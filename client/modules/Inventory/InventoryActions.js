import callApi from '../../util/apiCaller';

/* Export Constants */
// Cards
export const ADD_CARD = 'ADD_CARD';
export const ADD_CARDS = 'ADD_CARDS';
export const DELETE_CARD = 'DELETE_CARD';
// Decks
export const ADD_DECK = 'ADD_DECK';
export const ADD_DECKS = 'ADD_DECKS';
export const DELETE_DECK = 'DELETE_DECK';

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
    return callApi('cards', 'card', {
      card: {
        name: card.name,
        owner: card.owner,
        type: card.type,
        attack: card.attack,
        defense: card.defense,
        decks: card.decks,
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

export function fetchCards() {
  return (dispatch) => {
    return callApi('cards').then(res => {
      dispatch(addCards(res.cards));
    });
  };
}

export function fetchUserCards(cuid) {
  return (dispatch) => {
    return callApi(`cards/users/${cuid}`).then(res => {
      dispatch(addCards(res.cards));
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
    return callApi('decks', 'deck', {
      deck: {
        number: deck.number,
        name: deck.name,
        owner: deck.owner,
        cards: deck.cards,
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
  };
}
