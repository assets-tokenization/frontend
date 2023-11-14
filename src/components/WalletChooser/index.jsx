import * as React from 'react';
import { useTranslate } from 'react-translate';
import { useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { Typography, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import Button from '@mui/material/Button';
import SnackBarWrapper from 'components/Snackbar';
import { ReactComponent as ArrowForwardIcon } from 'assets/images/arrowForwardWhite.svg';
import ArrowBackIcon from 'assets/images/arrowBackBlueIcon.svg';
import classNames from 'classnames';
import { ReactComponent as MetaMaskIcon } from 'assets/images/logos_metamask-icon.svg';
import { ReactComponent as WalletConnectIcon } from 'assets/images/simple-icons_walletconnect.svg';
import { ReactComponent as CoinbaseWalletIcon } from 'assets/images/coinbase.svg';
import { updateProfileData } from 'actions/profile';
import { checkMetaMaskState } from 'actions/contracts';

const styles = (theme) => ({
  wrapper: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      display: 'block'
    }
  },
  descriptionTitle: {
    fontSize: 14,
    lineHeight: '21px',
    fontWeight: 600,
    marginBottom: 10
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: '21px',
    [theme.breakpoints.down('sm')]: {
      fontSize: 11,
      lineHeight: '16px',
      fontWeight: 400,
      color: 'rgba(89, 89, 89, 1)'
    }
  },
  actionIcon: {
    marginLeft: 10
  },
  actionIconBack: {
    marginRight: 10
  },
  backButton: {
    marginRight: 20
  },
  formControlLabelRoot: {
    marginBottom: 10,
    border: '1px solid rgba(0, 65, 231, 1)',
    borderRadius: 4,
    backgroundColor: 'rgba(63, 111, 232, 0.08)',
    marginLeft: 0,
    minHeight: 64,
    minWidth: 340,
    paddingLeft: 20,
    [theme.breakpoints.down('sm')]: {
      minWidth: 'unset',
      marginRight: 0
    }
  },
  formControlLabelRootDisabled: {
    borderColor: 'rgba(226, 227, 231, 1)',
    color: 'rgba(226, 227, 231, 1)',
    backgroundColor: '#fff',
    '& img': {
      opacity: 0.5
    }
  },
  formControlRoot: {
    marginRight: 30,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginRight: 0
    }
  },
  radioGroup: {
    marginBottom: 30,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 16
    }
  },
  formControlLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    paddingRight: 20
  },
  actions: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      marginBottom: 20
    }
  },
  mobileBottomBlock: {
    [theme.breakpoints.down('sm')]: {
      backgroundColor: 'rgba(246, 246, 246, 1)',
      padding: 10,
      marginBottom: 30
    }
  },
  link: {
    color: '#0041E7'
  }
});

const useStyles = makeStyles(styles);

const WALLETS = [
  {
    name: 'MetaMask',
    Icon: MetaMaskIcon
  },
  {
    name: 'walletConnect',
    Icon: WalletConnectIcon
  },
  {
    name: 'Coinbase Wallet',
    Icon: CoinbaseWalletIcon
  }
];

const DEFAULT_WALLET = WALLETS[0].name;

const WalletChooser = ({ setActiveStep }) => {
  const t = useTranslate('LoginScreen');
  const classes = useStyles();
  const [value, setValue] = React.useState(DEFAULT_WALLET);
  const [error, setError] = React.useState(false);

  const dispatch = useDispatch();

  const handleChange = (event) => {
    setValue(event.target.value);
    setError(false);
  };

  const handleWalletLogin = async () => {
    switch (value) {
      case 'MetaMask':
        const metamaskState = await checkMetaMaskState();

        if (metamaskState !== 'connected') {
          setError(t(metamaskState));
          return;
        }

        await window.ethereum
          .request({ method: 'eth_requestAccounts' })
          .then(async (wallet) => {
            const result = await updateProfileData({
              wallet: wallet[0]
            })(dispatch);

            if (result instanceof Error) {
              setError(result.message);
              return;
            }
            setActiveStep(2);
          })
          .catch((err) => {
            if (err.code === 4001) {
              setError('Please connect to MetaMask.');
            } else {
              setError(err.message);
            }
          });
        break;
      case 'walletConnect':
        break;
      case 'Coinbase Wallet':
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className={classes.wrapper}>
        <div>
          <FormControl
            classes={{
              root: classes.formControlRoot
            }}
          >
            <RadioGroup
              name="wallets"
              value={value}
              onChange={handleChange}
              className={classes.radioGroup}
            >
              {WALLETS.map(({ name, Icon }) => {
                const disabled = name !== DEFAULT_WALLET;

                return (
                  <FormControlLabel
                    classes={{
                      root: classNames({
                        [classes.formControlLabelRoot]: true,
                        [classes.formControlLabelRootDisabled]: disabled
                      }),
                      label: classes.formControlLabel
                    }}
                    disabled={disabled}
                    value={name}
                    key={name}
                    control={<Radio />}
                    label={
                      <>
                        <span>{name}</span>

                        <Icon className={classes.logo} />
                      </>
                    }
                  />
                );
              })}
            </RadioGroup>
          </FormControl>
        </div>
        <div className={classes.mobileBottomBlock}>
          <Typography className={classes.descriptionTitle}>{t('WalletRegTitle')}</Typography>

          <Typography className={classes.descriptionText}>
            {t('WalletRegTitleDescription')}
            <a
              href="https://support.metamask.io/hc/en-us/articles/360015489531-Getting-started-with-MetaMask"
              target="_blank"
              rel="noopener noreferrer"
              className={classes.link}
            >
              {t('WalletRegTitleDescriptionLink')}
            </a>
          </Typography>
        </div>
      </div>

      <div className={classes.actions}>
        <Button
          size="large"
          color="primary"
          variant="outlined"
          onClick={() => setActiveStep(0)}
          className={classes.backButton}
        >
          <img className={classes.actionIconBack} src={ArrowBackIcon} alt="arrow forward icon" />
          {t('Back')}
        </Button>

        <Button size="large" color="primary" variant="contained" onClick={handleWalletLogin}>
          {t('Continue')}
          <ArrowForwardIcon className={classes.actionIcon} />
        </Button>
      </div>

      <SnackBarWrapper
        onClose={() => setError(false)} 
        error={error}
      />
    </>
  );
};

export default WalletChooser;
