import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import Columns from 'react-columns';

// Import Components
import CardList from '../../components/CardList';
import DeckList from '../../components/DeckList';

//Import Actions
import { addCardRequest, fetchCards, fetchUserCards, fetchUserDecks, deleteCardRequest, fetchDecks, addDeckRequest, deleteDeckRequest } from '../../InventoryActions';

//Import Selectors
import { getCards } from '../../CardReducer';
import { getDecks } from '../../DeckReducer';

class UserInventoryPage extends Component {
    
    componentDidMount() {
        this.props.dispatch(fetchUserCards(this.props.params.cuid));
        this.props.dispatch(fetchUserDecks(this.props.params.cuid));
    }

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
UserInventoryPage.need = [() => { 
    return fetchUserCards(), fetchUserDecks();
}];

// Retrieve data from store as props
const mapStateToProps = (state) => {
    return {
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
    router: React.PropTypes.object,
};

export default connect(mapStateToProps)(UserInventoryPage);
