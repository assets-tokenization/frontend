import { combineReducers } from "redux";

import reducers from "reducers";

const RESET_STATE = "APP/RESET_STATE";

const clearState = ({ app, auth, eds }) => ({ app, auth, eds });

const combined = (state, action) => {
  if (action.type === RESET_STATE) {
    state = clearState(state);
  }
  return combineReducers(reducers)(state, action);
};

export default combined;
