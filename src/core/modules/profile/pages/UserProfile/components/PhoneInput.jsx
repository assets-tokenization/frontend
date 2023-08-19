import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import config from 'config';
import { connect } from 'react-redux';
import { translate } from 'react-translate';
import { IconButton, InputAdornment } from '@mui/material';

import withStyles from '@mui/styles/withStyles';

import EditIcon from '@mui/icons-material/Edit';

import TextField from '@mui/material/TextField';
import { bindActionCreators } from 'redux';
import { requestAuthMode, setAuthMode } from 'actions/auth';

import PhoneEditModal from './PhoneEditModal';
import TwoFactorModal from './TwoFactorModal';

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

class PhoneInput extends React.Component {
    state = { showPhoneEditModal: false, showPhoneCheckModal: false };

    closePhoneEditModal = () => this.setState({ showPhoneEditModal: false });

    closePhoneCheckModal = () => {
        const { actions } = this.props;
        this.setState({ showPhoneCheckModal: false }, actions.requestAuthMode);
    };

    showPhoneEditModal = () => this.setState({ showPhoneEditModal: true });

    showPhoneCheckModal = () => this.setState({ showPhoneCheckModal: true });

    toggleAuthMode = () => {
        const { auth, actions } = this.props;
        const { useTwoFactorAuth } = auth;

        if (useTwoFactorAuth) {
            actions.setAuthMode({ useTwoFactorAuth: false }).then(actions.requestAuthMode);
        } else {
            this.showPhoneCheckModal();
        }
    };

    phoneInput = ({ t, value }) => {
        return (
            <TextField
                            variant="standard"
                            id="input"
                            disabled={true}
                            name="phone"
                            label={t('PhoneInputLabel')}
                            value={value || ''}
                            margin="dense"
                            InputProps={{
                                endAdornment:
                                    <InputAdornment position="end">
                                        <IconButton onClick={this.showPhoneEditModal} id={'edit-button'} size="large">
                                            <EditIcon />
                                        </IconButton>
                                    </InputAdornment>
                            }} />
        );
    }

    render() {
        const { showPhoneEditModal, showPhoneCheckModal } = this.state;
        const { t, value, onChange, auth } = this.props;
        const { useTwoFactorAuth } = auth;

        return (
            <Fragment>
                {config && config.showPhone ? (
                    <>
                        {this.phoneInput({ t, value })}
                        <span
                            style={{ cursor: "pointer", color: "#0059aa" }}
                            onClick={this.toggleAuthMode}
                            id={"two-factor-link"}
                        >
                            {useTwoFactorAuth
                            ? t("TwoFactorAuthDisable")
                            : t("TwoFactorAuthEnable")}
                        </span>    
                    </>
                ) : null}
                {config && config.showPhoneWithoutConfirm ? this.phoneInput({ t, value }) : null}
                <PhoneEditModal
                    open={showPhoneEditModal}
                    phoneWithoutConfirm={config && config.showPhoneWithoutConfirm}
                    onClose={this.closePhoneEditModal}
                    onChange={onChange}
                />
                <TwoFactorModal
                    phone={value}
                    open={showPhoneCheckModal}
                    onClose={this.closePhoneCheckModal}
                />
            </Fragment>
        );
    }
}

PhoneInput.propTypes = {
    t: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string
};

PhoneInput.defaultProps = {
    value: ''
};

const styled = withStyles(customInputStyle)(PhoneInput);
const translated = translate('UserProfile')(styled);

function mapStateToProps(state) {
    return { auth: state.auth };
}

const mapDispatchToProps = dispatch => ({
    actions: {
        requestAuthMode: bindActionCreators(requestAuthMode, dispatch),
        setAuthMode: bindActionCreators(setAuthMode, dispatch)
    }
});

// decorate and export
export default connect(mapStateToProps, mapDispatchToProps)(translated);
