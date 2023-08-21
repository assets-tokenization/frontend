/* eslint-disable react/jsx-no-duplicate-props */
import React from 'react';
import PropTypes from 'prop-types';
import objectPath from 'object-path';
import NumberFormat from 'react-number-format';
import { TextField } from '@mui/material';
import MobileDetect from 'mobile-detect';

import stringToNumber from 'helpers/stringToNumber';

import ElementContainer from '../components/ElementContainer';

const NumberFormatCustom = ({ ref, onChange, format, ...props }) => (
  <NumberFormat
    {...props}
    getInputRef={ref}
    format={format}
    onValueChange={(values) => {
      onChange({
        target: {
          value: values.value
        }
      });
    }}
    thousandSeparator={' '}
  />
);

class NumberElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: props.value };
  }

  canChange = () => {
    const { onChange, hidden, cleanWhenHidden, keepSelection } = this.props;
    return onChange && !(hidden && cleanWhenHidden && !keepSelection);
  };

  componentDidMount() {
    const { value, onChange, required } = this.props;

    if (required && value === null && onChange) {
      onChange(0);
    }
  }

  componentWillReceiveProps = ({ value: nextValue, toFixed }) => {
    const { value } = this.state;
    const parsedValue = stringToNumber(value);

    if (parsedValue !== nextValue) {
      this.setState({
        value: this.needPlaceHolder()
          ? ''
          : String(Number(nextValue).toFixed(toFixed)).replace(/ /g, '')
      });
    }
  };

  needPlaceHolder = () => {
    const { placeholder } = this.props;
    if (!placeholder) return false;
    return this.checkifValue() === undefined;
  };

  checkifValue = () => {
    const { rootDocument, stepName, path } = this.props;
    return objectPath.get(rootDocument.data || {}, [stepName].concat(path).join('.'));
  };

  handleChange = ({ target: { value } }) => {
    const { onChange, toFixed } = this.props;
    const { value: stateValue } = this.state;
    if (value === stateValue) return;
    this.setState({ value: value.replace(/ /g, '') }, () => {
      this.canChange() && onChange(parseFloat(stringToNumber(value).toFixed(toFixed)));
    });
  };

  handleBlur = () => {
    const { value, toFixed, onBlur } = this.props;
    this.setState(
      {
        value: String(Number(value).toFixed(toFixed))
      },
      onBlur
    );
  };

  handleFocus = () => {
    const { value } = this.state;
    const { toFixed } = this.props;
    if (value === Number().toFixed(toFixed)) {
      this.setState({ value: '' });
    }
  };

  handleKeyPress = (event) => {
    const inputValue = event.which;
    if (!(inputValue >= 46 && inputValue <= 57) && inputValue !== 44) {
      event.preventDefault();
    }
  };

  placeholder = () => {
    const { toFixed, value } = this.props;
    return !value ? String(Number(0).toFixed(toFixed)) : '0';
  };

  replaceMaskToFormat = (mask) => {
    if (!mask) return null;
    return mask.replace(/9/g, '#');
  };

  render = () => {
    const {
      sample,
      path,
      description,
      required,
      width,
      maxWidth,
      error,
      readOnly,
      hidden,
      noMargin,
      checkRequired,
      mask,
      schema,
      widthMobile
    } = this.props;
    const { value } = this.state;

    if (hidden) return null;

    const id = (path || []).join('-');
    const md = new MobileDetect(window.navigator.userAgent);
    const isMobile = !!md.mobile();
    const formWidth = isMobile && widthMobile ? widthMobile : width;

    return (
      <ElementContainer
        sample={sample || schema.sample}
        description={description}
        required={required || checkRequired}
        error={error}
        bottomSample={true}
        width={formWidth}
        maxWidth={maxWidth}
        noMargin={noMargin}
      >
        <TextField
          {...this.props}
          id={id}
          path={path}
          type="text"
          fullWidth={true}
          value={value}
          placeholder={this.placeholder()}
          onKeyPress={this.handleKeyPress}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          disabled={readOnly}
          InputProps={{
            readOnly,
            inputComponent: NumberFormatCustom
          }}
          inputProps={{
            format: this.replaceMaskToFormat(mask),
            'aria-labelledby': id
          }}
          variant={'standard'}
        />
      </ElementContainer>
    );
  };
}

NumberElement.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onChange: PropTypes.func,
  required: PropTypes.bool,
  toFixed: PropTypes.number,
  placeholder: PropTypes.bool,
  rootDocument: PropTypes.object,
  stepName: PropTypes.string,
  path: PropTypes.array,
  mask: PropTypes.string,
  widthMobile: PropTypes.string
};

NumberElement.defaultProps = {
  value: null,
  onChange: () => null,
  required: false,
  toFixed: 0,
  placeholder: false,
  rootDocument: {},
  stepName: '',
  path: [],
  mask: null,
  widthMobile: null
};

export default NumberElement;
