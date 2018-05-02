import React from 'react';
import { FormattedMessage } from 'react-intl';

// Import Style
import styles from './Footer.css';

// Import Images
import bg from '../../header-bk.png';

export function Footer() {
  return (
    <div style={{ background: `center` }} className={styles.footer}>
      <p>&copy; 2018 &middot; CryptoCards &middot; CryptoCards LLC.</p>
      <p><FormattedMessage id="twitterMessage" /> : <a href="https://twitter.com/@Cryptocards" target="_Blank">@CryptoCards</a></p>
    </div>
  );
}

export default Footer;
