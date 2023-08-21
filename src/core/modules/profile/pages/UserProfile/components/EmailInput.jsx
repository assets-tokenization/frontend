import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { translate } from 'react-translate';
import {
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  Button,
  InputAdornment,
  IconButton
} from '@mui/material';

import withStyles from '@mui/styles/withStyles';

import EditIcon from '@mui/icons-material/Edit';
import { bindActionCreators } from 'redux';
import { sendEmailCode, verifyEmailCode, checkEmail } from 'actions/auth';
import StringElement from 'components/JsonSchema/elements/StringElement';
import { EJVError } from 'components/JsonSchema';

const mailInspection =
  /[A-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-z0-9!#$%&'*+/=?^_`{|}~-]+)*@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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

class EmailInput extends React.Component {
  state = { showModal: false, codeSended: false, email: '', code: '', error: null };

  toggleModal = () =>
    this.setState({ showModal: !this.state.showModal, codeSended: false, error: null, code: '' });

  onChangeCode = ({ target: { value } }) =>
    this.setState({ code: value, error: this.state.code.length > 0 ? null : this.state.error });

  onChangeEmail = (value) => {
    const { t, value: propValue, actions } = this.props;
    const test = mailInspection.test(value);
    let error = test ? null : new Error(t('EmailError'));
    if (!error) {
      if (propValue === value) {
        this.setState({ email: value, error: new Error(t('NotChangeEmailError')) });
      } else {
        this.setState({ email: value }, async () => {
          const { isExist } = await actions.checkEmail(value);
          if (isExist) {
            error = new Error(t('DuplicateEmailError'));
          }
          this.setState({ error });
        });
      }
    } else {
      this.setState({ email: value, error });
    }
    return error;
  };

  sendEmailCode = () => {
    const { actions } = this.props;
    const { email } = this.state;
    const error = this.onChangeEmail(email);
    this.setState({ codeSended: true }, () => !error && actions.sendEmailCode(email));
  };

  moreSendEmail = () => {
    const { actions } = this.props;
    this.state.error
      ? this.setState({ codeSended: false, error: '' })
      : actions.sendEmailCode(this.state.email);
  };

  verifyEmailCode = async () => {
    const { t, onChange, actions } = this.props;
    const { code, email } = this.state;
    try {
      const result = await actions.verifyEmailCode(email, code);
      if (!result.isAccepted) {
        throw new Error(t('ValidationFalse'));
      }
      this.setState({ codeSended: false, email: '', code: '' });
      onChange({ target: { name: 'email', value: email } });
      this.toggleModal();
    } catch (e) {
      this.setState({ error: new Error(t('ValidationFalse')) });
    }
  };

  render() {
    const { showModal, codeSended, error, code, email } = this.state;
    const { t, value, classes } = this.props;
    const disabledButton = !!error || (codeSended ? !code : !email);

    return (
      <Fragment>
        <TextField
          variant="standard"
          id="input"
          disabled={true}
          name="email"
          label={t('EmailInputLabel')}
          value={value || ''}
          margin="dense"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={this.toggleModal} id={'edit-button'} size="large">
                  <EditIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <Dialog open={showModal} onClose={this.toggleModal} id="dialog" className={classes.dialog}>
          <DialogTitle id="dialog-title" className={classes.dialogContentWrappers}>
            {t('EmailDialogTitle')}
          </DialogTitle>
          <DialogContent id="dialog-content" className={classes.dialogContentWrappers}>
            <DialogContentText id="dialog-text">
              {codeSended ? t('TextWaitForCode') : t('EmailDialogText')}
            </DialogContentText>
            <FormControl
              variant="standard"
              fullWidth={true}
              className={classes.formControl}
              margin="dense"
              id="dialog-input-wrap"
            >
              {codeSended ? (
                <TextField
                  variant="standard"
                  placeholder={t('CodeInputLabel')}
                  value={code}
                  helperText={error ? <EJVError error={error} /> : null}
                  error={!!error}
                  onChange={this.onChangeCode}
                  id="dialog-code-input"
                />
              ) : null}
              {!codeSended ? (
                <StringElement
                  placeholder={t('EmailInputLabel')}
                  description={t('EmailInputLabel')}
                  value={email}
                  error={error}
                  maxLength={255}
                  onChange={this.onChangeEmail}
                  mask={mailInspection}
                  required={true}
                  id="dialog-email-input"
                />
              ) : null}
            </FormControl>
            <Button
              onClick={codeSended ? this.verifyEmailCode : this.sendEmailCode}
              variant="contained"
              color="primary"
              disabled={disabledButton}
              autoFocus={true}
              id="dialog-send-button"
            >
              {codeSended ? t('VerifyCode') : t('SendCode')}
            </Button>
            {codeSended ? (
              <div id="dialog-more-send-wrap">
                <Button
                  style={{ cursor: 'pointer', color: '#0059aa' }}
                  onClick={this.sendEmailCode}
                  id="dialog-more-send"
                >
                  {t('ResendCode')}
                </Button>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

EmailInput.propTypes = {
  t: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string
};

EmailInput.defaultProps = {
  value: ''
};

const styled = withStyles(customInputStyle)(EmailInput);
const translated = translate('UserProfile')(styled);

function mapStateToProps(state) {
  return { auth: state.auth };
}

const mapDispatchToProps = (dispatch) => ({
  actions: {
    sendEmailCode: bindActionCreators(sendEmailCode, dispatch),
    verifyEmailCode: bindActionCreators(verifyEmailCode, dispatch),
    checkEmail: bindActionCreators(checkEmail, dispatch)
  }
});

// decorate and export
export default connect(mapStateToProps, mapDispatchToProps)(translated);
