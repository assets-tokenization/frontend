import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'connected-react-router';
import { history } from 'store';

import Page404 from 'pages/404';

const Home = lazy(() => import('pages/Home'));
const ObjectScreen = lazy(() => import('pages/ObjectScreen'));
const MarketScreen = lazy(() => import('pages/Market'));
const Profile = lazy(() => import('pages/Profile'));

const Routes = () => (
  <Router history={history}>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route path="/market/:objectId" component={MarketScreen} />
        <Route path="/market" component={MarketScreen} />
        <Route path="/details/:objectId" component={ObjectScreen} />
        <Route path="/profile" component={Profile} />
        <Route path="/" component={Home} />
        <Route path="*" element={Page404} />
      </Switch>
    </Suspense>
  </Router>
);

export default Routes;
