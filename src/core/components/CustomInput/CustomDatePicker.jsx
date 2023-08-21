/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { IconButton, TextField } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { translate } from 'react-translate';
import setComponentsId from 'helpers/setComponentsId';
import { today, filterFormat } from 'helpers/humanDateFormat';
import ClearIcon from '@mui/icons-material/Clear';
import moment from 'moment';
import 'moment/locale/uk';

moment.locale('uk');

const defaultFormat = 'DD.MM.YYYY';
const defaultMinDate = moment('01.01.1900', defaultFormat);

const styles = (theme) => ({
  dateContainer: {
    marginTop: 0,
    '& > label': {
      fontSize: 16,
      lineHeight: '18px',
      [theme.breakpoints.down('md')]: {
        fontSize: 13
      }
    }
  },
  deleteIconBtn: {
    width: 30,
    height: 30
  },
  dateContainerWrapperDark: {
    width: '100%'
  },
  darkThemeRoot: {
    padding: 17,
    ...theme.listBackground
  },
  dateContainerDark: {
    margin: 0
  },
  darkThemeLabel: {
    width: '100%',
    background: theme?.header?.background,
    borderRadius: '4px 4px 0px 0px',
    '& fieldset': {
      borderRadius: '4px 4px 0px 0px',
      borderColor: 'transparent',
      '& span': {
        display: 'none'
      }
    }
  },
  underlineThemeLabel: {
    paddingLeft: 7
  },
  errorIcon: {
    '& svg': {
      fill: '#f44336'
    }
  }
});

class CustomDatePicker extends Component {
  constructor(props) {
    super(props);

    const { date, incomingFormat, error, minDate, maxDate } = props;

    this.state = {
      date: date ? moment(date, incomingFormat) : today(),
      dateText: date ? this.getIncomingDate(date) : '',
      error: error || '',
      minDate: minDate ? this.getIncomingDate(minDate) : defaultMinDate.format(defaultFormat),
      maxDate: maxDate ? this.getIncomingDate(maxDate) : null,
      open: false
    };
  }

  getIncomingDate = (date) => {
    const { incomingFormat } = this.props;
    return moment(date, incomingFormat).format(defaultFormat);
  };

  onChange = (date) => {
    const { onChange, incomingFormat } = this.props;
    const dateText = date ? date.format(defaultFormat) : '';
    const dateTextFormatted = date ? date.format(incomingFormat) : '';

    this.setState(
      {
        date,
        dateText
      },
      () => onChange(dateTextFormatted)
    );
  };

  handleDelete = () => {
    const { onChange } = this.props;

    this.setState(
      {
        dateText: ''
      },
      () => onChange('')
    );
  };

  validateDate = (value, update) => {
    const { t, onChange, required } = this.props;
    const { minDate, maxDate } = this.state;
    const isValid = moment(value, defaultFormat, true).isValid();

    let error = '';

    if ((required && !isValid) || (!required && value && !isValid)) {
      error = t('FormatError');
    } else if (isValid) {
      if (moment(value, defaultFormat).toDate() < moment(minDate, defaultFormat).toDate()) {
        error = t('MinDateError', { date: minDate });
      } else if (moment(value, defaultFormat).toDate() > moment(maxDate, defaultFormat).toDate()) {
        error = t('MaxDateError', { date: maxDate });
      } else if (update) {
        this.onChange(moment(value, defaultFormat));
      }
    }

    if (!value.length && update) {
      onChange(value);
    }

    this.setState({
      dateText: value,
      error
    });
  };

  onInputChange = ({ target: { value } }) => this.validateDate(value, true);

  componentWillReceiveProps = (nextProps) => {
    const { date, minDate, maxDate, error, helperText, incomingFormat } = nextProps;

    this.setState({
      date: moment(date || new Date(), incomingFormat),
      minDate: minDate ? this.getIncomingDate(minDate) : defaultMinDate.format(defaultFormat),
      maxDate: maxDate ? this.getIncomingDate(maxDate) : null
    });

    if (date.length > 0) {
      this.validateDate(this.getIncomingDate(date));
    } else if (error) {
      this.setState({ error: typeof error === 'string' ? error : helperText });
    } else {
      this.setState({ dateText: '' });
    }
  };

  checkLabelDate = () => {
    const { t } = this.props;
    const { date } = this.state;

    if (moment(date).format(defaultFormat) === moment().format(defaultFormat)) {
      return t('ChooseLabelData');
    }

    return t('LabelData', {
      date: moment(date).format(defaultFormat)
    });
  };

  handleClosePicker = () => this.setState({ open: false });

  handleOpenPicker = () => this.setState({ open: true });

  renderInput = (params) => {
    const { classes, darkTheme, t, error } = this.props;
    const { dateText } = this.state;

    return (
      <TextField
        {...params}
        variant={darkTheme ? 'outlined' : 'standard'}
        onClick={this.handleOpenPicker}
        classes={{
          root: classNames({
            [classes.focuses]: darkTheme
          })
        }}
        inputProps={{
          ...params.inputProps,
          placeholder: ''
        }}
        error={!!error}
        {...(dateText && dateText.length
          ? {
              InputProps: {
                endAdornment: (
                  <IconButton
                    onClick={this.handleDelete}
                    className={classNames({
                      [classes.deleteIconBtn]: true
                    })}
                    aria-label={t('ClearInputBtn')}
                    tabIndex="0"
                    size="large"
                  >
                    <ClearIcon />
                  </IconButton>
                )
              }
            }
          : {})}
      />
    );
  };

  render = () => {
    const {
      t,
      classes,
      label,
      id,
      helperText,
      margin,
      fullWidth,
      darkTheme,
      disableToolbar,
      setId,
      value,
      error: errorProps
    } = this.props;

    const { date, dateText, error, minDate, maxDate, open } = this.state;

    const pickerId = setId ? setId(`date-picker ${id}`) : setComponentsId('date-picker')(` ${id} `);

    const dateLimits = {};

    if (minDate) {
      dateLimits.minDate = moment(minDate, defaultFormat);
    }

    if (maxDate) {
      dateLimits.maxDate = moment(maxDate, defaultFormat);
    }

    return (
      <div
        className={classNames({
          [classes.dateContainerWrapperDark]: darkTheme
        })}
      >
        <DesktopDatePicker
          {...dateLimits}
          open={open}
          className={classNames({
            [classes.dateContainer]: true,
            [classes.darkThemeLabel]: darkTheme,
            [classes.dateContainerDark]: darkTheme,
            [classes.errorIcon]: !!errorProps
          })}
          fullWidth={fullWidth}
          label={label || t('Label')}
          margin={margin}
          format={defaultFormat}
          cancelLabel={t('Cancel')}
          helperText={typeof error === 'string' && !!error ? error : helperText}
          onChange={this.onChange}
          value={value ? date : null}
          error={!!error}
          keyboard={true}
          autoOk={true}
          disableToolbar={disableToolbar}
          id={pickerId}
          InputProps={{
            value: dateText,
            onChange: this.onInputChange,
            classes: {
              underline: classNames({
                [classes.underlineThemeLabel]: darkTheme
              })
            }
          }}
          // eslint-disable-next-line react/jsx-no-duplicate-props
          inputProps={{
            readOnly: true,
            tabindex: '0',
            role: 'button',
            'aria-label': this.checkLabelDate()
          }}
          leftArrowButtonProps={{
            'aria-label': t('BtnPrevMonth')
          }}
          rightArrowButtonProps={{
            'aria-label': t('BtnNextMonth')
          }}
          disableMaskedInput={true}
          disableHighlightToday={true}
          renderInput={this.renderInput}
          onClose={this.handleClosePicker}
        />
      </div>
    );
  };
}

CustomDatePicker.propTypes = {
  setId: PropTypes.func,
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  date: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  incomingFormat: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  label: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  helperText: PropTypes.string,
  minDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string, PropTypes.object]),
  maxDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string, PropTypes.object]),
  margin: PropTypes.string,
  required: PropTypes.bool,
  fullWidth: PropTypes.bool,
  darkTheme: PropTypes.bool,
  disableToolbar: PropTypes.bool
};

CustomDatePicker.defaultProps = {
  setId: undefined,
  date: '',
  incomingFormat: filterFormat,
  id: '',
  label: '',
  error: '',
  helperText: '',
  minDate: '',
  maxDate: '',
  margin: 'normal',
  required: true,
  fullWidth: true,
  darkTheme: false,
  disableToolbar: false
};

const styled = withStyles(styles)(CustomDatePicker);

export default translate('DatePicker')(styled);
