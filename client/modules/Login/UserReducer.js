import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAIL, REGISTER_SUCCESS, REGISTER_REQUEST, RECIEVE_ACCOUNT, CHANGE_ACCOUNT } from './LoginActions';

// Initial State
const initialState = {
  data: {
    user: {
      username: '',
      password: '',
    },
  },
  ethAddress: 'none',
  isLoggedIn: false,
  loginToken: 'none',
  registering: false,
};

const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return Object.assign({}, state, {
        loggingIn: true,
      });

    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        user: action.user,
        // loginToken: action.user.username,
      });

    case LOGIN_FAIL:
      return {

      };

    case REGISTER_REQUEST:
      return {
        registering: true,
      };

    case REGISTER_SUCCESS:
      return Object.assign({}, state, {
        data: action.data,
        registering: false,
      });

    case RECIEVE_ACCOUNT:
      console.log("REDUCER");
      console.log(action.address);
      return {
        ...state,
        ethAddress: action.address,
        user: {
          username: action.address,
        },
      };

    case CHANGE_ACCOUNT:
      console.log("REDUCER");
      console.log(action.address);
      return {
        ...state,
        ethAddress: action.address,
        user: {
          username: action.address,
        },
      };

    default:
      return state;
  }
};

export const getUser = state => state.user.data;

export default UserReducer;
