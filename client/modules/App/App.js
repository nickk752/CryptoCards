import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// Import Style
import styles from './App.css';

// Import Components
import Helmet from 'react-helmet';
import DevTools from './components/DevTools';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// Import Actions
import { toggleAddPost } from './AppActions';
import { switchLanguage } from '../../modules/Intl/IntlActions';
// import { loginRequest } from '../../modules/Login/LoginActions';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = { isMounted: false };
  }

  componentDidMount() {
    this.setState({ isMounted: true }); // eslint-disable-line
  }

  toggleAddPostSection = () => {
    this.props.dispatch(toggleAddPost());
  };

  // handleLogin = (event) => {
  //   this.props.dispatch(loginRequest({ username, password }));
  // };

  // hadleChange = (event) => {
  //   this.setState({})
  // }

  render() {
    // const { isAuthenticated, errorMessage } = this.props;
    return (
      <div>
        {this.state.isMounted && !window.devToolsExtension && process.env.NODE_ENV === 'development' && <DevTools />}
        <div>
          <Helmet
            title="CryptoCards "
            titleTemplate="%s - Blog App"
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
            handleLogin={this.handleLogin}
            isLoggedIn={this.props.isLoggedIn}
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

App.propTypes = {
  children: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  // isAuthenticated: PropTypes.bool.isRequired,
  // errorMessage: PropTypes.string,
};

// Retrieve data from store as props
function mapStateToProps(store) {
  // const { isAuthenticated, errorMessage } = auth;
  return {
    intl: store.intl,
    isLoggedIn: true,
    // isAuthenticated,
    // errorMessage,
  };
}

export default connect(mapStateToProps)(App);
