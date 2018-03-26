/* eslint-disable global-require */
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './modules/App/App';

// require.ensure polyfill for node
if (typeof require.ensure !== 'function') {
  require.ensure = function requireModule(deps, callback) {
    callback(require);
  };
}

/* Workaround for async react routes to work with react-hot-reloader till
  https://github.com/reactjs/react-router/issues/2182 and
  https://github.com/gaearon/react-hot-loader/issues/288 is fixed.
 */
if (process.env.NODE_ENV !== 'production') {
  // Require async routes only in development for react-hot-reloader to work.
  require('./modules/Post/pages/PostListPage/PostListPage');
  require('./modules/Post/pages/PostDetailPage/PostDetailPage');
  require('./modules/Marketplace/pages/MarketplacePage/MarketplacePage');
  require('./modules/Marketplace/pages/AuctionDetailPage/AuctionDetailPage');
  require('./modules/Inventory/pages/InventoryPage/InventoryPage');// InventoryPage
  require('./modules/Inventory/pages/CardPage/CardPage');// Card page
  require('./modules/Inventory/pages/DeckPage/DeckPage');// Deck page
  require('./modules/Inventory/pages/TestInventoryPage/TestInventoryPage');// TestInventoryPage
  require('./modules/Inventory/pages/UserInventoryPage/UserInventoryPage');// UserInventoryPage
}

// react-router setup with code-splitting
// More info: http://blog.mxstbr.com/2016/01/react-apps-with-pages/
export default (
  <Route path="/" component={App}>
    <IndexRoute
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Post/pages/PostListPage/PostListPage').default);
        });
      }}
    />
    <Route
      path="/posts/:slug-:cuid"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Post/pages/PostDetailPage/PostDetailPage').default);
        });
      }}
    />
    <Route
      path="/marketplace"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Marketplace/pages/MarketplacePage/MarketplacePage').default);
        });
      }}
    />
    <Route
      path="/marketplace/:cuid"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Marketplace/pages/AuctionDetailPage/AuctionDetailPage').default);
        });
      }}
    />
    {/* <Route
      path="/game"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Game/pages/GamePage/GamePage').default);
        });
      }}
    /> */}
    <Route // route for when user is not logged in
      path="/inventory"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Inventory/pages/InventoryPage/InventoryPage').default);
        });
      }}
    />
    <Route // route for viewing all cards and decks. Only for development
      path="/inventory/testing"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Inventory/pages/TestInventoryPage/TestInventoryPage').default);
        });
      }}
    />
    <Route // route for all cards belonging to logged in user
      path="/inventory/:cuid"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Inventory/pages/UserInventoryPage/UserInventoryPage').default);
        });
      }}
    />
    <Route // route for specific card
      path="/inventory/card/:cuid"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Inventory/pages/CardPage/CardPage').default);
        });
      }}
    />
    <Route // route for specific deck
      path="/inventory/deck/:cuid"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Inventory/pages/DeckPage/DeckPage').default);
        });
      }}
    />
  </Route>
);
