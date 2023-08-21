import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import classNames from 'classnames';

const styles = (theme) => ({
  status: {
    borderRadius: 35,
    color: 'rgba(74, 164, 47, 1)',
    backgroundColor: 'rgba(74, 164, 47, 0.1)',
    border: '1px solid rgba(74, 164, 47, 0.4)',
    fontSize: 12,
    fontWeight: 600,
    lineHeight: '16px',
    letterSpacing: '0.800000011920929px',
    textTransform: 'uppercase',
    padding: '0 8px',
    display: 'inline-block',
    [theme.breakpoints.down('sm')]: {
      fontSize: 10,
      lineHeight: '14px',
      marginBottom: 10
    }
  },
  warning: {
    color: '#CA7900',
    backgroundColor: 'rgba(255, 229, 0, 0.20)',
    border: '1px solid rgba(255, 229, 0, 0.40)'
  },
  archive: {
    color: '#9547F6',
    border: '1px solid rgba(149, 71, 246, 0.40)',
    background: 'rgba(149, 71, 246, 0.10)'
  }
});

const useStyles = makeStyles(styles);

const StatusLabel = ({ children, pending, finished }) => {
  const classes = useStyles();

  return (
    <span
      className={classNames({
        [classes.status]: true,
        [classes.warning]: pending,
        [classes.archive]: finished
      })}
    >
      {children}
    </span>
  );
};

export default StatusLabel;
