import React, { useCallback } from 'react';
import { useTranslate } from 'react-translate';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ProgressLine from 'components/Preloader/ProgressLine';
import SnackBarWrapper from 'components/Snackbar';
import headline_logo from 'assets/images/headline_logo.svg';
import classNames from 'classnames';
import { updateProfileData } from 'actions/profile';
import { checkMetaMaskState } from 'actions/contracts';

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
      marginLeft: 20
    }
  },
  textfield: {
    width: '100%',
    marginBottom: 32
  },
  error: {
    marginBottom: 10
  }
});

const useStyles = makeStyles(styles);

const ProfileScreen = () => {
  const t = useTranslate('Profile');
  const [wallet, setWallet] = React.useState(
    useSelector((state) => state?.profile?.userInfo?.wallet)
  );
  const [wallets, setWallets] = React.useState([]);
  const [error, setError] = React.useState(false);
  const [validationError, setValidationError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();

  const handleRedirectBack = useCallback(() => {
    history.replace('/');
  }, [history]);

  const handleCancel = useCallback(() => {
    handleRedirectBack();
  }, [handleRedirectBack]);

  React.useState(() => {
    const getWallets = async () => {
      const metamaskState = await checkMetaMaskState();

      if (metamaskState !== 'connected') {
        setError(t(metamaskState));
        return;
      }

      setLoading(true);

      await window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(async (metaWallets) => {
          setWallets(metaWallets);
          setLoading(false);
        })
        .catch((err) => {
          if (err.code === 4001) {
            setError(t('Please connect to MetaMask.'));
          } else {
            setError(err.message);
          }
          setLoading(false);
        });
    };

    getWallets();
  }, []);

  const handleSave = useCallback(async () => {
    if (loading) {
      return;
    }

    if (!wallet) {
      setValidationError(t('WalletAddressRequired'));
      return;
    }

    setValidationError(false);

    setLoading(true);

    const result = await updateProfileData({
      wallet
    })(dispatch);

    setLoading(false);

    if (result instanceof Error) {
      setError(result.message);
      return;
    }

    handleRedirectBack();
  }, [
    loading,
    wallet,
    t,
    setValidationError,
    setLoading,
    updateProfileData,
    dispatch,
    handleRedirectBack
  ]);

  const handleChangeWallet = useCallback(
    (event) => {
      setWallet(event.target.value);
    },
    [setWallet]
  );

  return (
    <div className={classes.wrapper}>
      <div className={classes.headline}>
        <img width={24} height={40} src={headline_logo} alt="headline logo" className={classes.logo} />
        <Typography className={classes.title}>{t('Title')}</Typography>
      </div>

      <div
        className={classNames({
          [classes.card]: true,
          [classes.choseMethod]: true
        })}
      >
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="platform"
              name="platform"
              value={wallet}
              onChange={handleChangeWallet}
            >
              {(wallets || []).map((value) => (
                <FormControlLabel
                  key={value}
                  value={value}
                  control={<Radio />}
                  label={value}
                />
              ))}
            </RadioGroup>
          </FormControl>

        {!!validationError && (
          <Typography color="error" variant="caption">
            {validationError}
          </Typography>
        )}

        <ProgressLine loading={loading} />

        <div className={classes.actions}>
          <Button onClick={handleCancel}>{t('Cancel')}</Button>

          <Button variant="contained" onClick={handleSave}>
            {t('Save')}
          </Button>
        </div>
      </div>

      <SnackBarWrapper
        onClose={() => setError(false)}
        error={error}
      />
    </div>
  );
};

export default ProfileScreen;
