import React, { Component, PropTypes } from 'react';
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

//Import Actions
import { addCardRequest, fetchCards, fetchUserCards, fetchUserDecks, deleteCardRequest, fetchDecks, addDeckRequest, deleteDeckRequest } from '../../InventoryActions';

//Import Selectors
import { getCards } from '../../CardReducer';
import { getDecks } from '../../DeckReducer';

class UserInventoryPage extends Component {

    constructor(props){
        super(props);
        this.state = { value: 0 };   
    }
    
    componentDidMount() {
        this.props.dispatch(fetchUserCards(this.props.params.cuid));
        this.props.dispatch(fetchUserDecks(this.props.params.cuid));
    }

    handleChange = (value) => {
        this.setState({
          value: value,
        });
    };

    render(){
        return (
            <h1> Inventory
                <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
                    <Tabs
                        value={this.state.value}
                        onChange={this.handleChange}
                    >
                        <Tab label="All Cards" value={0}>    
                            {/* Card List */} 
                            <CardList cards={this.props.cards} height={300} cols={4}/> 
                        </Tab>
                        <Tab label="Deck 1" value={1}> 
                                
                            {this.props.decks[0] != null ? //check if deck exists
                                /* Very ugly logic */
                                <DeckListItem 
                                    //filter for all users cards that belong to deck                                                    
                                    cards={this.props.cards.filter(card => card.decks.filter(cuid => cuid === this.props.decks[0].cuid)[0] === this.props.decks[0].cuid)} 
                                    deck={this.props.decks[0]} 
                                />  
                                : 
                                <p> Deck Does Not Exist </p>
                            }
                        </Tab> 
                        
                        <Tab label="Deck 2" value={2}>
                            {this.props.decks[1] != null ? 
                                <DeckListItem 
                                    cards={this.props.cards.filter(card => card.decks.filter(cuid => cuid === this.props.decks[1].cuid)[0] === this.props.decks[1].cuid)} 
                                    deck={this.props.decks[1]} 
                                />  
                                : 
                                <p> Deck Does Not Exist </p>
                            }
                        </Tab> 
                        
                        <Tab label="Deck 3" value={3}>  
                        {this.props.decks[2] != null ? 
                                <DeckListItem 
                                    cards={this.props.cards.filter(card => card.decks.filter(cuid => cuid === this.props.decks[2].cuid)[0] === this.props.decks[2].cuid)} 
                                    deck={this.props.decks[2]} 
                                />  
                                : 
                                <p> Deck Does Not Exist </p>
                            }                        
                        </Tab> 
                        <Tab label="Deck 4" value={4}>   
                        {this.props.decks[3] != null ? 
                                <DeckListItem 
                                    cards={this.props.cards.filter(card => card.decks.filter(cuid => cuid === this.props.decks[3].cuid)[0] === this.props.decks[3].cuid)} 
                                    deck={this.props.decks[3]} 
                                />  
                                : 
                                <p> Deck Does Not Exist </p>
                            }
                        </Tab>
                        <Tab label="Deck 5" value={5}>    
                        {this.props.decks[4] != null ? 
                                <DeckListItem 
                                    cards={this.props.cards.filter(card => card.decks.filter(cuid => cuid === this.props.decks[4].cuid)[0] === this.props.decks[4].cuid)} 
                                    deck={this.props.decks[4]} 
                                />  
                                : 
                                <p> Deck Does Not Exist </p>
                            }
                        </Tab>     
                    </Tabs>
                </MuiThemeProvider>     
            </h1>    
        );
    }
}

// Actions required to provide data for this component to render in sever side.
UserInventoryPage.need = [(params) => { 
    return fetchUserCards(params.cuid), fetchUserDecks(params.cuid);
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
