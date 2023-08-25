import React from 'react';
import { useTranslate } from 'react-translate';
import makeStyles from '@mui/styles/makeStyles';
import { Typography, Button } from '@mui/material';

const styles = (theme) => ({
  headline: {
    fontSize: 20,
    fontWeight: 400,
    lineHeight: '30px',
    marginBottom: 30,
    maxWidth: 620,
    [theme.breakpoints.down('sm')]: {
      fontSize: 16,
      marginTop: 10,
      marginBottom: 20,
      lineHeight: '24px'
    }
  },
  logo: {
    marginTop: 60,
    fontSize: 48,
    display: 'inline-block',
    marginBottom: 20,
    [theme.breakpoints.down('sm')]: {
      fontSize: 32,
      marginTop: 20,
      marginBottom: 0
    }
  }
});

const useStyles = makeStyles(styles);

const EmptyState = ({ children, onClick, actionText, error }) => {
  const classes = useStyles();
  const t = useTranslate('Header');

  return (
    <>
      <span className={classes.logo} role="img" aria-label="man shrugging">
        🤷‍♂️
      </span>
      <Typography className={classes.headline}>{children}</Typography>
      {
        error ? null : (
          <Button onClick={onClick} variant="contained">
            {actionText || t('GoToP2P')}
          </Button>
        )
      }
    </>
  );
};

export default EmptyState;
