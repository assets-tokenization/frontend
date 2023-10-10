import * as api from 'services/api';
import store from 'store';

const { dispatch } = store;

const REQUEST_SIGN_DATA = 'REQUEST_SIGN_DATA';
const CHECK_SIGN_DATA = 'CHECK_SIGN_DATA';

export function requestSignData() {
  return api.get('ray', REQUEST_SIGN_DATA, dispatch);
}

export async function checkSignDataUniq(options) {
  try {
    const result = await api.post('sign', options, CHECK_SIGN_DATA, dispatch);
    return result;
  } catch (error) {
    console.error('Error checking sign data:', error);
    throw error;
  }
}
