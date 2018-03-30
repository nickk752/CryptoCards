import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
// import { Link } from 'react-router';
// import { FormattedMessage } from 'react-intl';

// Import Style
// import styles from './Login.css';

export function Login(props) {
  return (
    <div>
      <div>
        <form onSubmit={props.handleLogin}>
          <label>
            Username:
            <input type="text" name="name" />
          </label>
          <input type="submit" value="Login" />
        </form>
      </div>
    </div>
  );
}

Login.contextTypes = {
  router: React.PropTypes.object,
};

Login.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  handleLogin: PropTypes.func.isRequired,
};

export default Login;
