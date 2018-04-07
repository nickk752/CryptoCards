import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Paper from 'material-ui/Paper';
import { FormattedMessage } from 'react-intl';
import { Row, Col } from 'react-grid-system';

// Import Style
import styles from './NextPart.css';


const style = {
  height: 100,
  width: 100,
  margin: 20,
  textAlign: 'center',
  display: 'inline-block',
};

var imageURL = 
  'http://940ee6dce6677fa01d25-0f55c9129972ac85d6b1f4e703468e6b.r99.cf2.rackcdn.com/products/pictures/1104180.jpg';

function NextPart(props) {
  return (
    <div className={styles['single-page']}>
      <Row>
        <Col>
          <center>
            <div className={styles['box']}>
              <div className={styles['box-ina-box']}>
                <h1>What is CryptoCards?</h1>
                <p>Lorem ipsum dolor sit amet,
                  consectetur adipiscing elit.
                  Aenean euismod bibendum laoreet.
                  Proin gravida dolor sit amet lacus
                  accumsan et viverra justo commodo.
                  Proin sodales pulvinar sic tempor.
                  Sociis natoque penatibus et magnis
                  dis parturient montes, nascetur
                  ridiculus mus. Nam fermentum, nulla
                  luctus pharetra vulputate, felis
                  tellus mollis orci, sed rhoncus
                pronin sapien nunc accuan eget.</p>
                <img src={imageURL} alt='exodia'/>
              </div>
            </div>
          </center>
        </Col>
      </Row>
    </div>
  );
}

NextPart.propTypes = {
  children: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

export default NextPart;