import { useSelector } from 'react-redux';

// eslint-disable-next-line import/prefer-default-export
export const useAuth = () => useSelector((state) => state.auth);
