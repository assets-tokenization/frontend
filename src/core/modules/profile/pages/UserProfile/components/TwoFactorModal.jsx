import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-translate';
import { connect } from 'react-redux';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    FormControl,
    TextField,
    Button,
} from '@mui/material';

import withStyles from '@mui/styles/withStyles';

import { bindActionCreators } from 'redux';
import { sendSMSCode, verifySMSCode, setAuthMode } from 'actions/auth';
import promiseChain from 'helpers/promiseChain';

const customInputStyle = {
    formControl: {
        paddingBottom: '10px',
        margin: '27px 0 0 0',
        position: 'relative',
        maxWidth: 700,
        display: 'flex',
        ['@media (max-width:500px)']: { // eslint-disable-line no-useless-computed-key
            '& label': {
                fontSize: '0.75rem'
            }
        }
    },
    dialog: {
        '& > :last-child': {
            ['@media (max-width:767px)']: { // eslint-disable-line no-useless-computed-key
                fontSize: '.7rem'
            }
        },
        ['@media (max-width:425px)']: { // eslint-disable-line no-useless-computed-key
            margin: 0,
            '& > div > div': {
                margin: 15
            }
        }
    },
    dialogContentWrappers: {
        ['@media (max-width:767px)']: { // eslint-disable-line no-useless-computed-key
            padding: '24px 15px 20px',
            '& tr': {
                margin: '3px 0'
            }
        }
    }
};

class TwoFactorModal extends React.Component {
    state = { codeSended: false, code: '', error: null };

    onChangeCode = ({ target }) => this.setState({ code: target.value, error: null });

    onClose = () => {
        const { onClose } = this.props;
        onClose();
        this.setState({ codeSended: false, code: '', error: null });
    };

    sendSMSCode = () => {
        const { actions } = this.props;
        this.setState({ codeSended: true }, () => actions.sendSMSCode(this.props.phone));
    };

    verifySMSCode = () => {
        const { t, phone, actions } = this.props;
        const { code } = this.state;
        return promiseChain([
            () => actions.verifySMSCode(phone, code),
            ({ isConfirmed }) => {
                if (!isConfirmed) {
                    throw new Error(t('ValidationFalse'));
                }
            },
            () => actions.setAuthMode({ useTwoFactorAuth: true }),
            this.onClose
        ]).catch(error => this.setState({ error }));
    };

    renderContent() {
        const { t, classes, phone } = this.props;
        const { code, error, codeSended } = this.state;
        if (codeSended) {
            return (
                <Fragment>
                    <DialogContentText id="wait-text">
                        {t('TextWaitForSMSCode')}
                    </DialogContentText>

                    <FormControl
                        variant="standard"
                        fullWidth={true}
                        className={classes.formControl}
                        margin="dense"
                        id="wrap">
                        <TextField
                            variant="standard"
                            placeholder={t('CodeInputLabel')}
                            value={code}
                            helperText={error && error.message}
                            error={!!error}
                            onChange={this.onChangeCode}
                            id="input" />
                    </FormControl>
                    <Button
                        onClick={this.verifySMSCode}
                        variant="contained"
                        color="primary"
                        disabled={false}
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
                        >
                            {t('ResendSMS')}
                        </Button>
                    </div>
                </Fragment>
            );
        }

        return (
            <Fragment>
                <DialogContentText id="text">{t('TwoFactorAuthText')}</DialogContentText>
                <DialogContentText id="confirm-text">
                    {t('ConfirmText')}
                </DialogContentText>
                <DialogContentText
                    id="phone-text"
                    style={{ textAlign: 'center', fontSize: 24, color: '#000' }}
                >
                    +{phone}
                </DialogContentText>
                <Button
                    onClick={this.sendSMSCode}
                    variant="contained"
                    color="primary"
                    disabled={false}
                    autoFocus={true}
                    id="send-button"
                >
                    {t('SendSMS')}
                </Button>
            </Fragment>
        );
    }

    render() {
        const {
            t,
            open,
            classes
        } = this.props;

        return (
            <Dialog
                open={open}
                onClose={this.onClose}
                aria-labelledby="title"
                aria-describedby="content"
                className={classes.dialog}
            >
                <DialogTitle
                    id="title"
                    className={classes.dialogContentWrappers}
                >
                    {t('TwoFactorAuthTitle')}
                </DialogTitle>
                <DialogContent
                    id="content"
                    className={classes.dialogContentWrappers}
                >
                    {this.renderContent()}
                </DialogContent>
            </Dialog>
        );
    }
}

TwoFactorModal.propTypes = {
    t: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    phone: PropTypes.string
};

TwoFactorModal.defaultProps = {
    phone: ''
};

const translated = translate('UserProfile')(TwoFactorModal);
const styled = withStyles(customInputStyle)(translated);
const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
    actions: {
        sendSMSCode: bindActionCreators(sendSMSCode, dispatch),
        verifySMSCode: bindActionCreators(verifySMSCode, dispatch),
        setAuthMode: bindActionCreators(setAuthMode, dispatch)
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(styled);
