import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';

//import styles

function CardListItem(props){
    return(
        <div>
            <h3>
                <Link to={`/inventory/${props.card.slug}-${props.card.cuid}`}>
                    {props.card.name}
                </Link>
            </h3>
            <p><FormarttedMessage id = "owner"/> {props.owner} </p>    
        </div>
    );
}

CardListItem.propTypes = {
    card: PropTypes.shape({
        name: PropTypes.string.isRequired,
        owner: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired,
        cuid: PropTypes.string.isRequired,
    }).isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default CardListItem;
