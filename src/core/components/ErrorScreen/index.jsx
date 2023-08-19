import React from 'react';
import { translate } from 'react-translate';
import { DialogTitle, DialogContent, DialogContentText } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import ErrorIcon from '@mui/icons-material/ErrorOutline';
import classNames from 'classnames';

const styles = {
  icon: {
    fontSize: 82,
    color: 'red',
  },
  title: {
    textAlign: 'center',
  },
  text: {
    color: '#fff',
  },
};

const ErrorScreen = ({ t, classes, error, darkTheme }) => {
  if (!error) return null;

  return (
    <>
      <DialogTitle className={classes.title}>
        <ErrorIcon className={classes.icon} />
      </DialogTitle>
      <DialogTitle className={classes.title}>
        {t('ErrorMessageHeader')}
      </DialogTitle>
      <DialogContent className={classes.title}>
        <DialogContentText
          className={
            classNames({
              [classes.text]: darkTheme
            })
          }
        >
          {error.message}
        </DialogContentText>
      </DialogContent>
    </>
  );
};

const translated = translate('TaskPage')(ErrorScreen);
export default withStyles(styles)(translated);
