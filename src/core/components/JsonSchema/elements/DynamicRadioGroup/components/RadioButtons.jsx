import React from 'react';
import PropTypes from 'prop-types';
import { Radio, RadioGroup, FormControlLabel } from '@mui/material';

const RadioButtons = ({
  value,
  rowDirection,
  path,
  getLabel,
  onChange,
  readOnly,
  list,
  getSample,
}) => (
  <RadioGroup row={rowDirection}>
    {(list || []).map((key, index) => {
      if (!key.id) return null;

      return (
        <>
          <FormControlLabel
            key={index}
            label={getLabel(key)}
            control={(
              <Radio
                id={path.concat(index).join('-')}
                checked={value.id === key.id}
                onChange={onChange(key)}
                disabled={readOnly}
              />
            )}
          />
          {getSample(key)}
        </>
      );
    })}
  </RadioGroup>
);

RadioButtons.propTypes = {
  onChange: PropTypes.func.isRequired,
  getLabel: PropTypes.func.isRequired,
  list: PropTypes.array.isRequired,
  value: PropTypes.object,
  path: PropTypes.array,
  rowDirection: PropTypes.bool,
  readOnly: PropTypes.bool,
  getSample: PropTypes.func,
};

RadioButtons.defaultProps = {
  value: null,
  path: [],
  rowDirection: false,
  readOnly: false,
  getSample: () => {},
};

export default RadioButtons;
