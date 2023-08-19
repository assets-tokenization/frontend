/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { translate } from 'react-translate';
import classNames from 'classnames';
import { IconButton } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import DatePicker from 'react-modern-calendar-datepicker';
import ClearIcon from '@mui/icons-material/ClearOutlined';
import awaitDelay from 'helpers/awaitDelay';
import equilPath from 'helpers/equilPath';

export const locale = (t) => ({
  months: [
    t('January'),
    t('February'),
    t('March'),
    t('April'),
    t('May'),
    t('June'),
    t('July'),
    t('August'),
    t('September'),
    t('October'),
    t('November'),
    t('December'),
  ],
  weekDays: [
    {
      name: t('Monday'),
      short: t('M'),
    },
    {
      name: t('Tuesday'),
      short: t('T'),
    },
    {
      name: t('Wednesday'),
      short: t('W'),
    },
    {
      name: t('Thursday'),
      short: t('Th'),
    },
    {
      name: t('Friday'),
      short: t('F'),
    },
    {
      name: t('Saturday'),
      short: t('St'),
      isWeekend: true,
    },
    {
      name: t('Sunday'),
      short: t('S'),
      isWeekend: true,
    },
  ],
  weekStartingIndex: 6,
  getToday(gregorainTodayObject) {
    return gregorainTodayObject;
  },
  toNativeDate(date) {
    return new Date(date.year, date.month - 1, date.day);
  },
  getMonthLength(date) {
    return new Date(date.year, date.month, 0).getDate();
  },
  transformDigit(digit) {
    return digit;
  },
  nextMonth: 'Next Month',
  previousMonth: 'Previous Month',
  openMonthSelector: 'Open Month Selector',
  openYearSelector: 'Open Year Selector',
  closeMonthSelector: 'Close Month Selector',
  closeYearSelector: 'Close Year Selector',
  defaultPlaceholder: 'Select...',
  from: t('from'),
  to: t('to'),
  digitSeparator: ',',
  yearLetterSkip: 0,
  isRtl: false,
});

const setDafaultValue = (value) => {
  if (!value) return null;

  const splitValue = value.split('.');

  return {
    day: Number(splitValue[0]),
    month: Number(splitValue[1]),
    year: Number(splitValue[2]),
  };
};

const styles = (theme) => ({
  label: {
    position: 'relative',
    cursor: 'pointer',
    height: '100%',
    display: 'inline-block',
    [theme.breakpoints.down('md')]: {
      display: 'block',
      marginTop: 15,
      marginBottom: 20,
    },
  },
  text: {
    display: 'block',
    cursor: 'pointer',
    height: 32,
    padding: '6px 0 1px',
    fontSize: 16,
    border: 'none',
    borderBottom: '2px solid #000',
    boxSizing: 'border-box',
    outline: 'none!important',
    fontFamily: 'e-Ukraine',
    fontWeight: 400,
    lineHeight: '1.1876em',
    letterSpacing: '-0.02em',
    [theme.breakpoints.down('md')]: {
      fontSize: 13,
    },
  },
  descriptionLabel: {
    display: 'block',
    width: '100%',
    opacity: 0.5,
    position: 'absolute',
    zIndex: 1000,
    '-webkit-transform': 'translate(0, 5px) scale(1)',
    '-moz-transform': 'translate(0, 5px) scale(1)',
    '-ms-transform': 'translate(0, 5px) scale(1)',
    transform: 'translate(0, 5px) scale(1)',
    overflow: 'hidden',
    maxWidth: '100%',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    transformOrigin: 'top left',
    transition: '.2s ease-in-out',
  },
  descriptionLabelFireFox: {
    display: 'block',
    width: '100%',
    opacity: 0.5,
    position: 'absolute',
    zIndex: 1000,
    overflow: 'hidden',
    maxWidth: '100%',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    transformOrigin: 'top left',
    transition: '.2s ease-in-out',
  },
  hasValue: {
    transform: 'translate(0, -12.5px) scale(0.75)',
    '-webkit-transform': 'translate(0, -12.5px) scale(0.75)',
    '-moz-transform': 'translate(0, -12.5px) scale(0.75)',
    '-ms-transform': 'translate(0, -12.5px) scale(0.75)',
  },
  hasValueFireFox: {
    '-webkit-transform': 'translate(0, -12.5px) scale(0.75)',
    '-moz-transform': 'translate(0, -12.5px) scale(0.75)',
    '-ms-transform': 'translate(0, -12.5px) scale(0.75)',
    transform: 'translate(0, -12.5px) scale(0.75)',
  },
  clearButton: {
    zIndex: 100
  },
});

const fillPeriod = ({ start, end, dateFormat }) => {
  let days = [];
  let day = start;

  while (day <= end) {
    days.push(day.toDate());
    day = day.clone().add(1, 'd');
  }

  const mappped = days.map((d) => moment(d).format(dateFormat));

  return mappped;
};

const parceDate = (date) => ({
  day: Number(date.format('DD')),
  month: Number(date.format('MM')),
  year: Number(date.format('YYYY')),
});

const ModernCalendar = ({
  t,
  description,
  value,
  minDate,
  maxDate,
  allowedDays,
  disabledDays,
  onChange,
  dateFormat,
  classes,
  calendarPopperPosition,
  triggerExternalPath,
  stepName,
  path,
  externalReaderMessage,
  width,
}) => {
  const [selected, setSelectedDay] = React.useState(setDafaultValue(value));
  const [mount, setMount] = React.useState(true);

  const isFirefox =
    (navigator?.userAgent || '').toLowerCase().indexOf('firefox') > -1;

  const handleChange = async (newValue) => {
    const date = `${newValue.day}.${newValue.month}.${newValue.year}`;
    const formatDate = moment(date, 'DD.MM.YYYY').format(dateFormat);

    setSelectedDay(newValue);

    if (isFirefox) {
      setMount(false);
      await awaitDelay(100);
      setMount(true);
    }

    await awaitDelay(100);
    onChange(formatDate);
  };

  const handleDelete = () => {
    onChange(null);
    setSelectedDay(null);
  };

  const setMinDate = () => {
    if (allowedDays && !minDate) {
      const firstElem = allowedDays[0];
      const start = moment(firstElem, dateFormat);
      return parceDate(start);
    }
    if (!minDate) return null;
    return parceDate(minDate);
  };

  const setMaxDate = () => {
    if (allowedDays && !maxDate) {
      const lastElem = allowedDays[allowedDays.length - 1];
      const end = moment(lastElem, dateFormat);
      return parceDate(end);
    }
    if (!maxDate) return null;
    return parceDate(maxDate);
  };

  const disabledDaysMapped = () => {
    if (allowedDays && minDate && maxDate) {
      const period = fillPeriod({
        start: minDate,
        end: maxDate,
        dateFormat,
      }).filter((el) => !allowedDays.includes(el));

      return period.map((item) => ({
        year: Number(moment(item, dateFormat).format('YYYY')),
        month: Number(moment(item, dateFormat).format('MM')),
        day: Number(moment(item, dateFormat).format('DD')),
      }));
    }

    if (disabledDays) {
      return disabledDays.map((item) => ({
        year: Number(moment(item, dateFormat).format('YYYY')),
        month: Number(moment(item, dateFormat).format('MM')),
        day: Number(moment(item, dateFormat).format('DD')),
      }));
    }

    return [];
  };

  if (!mount) return null;

  return (
    <>
      <table>
        <tbody>
          <tr>
            <td
              style={{
                position: 'relative',
                zIndex: '1101',
                width,
                display: 'flex',
                justifyContent: 'flex-start'
              }}
            >
              <label className={classes.label}>
                <span
                  className={classNames({
                    [classes.descriptionLabel]: !isFirefox,
                    [classes.descriptionLabelFireFox]: isFirefox,
                    [classes.hasValue]: selected && !isFirefox,
                    [classes.hasValueFireFox]: selected && isFirefox,
                  })}
                >
                  {description}
                </span>
                <DatePicker
                  calendarPopperPosition={calendarPopperPosition}
                  value={selected}
                  locale={locale(t)}
                  onChange={handleChange}
                  minimumDate={setMinDate()}
                  maximumDate={setMaxDate()}
                  disabledDays={disabledDaysMapped()}
                  renderInput={({ ref }) => (
                    <input
                      readOnly
                      ref={ref}
                      value={selected ? value : ''}
                      className={classNames({
                        [classes.text]: true,
                      })}
                    />
                  )}
                />
              </label>
              {selected ? (
                <IconButton
                  className={classes.clearButton}
                  onClick={handleDelete}
                  size="large"
                >
                  <ClearIcon />
                </IconButton>
              ) : null}
            </td>
          </tr>
        </tbody>
      </table>
      {equilPath(triggerExternalPath, [stepName].concat(path))
        ? externalReaderMessage
        : null}
    </>
  );
};

ModernCalendar.propTypes = {
  t: PropTypes.func.isRequired,
  description: PropTypes.string,
  value: PropTypes.string,
  allowedDays: PropTypes.string,
  disabledDays: PropTypes.string,
  minDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  maxDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  calendarPopperPosition: PropTypes.string,
  width: PropTypes.string,
};

ModernCalendar.defaultProps = {
  description: '',
  value: false,
  allowedDays: false,
  disabledDays: false,
  minDate: false,
  maxDate: false,
  calendarPopperPosition: 'auto',
  width: '225px',
};

const styled = withStyles(styles)(ModernCalendar);
export default translate('DatePicker')(styled);
