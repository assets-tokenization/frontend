import * as api from 'services/api';
// import * as Sentry from '@sentry/browser';

const SET_OPEN_SIDEBAR = 'APP/SET_OPEN_SIDEBAR';
const SET_OPEN_DAWER = 'APP/SET_OPEN_DAWER';

const RESET_STATE = 'APP/RESET_STATE';

export const ping = () => (dispatch) => api.get('test/ping', 'PING', dispatch);

export const healthCheck = () => (dispatch) =>
  api.get('test/ping/services', 'GET_SERVICES_STATUSES', dispatch).catch((error) => {
    // Sentry.captureException(error);
    return error;
  });

export const setOpenSidebar = (open) => ({
  type: SET_OPEN_SIDEBAR,
  payload: open
});

export const setOpenDawer = (open) => ({
  type: SET_OPEN_DAWER,
  payload: open
});

export const resetState = () => ({
  type: RESET_STATE
});
