import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form';
// import { Link } from 'react-router';
// import { FormattedMessage } from 'react-intl';

// Import Style
// import styles from './Login.css';


let LoginForm = props => {
  const { handleSubmit, pristine, reset, submitting } = props;
  return (
    <form onSubmit={handleSubmit}>
      <Field type="text" component="input" name="username" placeholder="Username" />
      <Field type="password" component="input" name="password" placeholder="Password" />
      <div>
        <button type="submit" disabled={pristine || submitting}>Log In</button>
        <button type="button" disabled={pristine || submitting} onClick={reset}>Clear Values</button>
      </div>
    </form>
  );
};

LoginForm.contextTypes = {
  router: PropTypes.object,
};

LoginForm.PropTypes = {
  placeholder: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
  touched: PropTypes.bool,
  pristine: PropTypes.bool,
  reset: PropTypes.bool,
};

LoginForm = reduxForm({
  form: 'loginForm',
})(LoginForm);

LoginForm = connect(
  state => ({
    initialValues: state.user.data,
  }),
)(LoginForm);

export default LoginForm;
