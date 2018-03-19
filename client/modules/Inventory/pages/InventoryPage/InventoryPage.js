import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

// styles
// This causes crashes and I don't know why
import styles from './InventoryPage.css';

class InventoryPage extends Component {
    componentDidMount() {
        ReactDOM.hydrate(<InventoryPage/>, document.getElementById('root')); 
    }
    render() {
        return (
            <div>
                <h3> zzz Please log in to view Inventory zzzzz </h3>
            </div>
        );
    }
}

export default InventoryPage;
