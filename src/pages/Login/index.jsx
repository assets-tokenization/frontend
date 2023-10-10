import React from 'react';
import { useTranslate } from 'react-translate';
import { Button, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import Fade from '@mui/material/Fade';
import headline_logo from 'assets/images/headline_logo.svg';
import classNames from 'classnames';
import Stepper from 'components/Stepper';
import EDSForm from 'components/EDSForm';
import WalletChooser from 'components/WalletChooser';
import SuccessRegistration from 'components/SuccessRegistration';
import LoginIcon from '@mui/icons-material/Login';
import { requestSignData, checkSignDataUniq } from 'actions/eds';
import storage from 'helpers/storage';
import { history } from 'store';

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
  subtitle: {
    fontSize: 18,
    lineHeight: '27px',
    fontWeight: 400,
    textAlign: 'center',
    marginBottom: 40,
    maxWidth: 545,
    color: 'rgba(0, 0, 0, 1)',
    [theme.breakpoints.down('sm')]: {
      fontSize: 11,
      lineHeight: '16px',
      textAlign: 'center',
      maxWidth: 300,
      marginBottom: 20
    }
  },
  cards: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
      paddingLeft: 8,
      paddingRight: 8
    }
  },
  stepper: {
    maxWidth: 425,
    marginRight: 40,
    boxSizing: 'border-box',
    [theme.breakpoints.down('sm')]: {
      maxWidth: 'unset',
      marginRight: 0
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
  form: {
    flex: 1,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 40
    }
  },
  formTitle: {
    fontSize: 18,
    lineHeight: '27px',
    fontWeight: 600,
    marginBottom: 20
  },
  formWrapper: {
    maxWidth: 640
  },
  loginIcon: {
    fill: '#595959',
    width: 48,
    height: 48,
    marginBottom: 8,
    [theme.breakpoints.down('sm')]: {
      width: 32,
      height: 32,
      marginBottom: 16
    }
  },
  choseMethod: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 530,
    alignSelf: 'center',
    marginTop: 28,
    [theme.breakpoints.down('sm')]: {
      marginTop: 14,
      marginRight: 8,
      marginLeft: 8,
      paddingTop: 24,
      paddingBottom: 40
    }
  },
  choseMethodSubtitle: {
    fontSize: 16,
    lineHeight: '24px',
    fontWeight: 400,
    marginBottom: 30,
    textAlign: 'center',
    maxWidth: 377,
    padding: '0 38px',
    [theme.breakpoints.down('sm')]: {
      maxWidth: 'unset',
      padding: 0,
      fontSize: 14,
      lineHeight: '21px',
      marginBottom: 32
    }
  },
  orText: {
    fontSize: 14,
    lineHeight: '21px',
    fontWeight: 400,
    marginBottom: 8,
    marginTop: 8,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 16,
      marginTop: 16
    }
  },
  fullWidthButton: {
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  authForm: {
    display: 'flex',
    alignSelf: 'center',
    minWidth: 796,
    [theme.breakpoints.down('sm')]: {
      padding: 0,
      display: 'block',
      alignSelf: 'unset',
      minWidth: 'unset'
    }
  },
  authCard: {
    paddingRight: 114,
    [theme.breakpoints.down('sm')]: {
      paddingRight: 16,
      marginLeft: 8,
      marginRight: 8
    }
  }
});

const useStyles = makeStyles(styles);

const LoginScreen = ({
  onSuccess
}) => {
  const t = useTranslate('LoginScreen');
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [method, setMethod] = React.useState(null);

  const handleChangeStep = (step) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveStep(step);
  };

  const getEncodeCert = async (signer, index) => {
    const certificate = await signer.execute('EnumOwnCertificates', index);

    if (certificate === null) {
        throw new Error('Сертифікат шифрування відсутній. Зверніться до вашого АЦСК');
    }

    if (certificate.keyUsage === 'Протоколи розподілу ключів') {
        return certificate;
    }

    return getEncodeCert(signer, index + 1);
  };

  const signDataAndLogin = async (cert, signer) => {
    const { ray } = await requestSignData();
    const signature = await signer.execute('SignData', ray, true);

    const signData = { ray: signature };

    const result = await checkSignDataUniq(signData);

    if (result instanceof Error) {
      throw new Error(t(result.message, { details: result.details }));
    }

    const token = result?.data?.token;

    storage.setItem('token', token);

    if (method === 'auth') {
      history.replace('/home');
      onSuccess();
      return;
    }

    handleChangeStep(1);
  };

  const handleSelectKey = (cert, signer, resetPrivateKey) => {
    let iteration = 0;

    const execute = () => signDataAndLogin(cert, signer, resetPrivateKey).catch((e) => {
      iteration += 1;
      if (iteration <= 3) {
        return execute();
      }
      throw e;
    });

    return execute();
  };

  const redirectToHomeScreen = () => {
    history.replace('/home');
    onSuccess();
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.headline}>
        <img src={headline_logo} alt="headline_logo" className={classes.logo} />

        <Typography className={classes.title}>{t('Title')}</Typography>

        {method === null ? null : (
          <Typography className={classes.subtitle}>{t('Subtitle')}</Typography>
        )}
      </div>

      {method === null ? (
        <div
          className={classNames({
            [classes.card]: true,
            [classes.choseMethod]: true
          })}
        >
          <LoginIcon className={classes.loginIcon} />

          <Typography className={classes.choseMethodSubtitle}>{t('ChoseMethod')}</Typography>

          <Button
            variant="contained"
            onClick={() => setMethod('auth')}
            className={classes.fullWidthButton}
          >
            {t('AuthAction')}
          </Button>

          <Typography className={classes.orText}>{t('or')}</Typography>

          <Button onClick={() => setMethod('register')} className={classes.fullWidthButton}>
            {t('RegisterAction')}
          </Button>
        </div>
      ) : null}

      {method === 'auth' ? (
        <Fade in={true}>
          <div
            className={classNames({
              [classes.authForm]: true,
              [classes.cards]: true
            })}
          >
            <div
              className={classNames({
                [classes.form]: true,
                [classes.authCard]: true,
                [classes.card]: true
              })}
            >
              {activeStep === 0 ? (
                <>
                  <Typography className={classes.formTitle}>{t('LoginFormTitle')}</Typography>

                  <div className={classes.formWrapper}>
                    <EDSForm onSelectKey={handleSelectKey} showServerList={true} />
                  </div>
                </>
              ) : null}

              {activeStep === 1 ? (
                <>
                  <Typography className={classes.formTitle}>{t('WalletFormTitle')}</Typography>

                  <WalletChooser setActiveStep={handleChangeStep} />
                </>
              ) : null}
              {activeStep === 2 ? (
                <SuccessRegistration redirectToHomeScreen={redirectToHomeScreen} />
              ) : null}
            </div>
          </div>
        </Fade>
      ) : null}

      {method === 'register' ? (
        <Fade in={true}>
          <div className={classes.cards}>
            <div
              className={classNames({
                [classes.stepper]: true,
                [classes.card]: true
              })}
            >
              <Stepper
                activeStep={activeStep}
                steps={[
                  {
                    label: t('Step1label'),
                    description: t('Step1description')
                  },
                  {
                    label: t('Step2label'),
                    description: t('Step2description')
                  }
                ]}
              />
            </div>
            <div
              className={classNames({
                [classes.form]: true,
                [classes.card]: true
              })}
            >
              {activeStep === 0 ? (
                <>
                  <Typography className={classes.formTitle}>{t('LoginFormTitle')}</Typography>

                  <div className={classes.formWrapper}>
                    <EDSForm onSelectKey={handleSelectKey} showServerList={true} />
                  </div>
                </>
              ) : null}

              {activeStep === 1 ? (
                <>
                  <Typography className={classes.formTitle}>{t('WalletFormTitle')}</Typography>

                  <WalletChooser setActiveStep={handleChangeStep} />
                </>
              ) : null}
              {activeStep === 2 ? (
                <SuccessRegistration redirectToHomeScreen={redirectToHomeScreen} />
              ) : null}
            </div>
          </div>
        </Fade>
      ) : null}
    </div>
  );
};

export default LoginScreen;
