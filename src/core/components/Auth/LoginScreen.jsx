import config from 'config.json';
import storage from 'helpers/storage';
import generatePassword from 'password-generator';

export default () => {
  const { pathname, search } = window.location;

  let signature = storage.getItem('cabState');

  if (pathname !== '/') {
    storage.setItem('backUrl', pathname + (search || ''));
  }

  if (!signature) {
    const signa = generatePassword(20, false);
    storage.setItem('cabState', signa);
    signature = storage.getItem('cabState');
  }

  if (config?.idAuthLink && config?.clientId) {
    window.location =
      config.idAuthLink +
      `?redirect_uri=${window?.location?.origin}/&client_id=${config?.clientId}&state=${signature}`;
    return null;
  }

  window.location = (config.authLink || '/redirect/auth') + `?state=${signature}`;
  return null;
};
