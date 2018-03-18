import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

//styles 
//This causes crashes and I don't know why
//import styles from './InventoryPage.css'; 

class InventoryPage extends React.Component {
    componentDidMount() {
       ReactDOM.hydrate(<InventoryPage/>, document.getElementById('root'));
    }

    render(){
        return(
            <h3> Please log in to view Inventory </h3>
        );    
    }
}

export default InventoryPage;
