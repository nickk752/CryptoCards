import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { Navbar, Nav, NavItem } from 'react-bootstrap/lib';
// import { Nav } from 'react-bootstrap/lib/Nav';
import { Web3Login } from '../../../Login/components/Login/Web3Login';
import getWeb3 from '../../../../util/getWeb3';
// Import Style
import styles from './Header.css';

export function Header(props, context) {
  const languageNodes = props.intl.enabledLanguages.map(
    lang => <li key={lang} onClick={() => props.switchLanguage(lang)} className={lang === props.intl.locale ? styles.selected : ''}>{lang}</li>
  );
  const fixedTop = true;

  return (
    <div className={styles.header}>
      <div className={styles['language-switcher']}>
        <ul>
          <li><FormattedMessage id="switchLanguage" /></li>
          {languageNodes}
        </ul>
      </div>
      <div className={styles.content}>
        <h1 className={styles['site-title']}>
          <Link to="/" ><FormattedMessage id="siteTitle" /></Link>
        </h1>

        {/* Need to make it so link goes to inventory/userid or /inventory if user not logged in.
            Also JSX comments suck.
         */}
        {/* <h1>
          <Link to="/inventory/bob" > Inventory </Link>
        </h1> */}

        {
          context.router.isActive('/', true)
            ? <a className={styles['add-post-button']} href="#" onClick={props.toggleAddPost}><FormattedMessage id="addPost" /></a>
            : null
        }
        <Navbar fixedTop={fixedTop}>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/">CryptoCards</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <NavItem eventKey={1} href="/">
              Home
            </NavItem>
            <NavItem eventKey={1} href={props.inventoryLink}>
              Inventory
            </NavItem>
            <NavItem eventKey={1} href={props.marketplaceLink}>
              Marketplace
            </NavItem>
            <NavItem eventKey={1} onClick={() => {props.play()}} >
              Play!
            </NavItem>
          </Nav>
          <Nav pullRight>
            {<web3Login
              handleSubmit={props.handleLoginSubmit}
              handleChange={props.handleLoginChange}
              user={props.user}
            />}
          </Nav>
        </Navbar>
      </div>
    </div>
  );
}

Header.contextTypes = {
  router: PropTypes.object,
};

Header.propTypes = {
  toggleAddPost: PropTypes.func.isRequired,
  switchLanguage: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  handleLoginSubmit: PropTypes.func.isRequired,
  handleLoginChange: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  // handleLogin: PropTypes.func.isRequired,
  // isLoggedIn: PropTypes.bool.isRequired,
};

export default Header;
