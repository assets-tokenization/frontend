import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'connected-react-router';
import { history } from 'store';

import Page404 from 'pages/404';
import Home from 'pages/Home';
import ObjectScreen from 'pages/ObjectScreen';
import MarketScreen from 'pages/Market';
import Profile from 'pages/Profile';

const Routes = () => (
  <Router history={history}>
    <Switch>
      <Route path="/market/:objectId" component={MarketScreen} />
      <Route path="/market" component={MarketScreen} />
      <Route path="/details/:objectId" component={ObjectScreen} />
      <Route path="/profile" component={Profile} />
      <Route path="/" component={Home} />
      <Route path="*" element={Page404} />
    </Switch>
  </Router>
);

export default Routes;
