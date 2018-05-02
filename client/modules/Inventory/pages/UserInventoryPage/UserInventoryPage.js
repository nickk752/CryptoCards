import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { Tabs, Tab } from 'material-ui/Tabs';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';

// Import Components
import CardList from '../../components/CardList';
import DeckList from '../../components/DeckList';
import DeckListItem from '../../components/DeckListItem/DeckListItem';
import AddCardDeckWidget from '../../components/AddCardDeckWidget/AddCardDeckWidget';


//Import Actions
import {
  addCardRequest,
  fetchCards,
  fetchUserCards,
  fetchUserDecks,
  deleteCardRequest,
  fetchDecks,
  addDeckRequest,
  deleteDeckRequest,
  toggleAddCardDeck,
  addDeckToCardRequest,
  removeCardRequest,
  activateRequest,
} from '../../InventoryActions';

//Import Selectors
import { getCards } from '../../CardReducer';
import { getDecks, getShowAddCardDeck } from '../../DeckReducer';

import getWeb3 from '../../../../util/getWeb3';
const rows = [1, 2, 3, 4, 5];

class UserInventoryPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      accounts: [],
    };
  }

  componentDidMount() {
    // account stuff
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
        //creating decks if no decks exist
        if (this.props.decks[0] == null) {
          for (var i = 0; i < 5; i++) {
            this.props.dispatch(addDeckRequest(
              {
                number: i + 1,
                name: 'Deck ' + (i + 1),
                owner: this.state.accounts[0],
                active: false,
              }));
          }
        }

        console.log('ACCOUNT')
        console.log(this.state.accounts[0])
        this.props.dispatch(fetchUserCards(this.state.accounts[0]));
      });
    }
    //this.props.dispatch(fetchUserDecks(this.props.params.cuid));
  }

  handleChange = (value) => {
    this.setState({
      value: value,
    });
  }

  handleToggleAddCardDeck = () => {
    this.props.dispatch(toggleAddCardDeck());
  }

  // getting cards in target deck
  getDeckCards = (cards, deckCuid) => {
    return cards.filter(card => card.decks.filter(cuid => cuid === deckCuid)[0] === deckCuid);
  }

  // getting cards that are not currently in the target deck
  getAddDeckCards = (cards, deckCuid) => {
    return cards.filter(card => card.decks.filter(cuid => cuid === deckCuid).length === 0)
  }

  handleAddDeckToCard = (cardCuid, deckCuid) => {
    this.props.dispatch(addDeckToCardRequest(cardCuid, deckCuid));
    this.props.dispatch(fetchUserCards(this.props.params.cuid));
  }

  handleToggleAddCardDeck = () => {
    this.props.dispatch(toggleAddCardDeck());
  }

  handleRemoveCard = (cardCuid, deckCuid) => {
    this.props.dispatch(removeCardRequest(cardCuid, deckCuid));
    this.props.dispatch(fetchUserCards(this.props.params.cuid));
  }

  handleActivate = (deckCuid) => {
    this.props.dispatch(activateRequest(this.props.params.cuid, deckCuid));
    this.props.dispatch(fetchUserDecks(this.props.params.cuid));
  }

  render() {
    return (
      <h1> Inventory
        <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
          >
            <Tab label="All Cards" value={0}>
              {/* Card List */}
              <CardList cards={this.props.cards} height={300} cols={4} />
            </Tab>

            {rows.map(i => {
              var name = 'Deck ' + i;
              return <Tab label={name} value={i}>
                {this.props.decks[i - 1] != null ? //check if deck exists
                  <div>
                    <button onClick={this.handleToggleAddCardDeck}> add cards </button>
                    <AddCardDeckWidget
                      cards={this.getAddDeckCards(this.props.cards, this.props.decks[i - 1].cuid)}
                      deck={this.props.decks[i - 1]}
                      showAddCardDeck={this.props.showAddCardDeck}
                      addDeckToCard={this.handleAddDeckToCard} />
                    <DeckListItem
                      //filter for all users cards that belong to deck                                                    
                      cards={this.getDeckCards(this.props.cards, this.props.decks[i - 1].cuid)}
                      deck={this.props.decks[i - 1]}
                      removeCard={this.handleRemoveCard}
                      activate={this.handleActivate}
                    />
                  </div>
                  :
                  <p> Deck Does Not Exist </p>
                }
              </Tab>
            })
            }

          </Tabs>
        </MuiThemeProvider>
      </h1>
    );
  }
}

// Actions required to provide data for this component to render in sever side.
// UserInventoryPage.need = [(params) => {
//   return fetchUserCards(params.cuid), fetchUserDecks(params.cuid);
// }];

// Retrieve data from store as props
const mapStateToProps = (state) => {
  return {
    showAddCardDeck: getShowAddCardDeck(state),
    cards: getCards(state),
    decks: getDecks(state),
  };
}

//
UserInventoryPage.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    owner: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    attack: PropTypes.string.isRequired,
    defense: PropTypes.string.isRequired,
    decks: PropTypes.array.isRequired,
  })).isRequired,
  decks: PropTypes.arrayOf(PropTypes.shape({
    number: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    owner: PropTypes.string.isRequired,
    cards: PropTypes.array.isRequired,
  })).isRequired,
  dispatch: PropTypes.func.isRequired,
};

UserInventoryPage.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(UserInventoryPage);
