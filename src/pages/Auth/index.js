import React from 'react';
import Preloader from 'components/Preloader';
import { useDispatch } from 'react-redux';
import { getProfileData } from 'actions/profile';
import { isMobile } from 'react-device-detect';
import { useTranslate } from 'react-translate';
import ServiceMessage from 'components/ServiceMessage';
import Login from 'pages/Login';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const Auth = ({ children }) => {
  const t = useTranslate('Auth');
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        await getProfileData()(dispatch);

        setLoading(false);
      } catch (e) {
        setLoading(false);
        setError(e.message);
      }
    };

    fetchData();

    if (isMobile) {
      setOpen(true);
    }
  }, [dispatch]);

  const handleRedirect = () => {
    const currentUrl = window.location.origin;
    window.open(`https://metamask.app.link/dapp/${currentUrl}`, '_blank');
  };

  if (isMobile) {
    return (
      <Dialog open={open}>
        <DialogTitle>{t('DialogTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('DialogDescription')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleRedirect}
            color="primary"
            variant="contained"
          >
            {t('OpenApp')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  if (error) {
    if (['401 unauthorized'].includes(error)) {
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
