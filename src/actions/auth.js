import storage from 'helpers/storage';

export const logout = () => {
  storage.removeItem('token');
  return { type: 'LOGOUT' };
};
