import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

// Import Styles

// Import Actions
import{ fetchCard } from '../../InventoryActions';

// Import Selectoes
import{ getCard } from '../../InventoryReducer';

export function CardPage(props) {
    return(
        <div>
            <Helmet title = {props.card.name} />
                <div>
                    <h3> {props.card.name} </h3>
                    <p> Owner: {props.card.owner} </p>
                </div>    
        </div>    
    );
}

// Actions required to provide data for this component to render in server side.
CardPage.need = [params => {
    return fetchCard(params.cuid);
}];

// Retrieve data from store as props
function mapStateToProps(state, props) {
    return {
      card: getCard(state, props.params.cuid),
    };
}

CardPage.propTypes = {
    card: PropTypes.shape({
        name: PropTypes.string.isRequired,
        owner: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired,
        cuid: PropTypes.string.isRequired,
    }).isRequired,
};

export default connect(mapStateToProps)(CardPage);