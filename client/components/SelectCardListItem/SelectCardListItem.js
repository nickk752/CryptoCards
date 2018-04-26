import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { GridTile } from 'material-ui/GridList';

// Import Wang
import wang from '../../components/flowey.png';

export class SelectCardListItem extends Component {
  render() {
    return (
      <GridTile
        key={this.props.card.slug}
        title={this.props.card.name}
        subtitle={
          <div>
            <p> Type: {this.props.card.type} Att: {this.props.card.attack} Def: {this.props.card.defense} </p>
          </div>
        }
        onClick={() => {
          console.log(this.props.card.tokenId);
          this.props.selectCard(this.props.card.tokenId);
        }}
      //find way to display attack and 
      >
        <img src={wang} />
      </GridTile>
    );
  }
}

export default SelectCardListItem;