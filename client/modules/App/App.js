import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// Import Style
import styles from './App.css';

// Import Components
import Helmet from 'react-helmet';
import DevTools from './components/DevTools';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

// Import Actions
import { toggleAddPost } from './AppActions';
import { switchLanguage } from '../../modules/Intl/IntlActions';
import { loginRequest } from '../../modules/Login/LoginActions';
import { addDeckRequest, fetchUserDecks } from '../Inventory/InventoryActions';
// import { loginRequest } from '../../modules/Login/LoginActions';
import { getUser } from '../../modules/Login/UserReducer';
import getWeb3 from '../../util/getWeb3';

// const Web3 = require('web3');
var inventoryLink = '/inventory/';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMounted: false,
      accounts: [],
    }
    this.myWeb3 = undefined;
  }

  componentDidMount() {
    this.setState({ isMounted: true }); // eslint-disable-line
    let accounts;
    getWeb3((result) => {
      // console.log('getweb3');
      // console.log(result);
      this.myWeb3 = result;
    });
    if (this.myWeb3 !== undefined) {
      accounts = this.myWeb3.eth.getAccounts((error, result) => {
        if (!error) {
          return result;
        }
        return error;
      });
      accounts.then((result) => {
        this.setState({ accounts: result });
        console.log(this.state.accounts);
      });
    }
  }

  toggleAddPostSection = () => {
    this.props.dispatch(toggleAddPost());
  };

  handleLoginSubmit = (event) => {
    event.preventDefault();
    this.setState({ loginSubmitted: true });
    const { user } = this.state;
    const { dispatch } = this.props;
    if (user.username && user.password) {
      dispatch(loginRequest(user));
    }
  }

  handleLoginChange = (event) => {
    const { name, value } = event.target;
    const { user } = this.state;
    this.setState({
      user: {
        ...user,
        [name]: value,
      },
    });
  }

  render() {
    // const { isAuthenticated, errorMessage } = this.props;
    return (
      <div>
        {this.state.isMounted && !window.devToolsExtension && process.env.NODE_ENV === 'development' && <DevTools />}
        <div>
          <Helmet
            title="CryptoCards "
            titleTemplate="%s - CryptoCards App"
            meta={[
              { charset: 'utf-8' },
              {
                'http-equiv': 'X-UA-Compatible',
                content: 'IE=edge',
              },
              {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
              },
            ]}
          />
          <Header
            switchLanguage={lang => this.props.dispatch(switchLanguage(lang))}
            intl={this.props.intl}
            toggleAddPost={this.toggleAddPostSection}
            // handleLogin={this.handleLogin}
            user={this.props.user}
            handleLoginSubmit={this.handleLoginSubmit}
            handleLoginChange={this.handleLoginChange}
            inventoryLink={inventoryLink + this.state.accounts[0]}
            // isLoggedIn={this.props.isLoggedIn}
          />
          <div className={styles.container}>
            <MuiThemeProvider>
              {this.props.children}
            </MuiThemeProvider>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}

App.contextTypes = {
  web3: PropTypes.object,
};

App.propTypes = {
  children: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

// Retrieve data from store as props
function mapStateToProps(store) {
  // const { isAuthenticated, errorMessage } = auth;
  return {
    intl: store.intl,
  };
}

export default connect(mapStateToProps)(App);
