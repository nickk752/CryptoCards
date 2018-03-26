import callApi from '../../util/apiCaller';

export const SESSION_LOGIN_SUCCESS = 'SESSION_LOGIN_SUCCESS';
export const SESSION_LOGIN_FAIL = 'SESSION_LOGIN_FAIL';

// Actions
export function loginSuccess(user) {
  return {
    type: SESSION_LOGIN_SUCCESS,
    user,
  };
}

export function loginFail(user) {
  return {
    type: SESSION_LOGIN_FAIL,
    user,
  };
}

// export const loginRequest = async (login, password) => {
//   return await new Promise((resolve) => {
//     setTimeout(() => {
//       resolve();
//     }, 200);
//   }).then(() => {
//     if (login === 'nick' && password === 'nick') {
//       return loginSuccess('www.cryptocards.com');
//     } else {
//       return loginFail('invalid');
//     }
//   });
// };

export function login(user) {
  return {
    type: SESSION_LOGIN_SUCCESS,
    user,
  };
}

export function loginRequest(user) {
  return (dispatch) => {
    return callApi('user', 'get', {
      user: {
        username: user.username,
        password: user.password,
      },
    }).then(res => dispatch(login(res.user)));
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
