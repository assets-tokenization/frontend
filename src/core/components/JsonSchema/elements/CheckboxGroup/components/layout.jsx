import React, { Fragment } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import renderHTML from 'helpers/renderHTML';

import { Checkbox, FormGroup, FormControlLabel } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import ElementContainer from 'components/JsonSchema/components/ElementContainer';

const styles = (theme) => ({
  labelSize: {
    position: 'relative',
    paddingLeft: 45,
    marginBottom: 10,
    [theme.breakpoints.down('md')]: {
      paddingLeft: 40,
      marginLeft: -15
    },
    '& span': {
      fontSize: 20,
      lineHeight: '24px',
      letterSpacing: '-0.02em',
      [theme.breakpoints.down('md')]: {
        fontSize: 13,
        lineHeight: '18px'
      }
    }
  },
  fontSize14: { '& span': { fontSize: 14 } },
  fontSize15: { '& span': { fontSize: 15 } },
  fontSize16: { '& span': { fontSize: 16 } },
  fontSize18: { '& span': { fontSize: 18 } },
  fontSize19: { '& span': { fontSize: 19 } },
  distance: {
    marginTop: 10,
    maxWidth: 1000
  },
  blockItem: {
    paddingBottom: 20
  },
  sampleComponent: {
    marginLeft: 25,
    fontWeight: 300,
    padding: '0 0 20px 0'
  },
  disabledItem: {
    marginLeft: 25,
    fontWeight: 300,
    padding: '0 0 20px 0'
  },
  checkboxRoot: {
    position: 'absolute',
    top: -8,
    left: 0,
    [theme.breakpoints.down('md')]: {
      top: -11
    }
  },
  checkbox: {
    width: 24,
    height: 24,
    [theme.breakpoints.down('md')]: {
      width: 20,
      height: 20,
      top: 2,
      position: 'relative'
    }
  },
  topMargin: {
    marginTop: 10
  },
  disabled: {
    opacity: 0.38,
    '&>span': {
      opacity: 0.38
    }
  },
  secondaryLabel: {
    paddingLeft: 0,
    margin: 0,
    paddingBottom: 0,
    [theme.breakpoints.down('md')]: {
      paddingLeft: 25
    },
    '& span': {
      fontSize: 16,
      left: -9,
      [theme.breakpoints.down('md')]: {
        fontSize: 13,
        top: -2,
        padding: 0,
        left: 0
      }
    }
  },
  secondaryWrapp: {
    position: 'relative',
    margin: 0,
    left: -3
  },
  hidden: {
    display: 'none'
  }
});

const CheckboxLayout = ({
  sample,
  description,
  required,
  classes,
  readOnly,
  items,
  rowDirection,
  error,
  path,
  width,
  maxWidth,
  propertyName,
  checkedKeys,
  isDisabled,
  handleChange,
  getSample,
  secondary,
  position,
  activePosition,
  errors,
  noMargin,
  listenError,
  indexInfoHeight,
  bottomSample,
  withIndex,
  errorTextHeight,
  hiddenParent,
  addHeight,
  fontSize,
  isHidden
}) => {
  const positionFix = secondary
    ? addHeight({
        activePosition,
        indexInfoHeight,
        listenError,
        errors,
        withIndex,
        errorTextHeight,
        position,
        isChecked: checkedKeys.length > 0,
        hiddenParent
      })
    : null;

  return (
    <ElementContainer
      sample={sample}
      description={description}
      required={Array.isArray(required) ? required.includes(propertyName) : required}
      error={error}
      width={width}
      maxWidth={maxWidth}
      className={secondary ? classes.secondaryWrapp : null}
      position={positionFix}
      noMargin={noMargin}
      bottomSample={bottomSample}
    >
      <FormGroup row={rowDirection}>
        {items.map((key) => (
          <Fragment key={key.id}>
            <FormControlLabel
              className={classNames({
                [classes.labelSize]: true,
                [classes.secondaryLabel]: secondary,
                [classes.distance]: !rowDirection,
                [classes['fontSize' + fontSize]]: fontSize,
                [classes.blockItem]:
                  (!checkedKeys.includes(key.id) && !rowDirection) ||
                  (checkedKeys.includes(key.id) && !rowDirection && !key.sample && !key.getSample),
                [classes.hidden]: isHidden(key)
              })}
              key={key.id}
              disabled={isDisabled(key) || readOnly}
              control={
                <Checkbox
                  id={path.join('-')}
                  checked={checkedKeys.includes(key.id)}
                  onChange={handleChange(key.id)}
                  disableRipple={secondary}
                />
              }
              label={renderHTML(key.title)}
            />
            {((!rowDirection && checkedKeys.includes(key.id)) || isDisabled(key)) &&
            getSample(key) ? (
              <div
                className={classNames({
                  [classes.sampleComponent]: true,
                  [classes.disabledItem]: isDisabled(key)
                })}
              >
                {renderHTML(getSample(key) || '')}
              </div>
            ) : null}
          </Fragment>
        ))}
      </FormGroup>
    </ElementContainer>
  );
};

CheckboxLayout.propTypes = {
  isDisabled: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  getSample: PropTypes.func.isRequired,
  sample: PropTypes.string,
  description: PropTypes.string,
  required: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  readOnly: PropTypes.bool,
  items: PropTypes.array.isRequired,
  rowDirection: PropTypes.bool.isRequired,
  error: PropTypes.array,
  path: PropTypes.array.isRequired,
  width: PropTypes.string,
  maxWidth: PropTypes.string,
  propertyName: PropTypes.string,
  checkedKeys: PropTypes.array.isRequired,
  secondary: PropTypes.bool,
  position: PropTypes.object,
  activePosition: PropTypes.object,
  fontSize: PropTypes.number,
  indexInfoHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  bottomSample: PropTypes.bool,
  errors: PropTypes.array,
  listenError: PropTypes.array,
  withIndex: PropTypes.bool,
  hiddenParent: PropTypes.bool,
  errorTextHeight: PropTypes.number,
  addHeight: PropTypes.func.isRequired
};

CheckboxLayout.defaultProps = {
  description: null,
  sample: null,
  required: false,
  readOnly: false,
  error: null,
  width: null,
  maxWidth: null,
  propertyName: null,
  secondary: false,
  fontSize: null,
  errors: [],
  withIndex: true,
  hiddenParent: false,
  listenError: ['.building', '.index'],
  indexInfoHeight: {
    lg: 38,
    md: 38,
    xs: 38
  },
  position: {
    top: {
      lg: -80,
      md: -134,
      xs: -65
    }
  },
  activePosition: {
    top: {
      lg: -122,
      md: -213,
      xs: -144
    }
  },
  errorTextHeight: {
    lg: 41,
    md: 20,
    xs: 20
  },
  bottomSample: false
};

const styled = withStyles(styles)(CheckboxLayout);
export default styled;
