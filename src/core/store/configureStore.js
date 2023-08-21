import config from 'config.json';

import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import { createLogger } from 'redux-logger';

import reducers from 'core/reducers';

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const {
  application: { environment }
} = config;

export default function configureStore(history) {
  return createStore(
    reducers,
    composeEnhancers(
      applyMiddleware(
        ...[
          routerMiddleware(history),
          thunk,
          environment !== 'prod' && createLogger({ collapsed: true })
        ].filter(Boolean)
      )
    )
  );
}
