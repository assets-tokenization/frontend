import * as api from 'services/api';

export const getProfileData = () => (dispatch) =>
  api.get('profile', 'GET_PROFILE_DATA', dispatch);

export const updateProfileData = (data) => (dispatch) =>
  api.put('profile', data, 'UPDATE_PROFILE', dispatch);