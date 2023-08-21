import React from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  FormControlLabel,
  TextField,
  Snackbar,
  Checkbox,
  Button
} from '@mui/material';
import CustomDatePicker from 'components/CustomInput/CustomDatePicker';
import PhoneInput from './PhoneInput';
import EmailInput from './EmailInput';
import getFields from 'modules/profile/pages/UserProfile/components/fields';

const fields = getFields({
  EmailInput,
  PhoneInput
});

const RenderControl =
  ({ t, classes, handleChangePhone, handleChangeDate, handleChange, checkboxChange, values }) =>
  ({ key, name, Component, changed, label, maxDate, disabled, helperText, maxLength }) => {
    if (key === 'isIndividualEntrepreneur') {
      return (
        <FormControlLabel
          key={key}
          control={
            <Checkbox checked={values[key]} onChange={checkboxChange} name={key} color="primary" />
          }
          label={t(label)}
        />
      );
    }

    return (
      <FormControl
        variant="standard"
        fullWidth={true}
        className={classes.formControl}
        margin="dense"
        key={key}
      >
        {Component && changed !== 'date' ? (
          <Component
            value={values[key]}
            onChange={changed === 'phone' && !disabled ? handleChangePhone : handleChange}
          />
        ) : null}
        {changed === 'date' ? (
          <CustomDatePicker
            label={t(label)}
            margin="dense"
            incomingFormat="DD/MM/YYYY"
            onChange={changed === 'date' && !disabled ? handleChangeDate(key) : handleChange}
            date={values[key] || ''}
            id="key"
            minDate="01/01/1900"
            maxDate={maxDate}
          />
        ) : null}
        {!changed ? (
          <TextField
            variant="standard"
            disabled={disabled}
            name={name || key}
            label={t(label)}
            value={values[key] || ''}
            onChange={disabled ? undefined : handleChange}
            margin="dense"
            id="name-key"
            inputProps={{ maxLength }}
            helperText={helperText ? t(helperText) : ''}
          />
        ) : null}
      </FormControl>
    );
  };

const ProfileLayout = ({
  t,
  classes,
  values,
  values: { isLegal },
  saving,
  showNotification,
  handleChange,
  handleChangePhone,
  handleChangeDate,
  handleSave,
  checkboxChange
}) => {
  const inputs = isLegal ? fields.isLegal : fields.notIsLegal;
  return (
    <>
      {inputs.map(
        RenderControl({
          t,
          classes,
          handleChangePhone,
          handleChangeDate,
          handleChange,
          checkboxChange,
          values
        })
      )}
      <Button
        variant="contained"
        color="primary"
        disabled={saving}
        onClick={handleSave}
        id="save-button"
      >
        {t('SaveButton')}
      </Button>
      <Snackbar
        id="error"
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={showNotification}
        message={<span id="message-id">{t('ProfileSaved')}</span>}
      />
    </>
  );
};

ProfileLayout.propTypes = {
  t: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  saving: PropTypes.bool.isRequired,

  showNotification: PropTypes.bool,
  handleChangePhone: PropTypes.func.isRequired,
  handleChangeDate: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  checkboxChange: PropTypes.func.isRequired
};

ProfileLayout.defaultProps = {
  showNotification: false
};

export default ProfileLayout;
