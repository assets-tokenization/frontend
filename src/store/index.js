import { init } from '@rematch/core';
import { createBrowserHistory } from 'history';
import { connectRouter } from 'connected-react-router';
import { routerMiddleware } from 'react-router-redux';
import reduxLogger from 'redux-logger';
import * as models from 'models';

export const history = createBrowserHistory();

const middleware = routerMiddleware(history);

const store = init({
  models,
  middlewares: [reduxLogger],
  redux: {
    reducers: {
      router: connectRouter(history)
    },
    middlewares: [middleware]
  }
});

export default store;
