import React from 'react';
import Preloader from 'components/Preloader';

const Auth = ({ history }) => {
  React.useEffect(() => {
    setTimeout(() => {
      const token = localStorage.getItem('token');

      if (token) {
        history.push('/home');
      } else {
        history.push('/login');
      }
    }, 1000);
  }, [history]);

  return <Preloader />;
};

export default Auth;
