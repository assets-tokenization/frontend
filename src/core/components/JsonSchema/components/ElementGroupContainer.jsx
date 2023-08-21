import React from 'react';
import classNames from 'classnames';
import renderHTML from 'helpers/renderHTML';

import PropTypes from 'prop-types';

import { Typography, FormControl, FormHelperText, Toolbar } from '@mui/material';

import withStyles from '@mui/styles/withStyles';

import EJVError from './EJVError';
import FieldLabel from './FieldLabel';

const styles = (theme) => ({
  root: {
    display: 'block',
    marginBottom: 40,
    marginTop: 20,
    maxWidth: 640,
    [theme.breakpoints.down('md')]: {
      marginBottom: 20
    }
  },
  withPadding: {
    padding: '10px 20px',
    marginBottom: '0 !important'
  },
  fullWidth: {
    maxWidth: 'unset'
  },
  sample: {
    maxWidth: 1000
  },
  description: {
    maxWidth: 1000,
    [theme.breakpoints.down('md')]: {
      fontSize: 16,
      lineHeight: '24px'
    }
  },
  groupContainer: {
    position: 'relative',
    marginTop: 0,
    marginBottom: 40,
    [theme.breakpoints.down('md')]: {
      marginBottom: 0
    }
  },
  outlined: {
    border: '1px solid rgba(224, 224, 224, 1)',
    padding: '0 20px'
  },
  outlinedSample: {
    maxWidth: 1000,
    marginTop: 0
  },
  errored: {
    borderColor: '#f44336',
    color: '#f44336'
  },
  requiredFieldError: {
    position: 'relative',
    top: -35,
    [theme.breakpoints.down('md')]: {
      top: 0,
      marginBottom: 5,
      marginTop: 0
    }
  },
  noMargin: {
    margin: 0
  }
});

const ElementGroupContainer = ({
  classes,
  className,
  descriptionClassName,
  outlined,
  required,
  description,
  sample,
  actionButtons,
  children,
  error,
  variant,
  width,
  fullWidth,
  maxWidth,
  path,
  useOwnContainer,
  notRequiredLabel,
  noMargin
}) => {
  const sampleText = sample && typeof sample === 'string' ? renderHTML(sample) : sample;

  const actionToolbar = actionButtons ? (
    <Toolbar disableGutters={true}>{actionButtons}</Toolbar>
  ) : null;

  const descriptionComponent = description ? (
    <Typography
      variant={variant}
      gutterBottom={!outlined}
      className={classNames(
        {
          // [classes.errored]: !!error,
          [classes.description]: true
        },
        descriptionClassName
      )}
      tabIndex="0"
      id={path && Array.isArray(path) && path.join('-') + '-description'}
    >
      <FieldLabel
        description={description}
        required={required}
        notRequiredLabel={notRequiredLabel}
      />
      {actionToolbar}
    </Typography>
  ) : (
    actionToolbar
  );

  return (
    <>
      {outlined && descriptionComponent}
      {sampleText && outlined ? (
        <FormHelperText className={classes.outlinedSample} error={!!error}>
          {sampleText}
        </FormHelperText>
      ) : null}
      <FormControl
        variant="standard"
        error={!!error}
        className={classNames(
          {
            [classes.root]: true,
            [classes.groupContainer]: true,
            [classes.withPadding]: !!useOwnContainer,
            [classes.fullWidth]: fullWidth,
            [classes.outlined]: outlined,
            [classes.errored]: !!error,
            [classes.noMargin]: noMargin
          },
          className
        )}
        style={{ width, maxWidth }}
        id={path && Array.isArray(path) && path.join('.')}
      >
        {!outlined && descriptionComponent}
        {sampleText && !outlined ? (
          <FormHelperText className={classes.sample} error={!!error}>
            {sampleText}
          </FormHelperText>
        ) : null}
        {children}
      </FormControl>
      {error ? (
        <FormHelperText className={!noMargin ? classes.requiredFieldError : null} error={!!error}>
          <EJVError error={error} />
        </FormHelperText>
      ) : null}
    </>
  );
};

ElementGroupContainer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  sample: PropTypes.string,
  description: PropTypes.string,
  notRequiredLabel: PropTypes.string
};

ElementGroupContainer.defaultProps = {
  sample: '',
  description: '',
  width: null,
  maxWidth: null,
  notRequiredLabel: null,
  variant: 'h5'
};

export default withStyles(styles)(ElementGroupContainer);
