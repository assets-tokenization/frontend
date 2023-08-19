import React from 'react';
import {
  Dialog,
  Toolbar,
  Typography,
  IconButton,
  DialogContent,
} from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import CloseIcon from '@mui/icons-material/Close';
import classNames from 'classnames';

const styles = {
  header: {
    padding: 0,
    backgroundColor: '#232323',
    height: 32,
  },
  title: {
    flexGrow: 1,
    color: '#E2E2E2',
    padding: '0 10px',
  },
  button: {
    color: '#E2E2E2!important',
  },
  dialog: {
    display: 'flex',
    '& .ace_editor': {
      flex: 1,
    },
  },
  content: {
    padding: 0,
  },
  overflow: {
    overflow: 'hidden'
  }
};

const FullScreenDialog = ({
  classes,
  title,
  open,
  onClose,
  actions,
  children,
  disableEscapeKeyDown,
  disableScrollBody,
  ...rest
}) => (
  <Dialog
    {...rest}
    open={open}
    onClose={onClose}
    fullScreen={true}
    fullWidth={true}
    disableEscapeKeyDown={disableEscapeKeyDown}
  >
    <Toolbar className={classes.header}>
      <Typography variant="subtitle1" className={classes.title}>
        {title}
      </Typography>
      {actions}
      <IconButton className={classes.button} onClick={onClose} size="large">
        <CloseIcon />
      </IconButton>
    </Toolbar>
    <DialogContent
      className={
        classNames({
          [classes.content]: true,
          [classes.overflow]: disableScrollBody,
        })
      }
    >
      {children}
    </DialogContent>
  </Dialog>
);

export default withStyles(styles)(FullScreenDialog);
