import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import ReactDOM from 'react-dom';

import downloadMetaMask from '../../../Marketplace/download-metamask.png';

// styles
// This causes crashes and I don't know why
// import styles from './InventoryPage.css';

class InventoryPage extends React.Component {

  render() {
    return (
      <div>
        <a href="http://metamask.io"><img
          style={{
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            width: '50%',
            height: '80%',
          }}
          src={downloadMetaMask}
          alt="downloadMetaMask"
        /></a>
        <h3 style={{ textAlign: 'center' }}>Please login to MetaMask to view your inventory</h3>
      </div>
    );
  }
}


export default InventoryPage;
