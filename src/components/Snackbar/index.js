import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@mui/material/Snackbar';
import Grow from '@mui/material/Grow';
import MuiAlert from '@mui/material/Alert';
import makeStyles from '@mui/styles/makeStyles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const styles = () => ({
  wrapper: {
    maxWidth: '80%',
    minWidth: 200,
    '& > div': {
      maxWidth: '80%',
      minWidth: 200
    }
  },
  icon: {
    color: '#fff'
  }
});

const useStyles = makeStyles(styles);

const SnackBarWrapper = ({
  onClose,
  error,
  severity
}) => {
  const classes = useStyles();

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      TransitionComponent={(props) => <Grow {...props} />}
      open={!!error}
      onClose={onClose}
      key={error}
      classes={{
        root: classes.wrapper
      }}
    >
      <Alert
        severity={severity}
        action={(
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={onClose}
          >
            <CloseIcon className={classes.icon} />
          </IconButton>
        )}
      >
        {error}
      </Alert>
    </Snackbar>
  );
}

SnackBarWrapper.propTypes = {
  onClose: PropTypes.func,
  severity: PropTypes.string
};

SnackBarWrapper.defaultProps = {
  onClose: () => {},
  severity: 'error'
};

export default SnackBarWrapper;
