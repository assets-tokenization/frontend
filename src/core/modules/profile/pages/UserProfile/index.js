/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate } from 'react-translate';
import withStyles from '@mui/styles/withStyles';
import LeftSidebarLayout, { Content } from 'layouts/LeftSidebar';

import ModulePage from 'components/ModulePage';
import Preloader from 'components/Preloader';

import promiseChain from 'helpers/promiseChain';

import { updateUserInfo, requestUserInfo, requestAuthMode } from 'actions/auth';

import ProfileLayout from 'modules/profile/pages/UserProfile/components/ProfileLayout';

const customInputStyle = {
    formControl: {
        paddingBottom: '10px',
        margin: '27px 0 0 0',
        position: 'relative',
        maxWidth: 700,
        display: 'flex',
        '&:empty': {
            display: 'none'
        },
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

class UserProfile extends ModulePage {
    state = {
        values: null,
        saving: false
    };

    componentDidMount() {
        super.componentDidMount();
        const { actions } = this.props;
        this.setState({ values: this.props.auth.info || {} });
        actions.requestAuthMode();
    }

    toggleExpanded = panel => () => {
        let { expanded } = this.state;
        if (expanded === panel) {
            expanded = panel === 1 ? 0 : 1;
        } else {
            expanded = panel;
        }
        this.setState({ expanded });
    };

    handleSave = async () => {
        const { actions } = this.props;
        this.setState({ saving: true });

        await actions.updateUserInfo(this.state.values);
        await actions.requestUserInfo();

        this.setState({
            saving: false,
            showNotification: true
        }, () => setTimeout(() => this.setState({ showNotification: false }), 1000));
    };

    handleChange = ({ target }) => {
        const { values } = this.state;
        this.setState({ values: { ...values, [target.name]: target.value } });
    };

    checkboxChange = ({ target: { checked, name } }) => {
        const { values } = this.state;
        this.setState({ values: { ...values, [name]: checked } });
    };

    handleChangePhone = phone => promiseChain([
        requestUserInfo,
        () => new Promise(resolve => this.setState({ values: { ...this.state.values, phone } }, resolve))
    ]);

    handleChangeDate = key => (date) => {
        const { values } = this.state;
        this.setState({ values: { ...values, [key]: date } });
    };

    render() {
        const { t, title, loading, location } = this.props;
        const { values } = this.state;

        return (
            <LeftSidebarLayout location={location} title={t(title)} loading={loading}>
                {!values ? <Preloader /> : null}
                {values ? (
                    <Content>
                        <ProfileLayout
                            {...this.props}
                            {...this.state}
                            checkboxChange={this.checkboxChange}
                            handleChange={this.handleChange}
                            handleChangePhone={this.handleChangePhone}
                            handleChangeDate={this.handleChangeDate}
                            handleSave={this.handleSave}
                        />
                    </Content>
                ) : null}
            </LeftSidebarLayout>
        );
    }
}

UserProfile.propTypes = {
    auth: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired
};

const styled = withStyles(customInputStyle)(UserProfile);
const translated = translate('UserProfile')(styled);

function mapStateToProps(state) {
    return { auth: state.auth };
}

const mapDispatchToProps = dispatch => ({
    actions: {
        updateUserInfo: bindActionCreators(updateUserInfo, dispatch),
        requestUserInfo: bindActionCreators(requestUserInfo, dispatch),
        requestAuthMode: bindActionCreators(requestAuthMode, dispatch)
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(translated);
