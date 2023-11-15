import React, { lazy, Suspense } from 'react';
import Preloader from 'components/Preloader';
import { useDispatch } from 'react-redux';
import { getProfileData } from 'actions/profile';
import { isMobile } from 'react-device-detect';
import { useTranslate } from 'react-translate';
import { ErrorBoundary } from 'react-error-boundary';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const Login = lazy(() => import('pages/Login'));
const ServiceMessage = lazy(() => import('components/ServiceMessage'));

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

    setOpen(isMobile && typeof window.ethereum === 'undefined');
  }, [dispatch]);

  const handleRedirect = () => {
    const currentUrl = window.location.origin;
    window.open(`https://metamask.app.link/dapp/${currentUrl}`, '_blank');
  };

  const RenderDialog = React.useCallback(() => (
    <>
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
    </>
  ), [open, t]);

  if (error) {
    if (['401 unauthorized'].includes(error)) {
      return (
        <ErrorBoundary fallback={<div>Error</div>}>
          <Suspense fallback={<Preloader />}>
            <Login onSuccess={setError} />
            <RenderDialog />
          </Suspense>
        </ErrorBoundary>
      );
    }

    return (
      <ErrorBoundary fallback={<div>Error</div>}>
        <Suspense fallback={<Preloader />}>
          <ServiceMessage error={new Error(error)} />
        </Suspense>
      </ErrorBoundary>
    );
  }

  if (loading) {
    return <Preloader />;
  }

  return (
    <>
      {children}
      <RenderDialog />
    </>
  );
};

export default Auth;
