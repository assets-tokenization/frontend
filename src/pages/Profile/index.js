import React from 'react';
import { useTranslate } from 'react-translate';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Button, Typography, TextField } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Grow from '@mui/material/Grow';
import MuiAlert from '@mui/material/Alert';
import makeStyles from '@mui/styles/makeStyles';
import ProgressLine from 'components/Preloader/ProgressLine';
import headline_logo from 'assets/images/headline_logo.svg';
import classNames from 'classnames';
import { updateProfileData, getProfileData } from 'actions/profile';

const styles = (theme) => ({
  wrapper: {
    padding: 60,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 1260,
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {
      padding: 0,
      paddingTop: 30
    }
  },
  headline: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
  },
  logo: {
    width: 25,
    height: 40,
    display: 'block',
    margin: '0 auto',
    marginBottom: 20,
    [theme.breakpoints.down('sm')]: {
      width: 14,
      height: 24,
      marginBottom: 10
    }
  },
  title: {
    fontSize: 32,
    lineHeight: '40px',
    fontWeight: 700,
    marginBottom: 20,
    color: 'rgba(0, 0, 0, 1)',
    [theme.breakpoints.down('sm')]: {
      fontSize: 16,
      lineHeight: '24px',
      textAlign: 'center',
      marginBottom: 10,
      maxWidth: 300
    }
  },
  card: {
    boxShadow: '8px 8px 24px 0px rgba(2, 2, 70, 0.05)',
    border: '1px solid rgba(233, 235, 241, 1)',
    borderRadius: 16,
    padding: 40,
    backgroundColor: '#fff',
    [theme.breakpoints.down('sm')]: {
      padding: 16,
      marginBottom: 20
    }
  },
  actions: {
    display: 'flex',
    justifyContent: 'end',
    marginTop: 10,
    '& > button': {
      marginLeft: 20,
    }
  },
  textfield: {
    width: '100%',
    marginBottom: 32
  }
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const useStyles = makeStyles(styles);

const ProfileScreen = ({ history }) => {
  const t = useTranslate('Profile');
  const [wallet, setWallet] = React.useState(useSelector(state => state?.profile?.userInfo?.wallet));
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const dispatch = useDispatch();

  const classes = useStyles();

  React.useEffect(() => {
    const fetchData = async () => {
      if (!wallet) {
        setLoading(true);
        await getProfileData()(dispatch);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRedirectBack = () => {
    if (history.goBack) {
      history.goBack();
    } else {
      history.replace('/');
    }
  };

  const handleCancel = () => {
    handleRedirectBack();
  };

  const handleSave = async () => {
    if (loading) return;
  
    setLoading(true);

    const result = await updateProfileData({
      wallet
    })(dispatch);

    await getProfileData()(dispatch);

    setLoading(false);

    if (result instanceof Error) {
      setError(result.message);
      return;
    }
    
    handleRedirectBack();
  };

  const handleChangeWallet = (event) => {
    setWallet(event.target.value);
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.headline}>
        <img src={headline_logo} alt="headline_logo" className={classes.logo} />

        <Typography className={classes.title}>{t('Title')}</Typography>
      </div>

      <div
        className={classNames({
          [classes.card]: true,
          [classes.choseMethod]: true
        })}
      >
        <TextField
          value={wallet}
          variant="outlined"
          margin="normal"
          label={t('WalletAddress')}
          onChange={handleChangeWallet}
          className={classNames({
            [classes.textfield]: true
          })}
        />

        <ProgressLine loading={loading} />

        <div className={classes.actions}>
          <Button
            onClick={handleCancel}
          >
            {t('Cancel')}
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
          >
            {t('Save')}
          </Button>
        </div>
      </div>

      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        TransitionComponent={(props) => <Grow {...props} />}
        open={!!error}
        onClose={() => setError(false)}
        key={error}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </div>
  );
};

export default ProfileScreen;