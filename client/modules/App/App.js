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
import { addDeckRequest, fetchUserDecks, fetchUserCards } from '../Inventory/InventoryActions';
// import { loginRequest } from '../../modules/Login/LoginActions';

// Import Selectors
import { getCards } from '../Inventory/CardReducer';
import { getDecks } from '../Inventory/DeckReducer';
import { getUser } from '../../modules/Login/UserReducer';
import getWeb3 from '../../util/getWeb3';

// const Web3 = require('web3');


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
        console.log(this.state.accounts[0]);
        this.props.dispatch(fetchUserCards(this.state.accounts[0]));
        this.props.dispatch(fetchUserDecks(this.state.accounts[0]));
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

  getDeckCards = (cards, deckCuid) => {
    var deckCards = cards.filter(card => card.decks.filter(cuid => cuid === deckCuid)[0] === deckCuid);
    /* console.log('Deck Cards');
    console.log(deckCards); */
    return deckCards;
  }

  findActiveDeck = (decks) => {
    var deck = decks.filter(deck => ( deck.active == true))[0];
    console.log('FINDING ACTIVE DECK CUID');
    console.log(deck.cuid);
    return deck.cuid;
  }

  handlePlay = () => {
    console.log('DO SOMETHING');
    var activeCuid = this.findActiveDeck(this.props.decks);
    var deckCards = this.getDeckCards(this.props.cards, activeCuid);
    console.log('GET DECK CARDS');
    console.log(deckCards);
    var renameDeckCards = {cards: []};
    deckCards.forEach((card) => {
      renameDeckCards.cards.push({
        Name: card.name,
        Type: card.type,
        NCost: card.mCost,
        LCost: card.lCost,
        RCost: card.rCost,
        Att: card.attack,
        Def: card.defense,
        Effect: card.effect,
      });
    });

    //http request
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8081/", true);//game url
    xhr.setRequestHeader('Content-Type', 'application/json');
    console.log(JSON.stringify(deckCards));
    xhr.send(JSON.stringify({ 
      name: this.state.accounts[0],
      gameId: 500,
      deck: JSON.stringify(renameDeckCards),
      }));
    xhr.onloadend = function (result) {
      console.log(result);
      window.location.replace(result.target.responseURL);
    };
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
            inventoryLink={'/inventory/' + this.state.accounts[0]}
            marketplaceLink={'/marketplace/user/' + this.state.accounts[0]}
            play={this.handlePlay}
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
    cards: getCards(store),
    decks: getDecks(store),
  };
}

export default connect(mapStateToProps)(App);
