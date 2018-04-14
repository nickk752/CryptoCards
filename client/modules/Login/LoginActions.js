import callApi from '../../util/apiCaller';
import { Redirect } from 'react-router';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAIL = 'REGISTER_FAIL';
export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const RECEIVE_ACCOUNT = 'web3/RECEIVE_ACCOUNT';
export const CHANGE_ACCOUNT = 'web3/CHANGE_ACCOUNT';

// Actions
export function loginSuccess(user) {
  return {
    type: LOGIN_SUCCESS,
    user,
  };
}

export function loginFail(user) {
  return {
    type: LOGIN_FAIL,
    user,
  };
}


export function registerSuccess(user) {
  return {
    type: REGISTER_SUCCESS,
    user,
  };
}

export function registerFail() {
  return {
    type: REGISTER_FAIL,
  };
}

export function registerRequest(user) {
  return (dispatch) => {
    callApi('users/register', 'POST', {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        password: user.password,
      },
    }).then((res, err) => {
      if (err) {
        dispatch(registerFail());
      } else {
        dispatch(registerSuccess(res.user));
      }
    });
  };
}

export function loginRequest(user) {
  return (dispatch) => {
    return callApi('users/authenticate', 'post', {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
    }).then((res, err) => {
      if (err) {
        dispatch(loginFail());
      } else {
        dispatch(loginSuccess(res.user));
      }
    });
  };
}

// export const loginAsync = (loginObj, push) => {
//   return (dispatch, getState) => {
//     const loginToken = loginRequest(loginObj.user, loginObj.password);

//     if (loginToken !== 'invalid') {
//       dispatch(loginSuccess(loginToken));
//       push('/dashboard');
//     } else {
//       dispatch(loginFail(loginToken));
//     }
//   };
// };
