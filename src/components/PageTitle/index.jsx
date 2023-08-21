import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Typography } from '@mui/material';

const styles = (theme) => ({
  headline: {
    fontSize: 32,
    fontWeight: 700,
    lineHeight: '40px',
    marginTop: 30,
    marginBottom: 30,
    maxWidth: 640,
    [theme.breakpoints.down('sm')]: {
      fontSize: 20,
      lineHeight: '30px',
      marginTop: 16,
      marginBottom: 24,
      margin: '16px 8px'
    }
  }
});

const useStyles = makeStyles(styles);

const PageTitle = ({ children }) => {
  const classes = useStyles();

  return <Typography className={classes.headline}>{children}</Typography>;
};

export default PageTitle;
