import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { DialogContent, DialogContentText, Button } from '@mui/material';
import classNames from 'classnames';
import SpinnerLoader from 'components/SpinnerLoader';

const styles = (theme) => ({
  dialogContent: {
    padding: 16,
    fontSize: 16,
    fontWeight: 400,
    lineHeight: '24px',
    marginBottom: 10,
    color: 'rgba(0, 0, 0, 1)',
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
      lineHeight: '21px',
      fontWeight: 600
    }
  },
  dialogContentCenter: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
  dialogActions: {
    justifyContent: 'flex-start',
    padding: 16,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      '& button': {
        width: '100%',
        marginLeft: '0!important',
        marginBottom: 10
      }
    }
  },
  dialogContentTitle: {
    fontSize: 18,
    fontWeight: 600,
    lineHeight: '27px',
    color: 'rgba(0, 0, 0, 1)',
    marginBottom: 10,
    [theme.breakpoints.down('sm')]: {
      fontSize: 16,
      lineHeight: '24px'
    }
  },
  dialogContentText: {
    fontSize: 16,
    fontWeight: 400,
    lineHeight: '24px',
    color: 'rgba(89, 89, 89, 1)',
    marginBottom: 30,
    marginLeft: 60,
    marginRight: 60,
    maxWidth: 550,
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
      lineHeight: '21px',
      marginBottom: 15,
      marginLeft: 0,
      marginRight: 0
    }
  },
  removeMargin: {
    margin: 0
  },
  dialogProcessingButton: {
    marginBottom: 40,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 0,
      marginTop: 5
    }
  },
  successLogo: {
    width: 80,
    height: 80,
    margin: '0 auto',
    marginBottom: 10,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 0,
      width: 56,
      height: 56
    }
  },
  dialogTitleSuccess: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: 8,
    [theme.breakpoints.down('sm')]: {
      padding: 0
    }
  }
});

const useStyles = makeStyles(styles);

const LoadingStep = ({ title, description, actionText, onClick }) => {
  const classes = useStyles();

  return (
    <>
      <SpinnerLoader />

      <DialogContent
        classes={{
          root: classNames(classes.dialogContent, classes.dialogContentCenter)
        }}
      >
        <DialogContentText
          classes={{
            root: classes.dialogContentTitle
          }}
        >
          {title}
        </DialogContentText>
        <DialogContentText
          classes={{
            root: classes.dialogContentText
          }}
        >
          {description}
        </DialogContentText>
        <Button variant="contained" className={classes.dialogProcessingButton} onClick={onClick}>
          {actionText}
        </Button>
      </DialogContent>
    </>
  );
};

export default LoadingStep;
