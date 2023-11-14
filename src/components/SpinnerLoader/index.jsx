import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { ReactComponent as Spinner } from 'assets/images/Spinner-Gradient-7.svg';

const styles = (theme) => ({
  spinner: {
    display: 'flex',
    width: 48,
    height: 48,
    margin: '0 auto',
    marginTop: 66,
    animation: '$spin 1s linear infinite',
    [theme.breakpoints.down('sm')]: {
      marginTop: 20
    }
  },
  '@keyframes spin': {
    '100%': {
      transform: 'rotate(360deg)'
    }
  }
});

const useStyles = makeStyles(styles);

const SpinnerLoader = () => {
  const classes = useStyles();

  return <Spinner className={classes.spinner} />;
};

export default SpinnerLoader;
