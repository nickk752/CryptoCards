import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
//import { Tabs, Tab } from 'react-bootstrap';
import { Tabs, Tab } from 'material-ui/Tabs';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';

const functions = require('../../../../util/TestAPI');

// Import Components
import CardList from '../../components/CardList';
import DeckList from '../../components/DeckList';
import DeckListItem from '../../components/DeckListItem/DeckListItem';
import AddCardDeckWidget from '../../components/AddCardDeckWidget/AddCardDeckWidget';

//Import Actions
import {
  addCardRequest,
  fetchCards,
  deleteCardRequest,
  fetchDecks,
  addDeckRequest,
  deleteDeckRequest,
  toggleAddCardDeck,
  addDeckToCardRequest,
  transferCardRequest,
} from '../../InventoryActions';

//Import Selectors
import { getCards } from '../../CardReducer';
import { getDecks, getShowAddCardDeck } from '../../DeckReducer';

class TestInventoryPage extends Component {

  constructor(props) {
    super(props);
    this.state = { value: 0 };
  }

  componentDidMount() {
    this.props.dispatch(fetchCards());
    this.props.dispatch(fetchDecks());
  }

  handleChange = (value) => {
    this.setState({
      value: value,
    });
  };

  handleAddDeckToCard = (cardCuid, deckCuid) => {
    this.props.dispatch(addDeckToCardRequest(cardCuid, deckCuid));
  }

  handleFetchCards = () => {
    this.props.dispatch(fetchCards());
  }

  handleToggleAddCardDeck = () => {
    this.props.dispatch(toggleAddCardDeck());
  }

  handleAddDeck = (number, name) => {
    this.props.dispatch(addDeckRequest({ number, name }));
  };

  handleAddCard = () => {
    this.props.dispatch(addCardRequest({
      name: 'testChon',
      owner: 'bob',
      type: 'buttstuff',
      attack: 2,
      defense: 2,
    }));
    this.props.dispatch(fetchCards());
  }

  handleTransferCard = (cardCuid, ownerCuid) => {
    this.props.dispatch(transferCardRequest(cardCuid, ownerCuid));
  }

  handleCreateGen0 = () => {
    functions.createGen0Auction();
  }

  handleGetCard = () => {
    alert(functions.getCard());
  }

  render() {
    return (
      <h1> Inventory
        <button onClick={this.handleAddCard}> add card </button>
        <button onClick={this.handleCreateGen0}> Create Gen0 </button>
        <button onClick={this.handleGetCard}> Get Stuff </button>
        <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
          >
            <Tab label="All Cards" value={0}>
              {/* Card List */}
              <CardList cards={this.props.cards} height={300} cols={4} transferCard={this.handleTransferCard} />
            </Tab>
            <Tab label="Deck 1" value={1}>
              {/* Deck List */}
              <button onClick={this.handleToggleAddCardDeck}> add cards </button>
              <AddCardDeckWidget cards={this.props.cards.filter(card => card.decks.filter(cuid => cuid === this.props.decks[0].cuid).length === 0)} deck={this.props.decks[0]} showAddCardDeck={this.props.showAddCardDeck} addDeckToCard={this.handleAddDeckToCard} fetchCards={this.handleFetchCards} />
              <DeckListItem cards={this.props.cards.filter(card => card.decks.filter(cuid => cuid === this.props.decks[0].cuid)[0] === this.props.decks[0].cuid)} deck={this.props.decks[0]} />
            </Tab>
            <Tab label="Deck 2" value={2}>
              {/* Deck List */}
              <DeckListItem cards={this.props.cards} deck={this.props.decks[0]} />
            </Tab>
            <Tab label="Deck 3" value={3}>
              {/* Deck List */}
              <DeckListItem cards={this.props.cards} deck={this.props.decks[0]} />
            </Tab>
            <Tab label="Deck 4" value={4}>
              {/* Deck List */}
              <DeckListItem cards={this.props.cards} deck={this.props.decks[1]} />
            </Tab>
            <Tab label="Deck 5" value={5}>
              {/* Deck List */}
              <DeckListItem cards={this.props.cards} deck={this.props.decks[1]} />
            </Tab>
          </Tabs>
        </MuiThemeProvider>
      </h1>
    );
  }
}

// Actions required to provide data for this component to render in sever side.
TestInventoryPage.need = [() => {
  return fetchCards(), fetchDecks();
}];

// Retrieve data from store as props
const mapStateToProps = (state) => {
  return {
    showAddCardDeck: getShowAddCardDeck(state),
    cards: getCards(state),
    decks: getDecks(state),
  };
}

//
TestInventoryPage.propTypes = {
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
  })).isRequired,
  dispatch: PropTypes.func.isRequired,
};

TestInventoryPage.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(TestInventoryPage);
