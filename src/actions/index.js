import * as api from 'services/api';

export const getObjects = () => (dispatch) => api.get('objects', 'GET_OBJECTS', dispatch);

export const getRealEstate = () => (dispatch) =>
  api.get('my_real_estate', 'GET_REAL_ESTATE', dispatch);

export const getDetails = () => (dispatch) => api.get('details', 'GET_DETAILS', dispatch);

export const saveDetails = (data) => (dispatch) =>
  api.post('object', data, 'GET_DETAILS', dispatch);

export const getMessages = () => (dispatch) => api.get('messages', 'GET_MESSAGES', dispatch);
