import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';

// Import Components
import CardList from '../../components/CardList';

//Import Actions
import { addCardRequest, fetchCards, deleteCardRequest } from '../../InventoryActions';

//Import Selectors
import { getCards } from '../../InventoryReducer';

class UserInventoryPage extends Component {
    componentDidMount() {
        //ReactDOM.hydrate(<UserInventoryPage/>, document.getElementById('root'));
        this.props.dispatch(fetchCards());
    }

    handleDeleteCard = card => {
        if(confirm('Do you want to delete this card?')) {
            this.props.dispatch(deleteCardRequest(card));
        }
    }

    handleAddCard = (name, owner) => {
        this.props.dispatch(addCardRequest({ name, owner }));
    };

    render(){
        return (
            //list of cards here
            <div>
                <h3> Inventory </h3>
                <CardList handleDeleteCard={this.handleDeleteCard} cards={this.props.cards} />
            </div>    
        );    
    }
}

// Actions required to provide data for this component to render in sever side.
UserInventoryPage.need = [() => { return fetchCards(); }];

// Retrieve data from store as props
const mapStateToProps = (state) => {
    return {
        cards: getCards(state),
    };
}

//
UserInventoryPage.propTypes = {
    cards: PropTypes.shape({
        name: PropTypes.string.isRequired,
        owner: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired,
        cuid: PropTypes.string.isRequired,
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
};

UserInventoryPage.contextTypes = {
    router: React.PropTypes.object,
};

export default connect(mapStateToProps)(UserInventoryPage);
