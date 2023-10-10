import React from 'react';
import Preloader from 'components/Preloader';
import { useDispatch } from 'react-redux';
import { history } from 'store';
import { getProfileData } from 'actions/profile';
import ServiceMessage from 'components/Auth/ServiceMessage';
import Login from 'pages/Login';

const Auth = ({ children }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        await getProfileData()(dispatch);

        setLoading(false);

        history.push('/home');
      } catch (e) {
        setLoading(false);
        setError(e.message);
      }
    }

    fetchData();
  }, [dispatch]);

  if (error) {
    if (['401 unauthorized', '403 forbidden'].includes(error)) {
      return <Login onSuccess={setError} />;
    }
    return <ServiceMessage error={new Error(error)} />;
  }

  if (loading) {
    return <Preloader />;
  }

  return children;
};

export default Auth;
