import React, { Component, PropTypes } from 'react';
import { Element, animateScroll as scroll } from 'react-scroll';

// Import Components
import CardList from '../CardList';

export class AddCardDeckWidget extends Component{
    
    constructor(props) {
        super(props);
        this.scrollToTop = this.scrollToTop.bind(this);
    }

    scrollToTop() {
        scroll.scrollToTop();
    }

    render(){
        return(
            <div>
                {this.props.showAddCardDeck ? 
                    <h2> Pick Card to Add to Deck
                        <Element name="cardList" className="element" id="container" style={{
                            position: 'relative',
                            height: '400px',
                            overflow: 'scroll',
                            marginBottom: '100px'
                        }}>
                            <CardList cards={this.props.cards} deck={this.props.deck} height={200} cols={4} type={'addDeck'} addDeckToCard={this.props.addDeckToCard} fetchCards={this.props.fetchCards}/>
                        </Element> 
                    </h2>
                    :
                    <br/>
                }
            </div> 
        );
    }
}

export default AddCardDeckWidget;