import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-translate';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  FormControl,
  TextField,
  Button
} from '@mui/material';

import withStyles from '@mui/styles/withStyles';

import StringElement from 'components/JsonSchema/elements/StringElement';
import { bindActionCreators } from 'redux';
import { sendSMSCode, checkPhoneExists, verifySMSCode } from 'actions/auth';

import promiseChain from 'helpers/promiseChain';
import { connect } from 'react-redux';

const customInputStyle = {
  formControl: {
    paddingBottom: '10px',
    margin: '27px 0 0 0',
    position: 'relative',
    maxWidth: 700,
    display: 'flex',
    ['@media (max-width:500px)']: {
      // eslint-disable-line no-useless-computed-key
      '& label': {
        fontSize: '0.75rem'
      }
    }
  },
  dialog: {
    '& > :last-child': {
      ['@media (max-width:767px)']: {
        // eslint-disable-line no-useless-computed-key
        fontSize: '.7rem'
      }
    },
    ['@media (max-width:425px)']: {
      // eslint-disable-line no-useless-computed-key
      margin: 0,
      '& > div > div': {
        margin: 15
      }
    }
  },
  dialogContentWrappers: {
    ['@media (max-width:767px)']: {
      // eslint-disable-line no-useless-computed-key
      padding: '24px 15px 20px',
      '& tr': {
        margin: '3px 0'
      }
    }
  }
};

class PhoneEditModal extends React.Component {
  state = { codeSended: false, phone: '', code: '', error: null };

  onChangeCode = ({ target }) => this.setState({ code: target.value, error: null });

  onChangePhone = (value) => this.setState({ phone: value, error: null });

  onClose = () => {
    const { onClose } = this.props;
    onClose();
    this.setState({ codeSended: false, phone: '', code: '', error: null });
  };

  sendSMSCode = () => {
    const { t, actions } = this.props;
    const { phone } = this.state;
    return (
      phone &&
      promiseChain([
        () => actions.checkPhoneExists(phone),
        ({ isExist }) =>
          isExist ? Promise.reject(new Error(t('PhoneAlreadyExists'))) : Promise.resolve(),
        () => this.setState({ codeSended: true, error: null }),
        () => actions.sendSMSCode(phone)
      ]).catch((error) => this.setState({ error }))
    );
  };

  verifySMSCode = () => {
    const { onChange, t, actions } = this.props;
    const { code, phone } = this.state;
    promiseChain([
      () => actions.verifySMSCode(phone, code),
      ({ isConfirmed }) => {
        if (!isConfirmed) {
          throw new Error(t('ValidationFalse'));
        }
        onChange(phone);
        this.onClose();
      }
    ]).catch((error) => this.setState({ error }));
  };

  submitWithoutConfirm = () => {
    const { phone } = this.state;
    const { onChange } = this.props;
    onChange(phone);
    this.onClose();
  };

  renderContent() {
    const { t, classes, phoneWithoutConfirm = false } = this.props;
    const { code, phone, error, codeSended } = this.state;
    if (codeSended) {
      return (
        <Fragment>
          <DialogContentText id="wait-text">{t('TextWaitForSMSCode')}</DialogContentText>

          <FormControl
            variant="standard"
            fullWidth={true}
            className={classes.formControl}
            margin="dense"
            id="wrap"
          >
            <TextField
              variant="standard"
              placeholder={t('CodeInputLabel')}
              value={code}
              helperText={error && error.message}
              error={!!error}
              onChange={this.onChangeCode}
              id="input"
            />
          </FormControl>
          <Button
            onClick={this.verifySMSCode}
            variant="contained"
            color="primary"
            disabled={!!error || !code}
            autoFocus={true}
            id="verify-button"
          >
            {t('VerifyCode')}
          </Button>
          <div id="resend-link-wrap">
            <Button
              style={{ cursor: 'pointer', color: '#0059aa' }}
              onClick={this.sendSMSCode}
              id="resend-link"
              href=""
            >
              {t('ResendSMS')}
            </Button>
          </div>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <DialogContentText id="text">
          {phoneWithoutConfirm ? '' : t('PhoneDialogText')}
        </DialogContentText>
        <FormControl
          variant="standard"
          fullWidth={true}
          className={classes.formControl}
          margin="dense"
          id="input-wrap"
        >
          <StringElement
            description={
              phoneWithoutConfirm ? t('PhoneInputLabelWithoutSMS') : t('PhoneInputLabel')
            }
            value={phone}
            error={error}
            required={phoneWithoutConfirm}
            onChange={this.onChangePhone}
            mask="380999999999"
            id="input"
          />
        </FormControl>
        <Button
          onClick={phoneWithoutConfirm ? this.submitWithoutConfirm : this.sendSMSCode}
          variant="contained"
          color="primary"
          disabled={!!error || !phone || phone.length < 12}
          autoFocus={true}
          id="send-button"
        >
          {phoneWithoutConfirm ? t('VerifyCode') : t('SendSMS')}
        </Button>
      </Fragment>
    );
  }

  render() {
    const { t, open, classes } = this.props;

    return (
      <Dialog
        open={open}
        onClose={this.onClose}
        aria-labelledby="title"
        aria-describedby="content"
        className={classes.dialog}
      >
        <DialogTitle id="title" className={classes.dialogContentWrappers}>
          {t('PhoneDialogTitle')}
        </DialogTitle>
        <DialogContent id="content" className={classes.dialogContentWrappers}>
          {this.renderContent()}
        </DialogContent>
      </Dialog>
    );
  }
}

PhoneEditModal.propTypes = {
  t: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired
};

const translated = translate('UserProfile')(PhoneEditModal);
const styled = withStyles(customInputStyle)(translated);

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  actions: {
    sendSMSCode: bindActionCreators(sendSMSCode, dispatch),
    checkPhoneExists: bindActionCreators(checkPhoneExists, dispatch),
    verifySMSCode: bindActionCreators(verifySMSCode, dispatch)
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(styled);
