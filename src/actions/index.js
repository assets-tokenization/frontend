import * as api from 'services/api';

export const getObjects = () => (dispatch) =>
  api.get('objects', 'GET_OBJECTS', dispatch);

export const getRealEstate = () => (dispatch) =>
  api.get('my_real_estate', 'GET_REAL_ESTATE', dispatch);

export const getDetails = (id) => (dispatch) => api.get(`details/${id}`, 'GET_DETAILS', dispatch);

export const saveDetails = (id, data) => (dispatch) =>
  api.put(`object/${id}`, data, 'GET_DETAILS', dispatch);

export const getMessages = () => (dispatch) => api.get('messages', 'GET_MESSAGES', dispatch);
