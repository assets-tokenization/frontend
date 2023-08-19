/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import InputMask from 'react-input-mask';

const Masked = ({ ref, maxLength, ...props }) => (
  <InputMask {...props} maskChar={null} inputRef={ref} />
);

Masked.propTypes = {
  ref: PropTypes.node,
};

Masked.defaultProps = {
  ref: undefined,
};

export default Masked;
