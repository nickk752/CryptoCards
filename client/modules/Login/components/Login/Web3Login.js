import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import getWeb3 from '../../../../util/getWeb3';
// import { Link } from 'react-router';
// import { FormattedMessage } from 'react-intl';

// Import Style
// import styles from './Login.css';

// import { loginRequest } from '../../LoginActions';

// import { getUser } from '../../UserReducer';

export class Web3Login extends Component {
  // const handleSubmit = props.handleSubmit;
  // const handleChange = props.handleChange;
  // const { user, submitted, loggingIn } = props;
  // const { username, password } = user;
  // console.log('user');
  // console.log(username);
  constructor(props) {
    super(props);
    this.myWeb3 = undefined;
    this.state = {
      accounts: [],
    };
  }

  componentDidMount() {

    getWeb3((web3) => {
      this.myWeb3 = web3;
    });
    // console.log(this.myWeb3.eth.defaultAccount);
    let accounts;
    if (this.myWeb3 !== undefined) {
      accounts = this.myWeb3.eth.getAccounts((error, result) => {
        if (!error) {
          return result;
        }
      });
      accounts.then((result) => {
        this.setState({ accounts: result });
      });
    }
  }

  render() {
    return (
      <div>
        <p>
          {(this.state.accounts.length !== 0) ? this.state.accounts[0] : 'please login through metamask'}
        </p>
      </div>
    );
  }
}

Web3Login.propTypes = {
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
  myWeb3: PropTypes.object,
};

export default Web3Login;
