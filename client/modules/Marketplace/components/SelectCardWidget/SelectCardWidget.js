import React, { Component, PropTypes } from 'react';
import { Element, animateScroll as scroll } from 'react-scroll';

// Import Components
import CardList from '../../../Inventory/components/CardList';

export class SelectCardWidget extends Component {
  constructor(props) {
    super(props);
    this.scrollToTop = this.scrollToTop.bind(this);
  }

  scrollToTop() {
    scroll.scrollToTop();
  }

  render() {
    return (
      <div>
        <h2> Pick Card to Add to Deck
          <Element name="cardList" className="element" id="container" style={{
            position: 'relative',
            height: '200px',
            overflow: 'scroll',
            marginBottom: '50px'
          }}>
            <CardList cards={this.props.cards}  height={150} cols={4} type={'selectCard'} />
          </Element>
        </h2>
      </div>
    );
  }
}

export default SelectCardWidget;