import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Grow from '@mui/material/Grow';
import MuiAlert from '@mui/material/Alert';
import makeStyles from '@mui/styles/makeStyles';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const styles = () => ({
  wrapper: {
    maxWidth: '100%',
    '& > div': {
      maxWidth: '100%'
    }
  }
});

const useStyles = makeStyles(styles);

const SnackBarWrapper = ({
  onClose,
  error
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
      <Alert severity="error">{error}</Alert>
    </Snackbar>
  );
}

export default SnackBarWrapper;
