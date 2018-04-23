import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { GridList } from 'material-ui/GridList';
import MultiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// Import components
import SelectCardListItem from '../SelectCardListItem/SelectCardListItem';

function SelectCardList(props) {
  return (
    <MultiThemeProvider>
      <GridList
        cellHeight={props.height}
        cols={props.cols}
      >
      { props.cards.map(card =>(
        <SelectCardListItem
          card = {card}
          key = {card.cuid}
          selectCard = {props.selectCard}
        />
        ))
      } 
      </GridList>
    </MultiThemeProvider>
  );
}

export default SelectCardList;