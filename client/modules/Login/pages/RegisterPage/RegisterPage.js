import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import { registerRequest, fetchUser } from '../../LoginActions';

import { getUser } from '../../UserReducer';
import { Login } from '../../components/Login/Login';

class RegisterPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      user: {
        firstName: '',
        lastName: '',
        username: '',
        password: '',
      },
      registering: false,
      submitted: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    const { user } = this.state;
    this.setState({
      user: {
        ...user,
        [name]: value,
      },
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ submitted: true });
    const { user } = this.state;
    const { dispatch } = this.props;
    if (user.username && user.password && user.firstName && user.lastName) {
      dispatch(registerRequest(user));
    }
  }

  render() {
    const { registering } = this.props;
    const { user, submitted } = this.state;
    return (
      <div className="col-md-6 col-md-offset-3">
        <h2>Register</h2>
        <form name="form" onSubmit={this.handleSubmit}>
          <div className={'form-group' + (submitted && !user.firstName ? ' has-error' : '')}>
            <label htmlFor="firstName">First Name</label>
            <input type="text" className="form-control" name="firstName" value={user.firstName} onChange={this.handleChange} />
            {submitted && !user.firstName &&
              <div className="help-block">First Name is required</div>
            }
          </div>
          <div className={'form-group' + (submitted && !user.lastName ? ' has-error' : '')}>
            <label htmlFor="lastName">Last Name</label>
            <input type="text" className="form-control" name="lastName" value={user.lastName} onChange={this.handleChange} />
            {submitted && !user.lastName &&
              <div className="help-block">Last Name is required</div>
            }
          </div>
          <div className={'form-group' + (submitted && !user.username ? ' has-error' : '')}>
            <label htmlFor="username">Username</label>
            <input type="text" className="form-control" name="username" value={user.username} onChange={this.handleChange} />
            {submitted && !user.username &&
              <div className="help-block">Username is required</div>
            }
          </div>
          <div className={'form-group' + (submitted && !user.password ? ' has-error' : '')}>
            <label htmlFor="password">Password</label>
            <input type="password" className="form-control" name="password" value={user.password} onChange={this.handleChange} />
            {submitted && !user.password &&
              <div className="help-block">Password is required</div>
            }
          </div>
          <div className="form-group">
            <button className="btn btn-primary">Register</button>
            {registering &&
              <img src="../../../../components/flowey.png" role="presentation" />
            }
            <Link to="/login" className="btn btn-link">Cancel</Link>
          </div>
        </form>
      </div>
    );
  }
}

RegisterPage.contextTypes = {
  router: PropTypes.object,
};

RegisterPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  // isLoggedIn: PropTypes.bool.isRequired,
  registering: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    user: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      username: PropTypes.string,
      password: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

function mapStateToProps(state) {
  const { registering } = state.user;
  return {
    intl: state.intl,
    registering,
    data: getUser(state),
  };
}

export default connect(mapStateToProps)(RegisterPage);
