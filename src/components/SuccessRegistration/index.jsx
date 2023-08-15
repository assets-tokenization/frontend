import * as React from 'react';
import { useTranslate } from 'react-translate';
import makeStyles from '@mui/styles/makeStyles';
import { Button, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from 'assets/images/Check_icon.svg';

const styles = (theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: 550,
    margin: '0 auto'
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    lineHeight: '28px',
    letterSpacing: '0em',
    textAlign: 'center',
    marginBottom: 10,
    [theme.breakpoints.down('sm')]: {
      fontSize: 16,
      fontWeight: 600,
      lineHeight: '24px',
    }
  },
  description: {
    fontSize: 16,
    fontWeight: 400,
    lineHeight: '21px',
    letterSpacing: '0em',
    textAlign: 'center',
    marginBottom: 30,
    color: '#595959',
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
      fontWeight: 400,
      lineHeight: '21px',
      color: 'rgba(89, 89, 89, 1)'
    }
  },
  actionIcon: {
    marginLeft: 10
  },
  logo: {
    marginBottom: 30,
    marginTop: 30,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 20,
      width: 56,
      height: 56,
    }
  },
  actionButton: {
    marginBottom: 30,
  }
});

const useStyles = makeStyles(styles);

const SuccessRegistration = ({
  redirectToHomeScreen,
  title,
  description,
  actionText
}) => {
  const t = useTranslate('LoginScreen');
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <img
        src={CheckIcon}
        alt="headline_logo"
        className={classes.logo}
      />

      <Typography className={classes.title}>
        {title || t("SuccessTitle")}
      </Typography>

      <Typography className={classes.description}>
        {description || t("SuccessDescription")}
      </Typography>

      <Button
        size="large"
        color="primary"
        variant="contained"
        className={classes.actionButton}
        onClick={redirectToHomeScreen}
      >
        {actionText || (
          <>
            {t("GoToRegister")}
            <ArrowForwardIcon className={classes.actionIcon} />
          </>
        )}
      </Button>
    </div>
  );
}

export default SuccessRegistration;
