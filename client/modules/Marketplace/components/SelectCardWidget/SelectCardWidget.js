import React, { Component, PropTypes } from 'react';
import { Element, animateScroll as scroll } from 'react-scroll';

// Import Components
import SelectCardList from '../../../../components/SelectCardList/SelectCardList';

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

      <h2> Pick card to put up for auction
          <Element name="cardList" className="element" id="container" style={{
          position: 'relative',
          height: '200px',
          overflow: 'scroll',
          marginBottom: '50px'
        }}>
          <SelectCardList
            cards={this.props.cards}
            height={150}
            cols={4}
            selectCard={this.props.selectCard} />
        </Element>
      </h2>

    );
  }
}

export default SelectCardWidget;