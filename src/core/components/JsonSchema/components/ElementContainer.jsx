import React from 'react';
import { translate } from 'react-translate';
import PropTypes from 'prop-types';
import renderHTML from 'helpers/renderHTML';

import classNames from 'classnames';
import { FormLabel, FormControl, FormHelperText } from '@mui/material';

import withStyles from '@mui/styles/withStyles';

import EJVError from './EJVError';
import FieldLabel from './FieldLabel';

const styles = (theme) => ({
  root: {
    display: 'block!important',
    marginBottom: 40,
    marginTop: 5,
    maxWidth: 640,
    [theme.breakpoints.down('lg')]: {
      marginBottom: 20
    },
    [theme.breakpoints.down('md')]: {
      marginBottom: 10
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 13
    }
  },
  noMargin: {
    margin: 0
  },
  sample: {
    color: 'rgba(0, 0, 0, 0.38)'
  },
  groupContainer: {
    position: 'relative',
    marginTop: 20,
    [theme.breakpoints.down('md')]: {
      marginBottom: 20
    }
  },
  outlined: {
    border: '1px solid rgba(224, 224, 224, 1)',
    padding: '0 20px'
  },
  errored: {
    borderColor: '#f44336',
    color: '#f44336'
  },
  sampleComponent: {
    whiteSpace: 'normal',
    fontSize: 11,
    marginLeft: 0,
    marginRight: 0
  },
  rowDisplay: {
    display: 'inline-block',
    width: '50%'
  },
  labelRoot: {
    '& legend': {
      opacity: 1,
      [theme.breakpoints.down('md')]: {
        fontSize: 13
      }
    }
  }
});

const getCoordinated = (position) => {
  const { innerWidth } = window;
  const { top, left } = position;
  if (innerWidth > 960) return { top: top && top.lg, left: left && left.lg };
  if (innerWidth > 600) return { top: top && top.md, left: left && left.md };
  if (innerWidth < 600) return { top: top && top.xs, left: left && left.xs };
  return {};
};

const ElementContainer = ({
  row,
  error,
  width,
  sample,
  classes,
  maxWidth,
  position,
  noMargin,
  children,
  required,
  className,
  bottomError,
  description,
  bottomSample,
  containerRef,
  notRequiredLabel,
  descriptionClassName
}) => {
  const sampleText = sample && typeof sample === 'string' ? renderHTML(sample) : sample;

  const sampleComponent =
    (error || sampleText) && !noMargin ? (
      <FormHelperText
        component="div"
        className={classNames({ [classes.sampleComponent]: !!error })}
      >
        {error && !bottomError ? <EJVError error={error} /> : sampleText}
      </FormHelperText>
    ) : null;

  return (
    <FormControl
      variant="standard"
      ref={containerRef}
      error={!!error}
      className={classNames(
        classes.root,
        {
          [classes.rowDisplay]: row,
          [classes.noMargin]: noMargin
        },
        className
      )}
      classes={{
        root: classes.labelRoot
      }}
      style={{
        width,
        maxWidth,
        ...(position ? getCoordinated(position) : {})
      }}
      row={row.toString()}
    >
      {description ? (
        <FormLabel component="legend" className={classNames(descriptionClassName)}>
          <FieldLabel
            description={description}
            required={required}
            notRequiredLabel={notRequiredLabel}
          />
        </FormLabel>
      ) : null}

      {!bottomSample && sampleComponent}

      {children}

      {bottomSample && sampleComponent}

      {error && bottomError && !noMargin ? (
        <FormHelperText error={!!error}>
          <EJVError error={error} />
        </FormHelperText>
      ) : null}
    </FormControl>
  );
};

ElementContainer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  classes: PropTypes.object.isRequired,
  sample: PropTypes.string,
  description: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  maxWidth: PropTypes.number,
  row: PropTypes.bool,
  bottomError: PropTypes.bool,
  position: PropTypes.object,
  notRequiredLabel: PropTypes.string
};

ElementContainer.defaultProps = {
  sample: '',
  description: '',
  width: null,
  maxWidth: null,
  row: false,
  bottomError: false,
  position: null,
  notRequiredLabel: null
};

const styled = withStyles(styles)(ElementContainer);
export default translate('Elements')(styled);
