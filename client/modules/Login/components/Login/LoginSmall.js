import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
// import { Link } from 'react-router';
// import { FormattedMessage } from 'react-intl';

// Import Style
// import styles from './Login.css';

// import { loginRequest } from '../../LoginActions';

// import { getUser } from '../../UserReducer';

export function LoginSmall(props) {
  const handleSubmit = props.handleSubmit;
  const handleChange = props.handleChange;
  const { user, submitted, loggingIn } = props;
  const { username, password } = user;
  // console.log('user');
  console.log(username);
  return (
    <div>
      <form name="login" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input type="text" name="username" value={username} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" value={password} onChange={handleChange} />
        </div>
        <div>
          <button className="btn btn-primary">Login</button>
          {loggingIn &&
            <img src="../../../../components/WANG.jpg" role="presentation" />
          }
          <Link to="/register" className="btn btn-link">Register</Link>
        </div>
      </form>
    </div>
  );
}

LoginSmall.propTypes = {
  dispatch: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  loggingIn: PropTypes.bool.isRequired,
  submitted: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  user: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
  }).isRequired,
};

export default LoginSmall;
