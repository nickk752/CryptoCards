import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import Columns from 'react-columns';

// Import Components
import CardList from '../../components/CardList';
import DeckList from '../../components/DeckList';

//Import Actions
import { addCardRequest, fetchCards, deleteCardRequest, fetchDecks, addDeckRequest, deleteDeckRequest } from '../../InventoryActions';

//Import Selectors
import { getCards } from '../../CardReducer';
import { getDecks } from '../../DeckReducer';

class TestInventoryPage extends Component {
    
    componentDidMount() {
        this.props.dispatch(fetchCards());
        this.props.dispatch(fetchDecks());
    }

    handleAddCard = (name, owner) => {
        this.props.dispatch(addCardRequest({ name, owner }));
    };

    handleAddDeck = (number, name) => {
        this.props.dispatch(addDeckRequest({ number, name }));
    };

    render(){
        return (
            <h1> Inventory
                <Columns columns='2'>
                    <h3> Cards </h3>
                    <h3> Decks </h3>
                </Columns>
                <Columns columns='2'>
                    {/* Card List */}
                    <CardList cards={this.props.cards} />
                
                    {/* Deck List */}
                    <DeckList cards={this.props.cards} decks={this.props.decks} />
                </Columns>    
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
        cards: PropTypes.array.isRequired,
    })).isRequired,
    dispatch: PropTypes.func.isRequired,
};

TestInventoryPage.contextTypes = {
    router: React.PropTypes.object,
};

export default connect(mapStateToProps)(TestInventoryPage);