import callApi from '../../util/apiCaller';

export const ADD_GAME = 'ADD_GAME';


export function fetchGame(cuid) {
  return (dispatch) => {
    return callApi(`game/${cuid}`).then(res => dispatch(addGame(res.game)));
  };
}

