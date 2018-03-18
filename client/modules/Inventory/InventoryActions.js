import callApi from '../../util/apiCaller';

// Export Constants
export const ADD_CARD = 'ADD_CARD';
export const ADD_CARDS = 'ADD_CARDS';
export const DELETE_CARD = 'DELETE_CARD';

// Export Actions
export function addCard(card){
    return{
        type: ADD_CARD,
        card,
    };
}

export function addCardRequest(card){
    return(dispatch) => {
        return callApi('cards', 'card', {
            card: {
              //figure out card attributes here
              name: card.name,
              owner: card.owner,
            },
        }).then(res => dispatch(addCard(res.card)));
    };
}

export function addCards(cards){
    return{
        type: ADD_CARDS,
        cards,
    };
}

export function fetchCards(){
    return(dispatch) => {
        return callApi('cards').then(res => {
            dispatch(addCards(res.cards));
        });
    };
}

export function fetchCard(cuid){
    return(dispatch) => {
        return callApi(`cards/${cuid}`).then(res => dispatch(addCard(res.card)));
    };
}

export function deleteCard(cuid){
    return{
        type: DELETE_CARD,
        cuid,
    };
}

export function deleteCardRequest(cuid) {
    return (dispatch) => {
        return callApi(`cards/${cuid}`, 'delete').then(() => dispatch(deleteCard(cuid)));
    };
}
