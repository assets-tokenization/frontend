import * as api from 'services/api';

export const getProfileData = () => (dispatch) =>
  api.get('profile', 'profile/GET_PROFILE_DATA', dispatch);

export const updateProfileData = (data) => (dispatch) =>
  api.put('profile', { data: { ...data } }, 'profile/UPDATE_PROFILE', dispatch)
    .then((result) => {
      getProfileData()(dispatch);
      return result;
    })
    .catch((error) => {
      return error;
    });
