import { SESSION_LOGIN_SUCCESS, SESSION_LOGIN_FAIL } from './LoginActions';

// Initial State
const initialState = {
  isLoggedIn: true,
  loginToken: 'none',
};

const LoginReducer = (state = initialState, action) => {
  switch (action.type) {
    case SESSION_LOGIN_SUCCESS:
      return {
        data: [action.user, ...state.data],
      };

    case SESSION_LOGIN_FAIL:
      return {
        data: [action.user, ...state.data],
      };

    default:
      return state;
  }
};

export default LoginReducer;
