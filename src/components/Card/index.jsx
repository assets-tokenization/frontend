import React from "react";
import makeStyles from '@mui/styles/makeStyles';
import classNames from "classnames";

const styles = (theme) => ({
  card: {
    boxShadow: '8px 8px 24px 0px rgba(2, 2, 70, 0.05)',
    border: '1px solid rgba(233, 235, 241, 1)',
    borderRadius: 16,
    padding: 24,
    backgroundColor: '#fff',
    marginBottom: 48,
    maxWidth: 728,
    [theme.breakpoints.down('sm')]: {
      padding: 16,
      marginBottom: 16
    }
  },
  fullWidth: {
    maxWidth: '100%'
  }
});

const useStyles = makeStyles(styles);

const Card = ({
  children,
  fullWidth,
  className
}) => {
  const classes = useStyles();

  return (
    <>
      <div className={classNames({
        [classes.card]: true,
        [classes.fullWidth]: fullWidth,
      }, className)}>
        {children}
      </div>
    </>
  );
};

export default Card;
