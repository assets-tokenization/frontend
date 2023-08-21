import React from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import jwtDecode from 'jwt-decode';
import queryString from 'query-string';
import { translate } from 'react-translate';
import moment from 'moment';
import LoginScreen from 'components/Auth/LoginScreen';
import BlockScreen from 'components/BlockScreen';

import config from 'config.json';
import { history } from 'store';

import { ping } from 'actions/app';

import {
  requestAuth,
  requestUnits,
  requestUserInfo,
  requestTestCode,
  requestAllUnits
} from 'actions/auth';
import storage from 'helpers/storage';
import checkAccess from 'helpers/checkAccess';
import processList from 'services/processList';

import { access, initActions as appInitActions } from 'application';
import ServiceMessage from 'components/Auth/ServiceMessage';

import checkExpiringDate from 'helpers/checkExpiringDate';
import edsService from 'services/eds';
import { addMessage } from 'actions/error';
import Message from 'components/Snackbars/Message';

const { application, nullUnitIds = [] } = config;

class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  onFocus = () => {
    const {
      auth: { info }
    } = this.props;
    const token = storage.getItem('token');

    if (!token || !info) return;

    try {
      const { userId } = jwtDecode(token);

      if (info.userId !== userId) {
        window.location.reload();
      }
    } catch {
      // eslint-disable-next-line no-console
      console.warn('invalid token =>', token);
    }
  };

  init = async () => {
    const { error } = this.state;
    const {
      actions,
      initActions,
      auth: { units, info: userInfo }
    } = this.props;
    const { code, testToken, state } = queryString.parse(window.location.search);
    const signature = storage.getItem('cabState');
    const finalState = state && state !== null && state === signature ? state : null;

    if (testToken) storage.setItem('token', testToken);

    if (userInfo || error) return;

    let auth;

    try {
      auth = await actions.requestAuth(code, finalState);
      storage.removeItem('cabState');
    } catch (e) {
      this.setState({ error: e });
      return;
    }

    if (!auth || auth instanceof Error) {
      return;
    }

    if (!units && (!application.type || ['manager', 'adminpanel'].includes(application.type))) {
      const request = ['manager'].includes(application.type)
        ? await actions.requestUnits()
        : await actions.requestAllUnits();
      if (request instanceof Error) {
        this.setState({ error: request });
        return;
      }
    }

    Object.keys(initActions).forEach((initAction) => {
      const {
        auth: { userUnits }
      } = this.props;
      const getCountsMethod = ['getMyUnreadTaskCount', 'getUnitUnreadTaskCount'];
      const hasMyTaskNoAccess = userUnits.every(
        (unit) => !unit.menuConfig?.navigation?.tasks?.InboxTasks
      );
      const hasUnitNoAccess = userUnits.every(
        (unit) => !unit.menuConfig?.navigation?.tasks?.UnitInboxTasks
      );
      if ((hasMyTaskNoAccess || hasUnitNoAccess) && getCountsMethod.includes(initAction)) {
        return;
      }
      processList.hasOrSet(initAction, initActions[initAction]);
    });

    const backUrl = storage.getItem('backUrl');

    const { onboardingTaskId } = auth;

    this.checkCertificateExpiring(auth);

    if (backUrl && !onboardingTaskId) {
      storage.removeItem('backUrl');
      history.replace(backUrl);
    }
  };

  isInited = () => {
    const {
      auth: { info, userUnits }
    } = this.props;

    if (!application.type || ['manager', 'adminpanel'].includes(application.type)) {
      return !!(info && userUnits);
    }

    return !!info;
  };

  checkCertificateExpiring = async (auth) => {
    const { actions, t } = this.props;

    const certificate = auth?.services?.eds?.data?.pem;

    if (!certificate) return;

    const signer = edsService.getSigner();

    const certInfo = await signer.execute('ParseCertificate', certificate);

    const expiring = checkExpiringDate(certInfo);

    if (!expiring) return;

    actions.addMessage(
      new Message(
        expiring === '0'
          ? t('UserCertificateExpiringDay')
          : t('UserCertificateExpiring', {
              days: moment().add(expiring, 'days').fromNow()
            }),
        'permanentWarning',
        false,
        false,
        () => {
          try {
            const { certBeginTime } = certInfo;
            const expiringDates = localStorage.getItem('checkExpiringDate');

            const expiringDatesUpdate = JSON.parse(expiringDates || '[]');

            expiringDatesUpdate.push(new Date(certBeginTime).getTime());

            localStorage.setItem('checkExpiringDate', JSON.stringify(expiringDatesUpdate));
          } catch {}
        }
      )
    );
  };

  componentDidMount = async () => {
    const { actions } = this.props;

    if (!config.application.type) {
      this.setState({ error: new Error('ApplicationTypeNotDefined') });
      return;
    }

    try {
      const pingResult = await actions.ping();
      const { message, processPid } = pingResult;

      if (message !== 'pong' || !processPid) {
        throw Error();
      }

      processList.set('init', this.init);
      window.addEventListener('focus', this.onFocus);
    } catch (e) {
      this.setState({ error: new Error('ConnectionFailed') });
    }
  };

  componentDidUpdate = () => {
    processList.hasOrSet('init', this.init);
  };

  componentWillUnmount = () => {
    window.removeEventListener('focus', this.onFocus);
  };

  render = () => {
    const { error } = this.state;
    const {
      children,
      serviceMessage,
      auth: { info, userUnits }
    } = this.props;

    if (serviceMessage) {
      return <ServiceMessage error={serviceMessage} />;
    }

    if (error) {
      if (error.message === '403 forbidden') {
        return <ServiceMessage error={new Error('NoPermissionIp')} />;
      }

      if (error.message === '401 unauthorized') {
        return <LoginScreen />;
      }

      return <ServiceMessage error={error} />;
    }

    if (!this.isInited()) {
      return <BlockScreen open={true} transparentBackground={true} />;
    }

    if (info && access && !checkAccess(access, info, userUnits)) {
      return <ServiceMessage error={new Error('NoPermission')} />;
    }

    // const withoutBased = userUnits.filter(({ name }) => name !== 'based');
    if (userUnits.length === 1 && nullUnitIds.includes(userUnits[0].id)) {
      return <ServiceMessage canSwitchUser={true} error={new Error('NoUnitFound')} />;
    }

    return children;
  };
}

Auth.propTypes = {
  children: PropTypes.node,
  actions: PropTypes.object.isRequired,
  initActions: PropTypes.object,
  auth: PropTypes.object,
  serviceMessage: PropTypes.object
};

Auth.defaultProps = {
  children: null,
  auth: {},
  initActions: {},
  serviceMessage: null
};

const mapStateToProps = ({ auth, errors: { serviceMessage } }) => ({ auth, serviceMessage });
const mapDispatchToProps = (dispatch) => ({
  actions: {
    ping: bindActionCreators(ping, dispatch),
    requestAuth: bindActionCreators(requestAuth, dispatch),
    requestUnits: bindActionCreators(requestUnits, dispatch),
    requestUserInfo: bindActionCreators(requestUserInfo, dispatch),
    requestTestCode: bindActionCreators(requestTestCode, dispatch),
    requestAllUnits: bindActionCreators(requestAllUnits, dispatch),
    addMessage: bindActionCreators(addMessage, dispatch)
  },
  initActions: Object.keys(appInitActions).reduce(
    (acc, initAction) => ({
      ...acc,
      [initAction]: bindActionCreators(appInitActions[initAction], dispatch)
    }),
    {}
  )
});

const translated = translate('Errors')(Auth);
export default connect(mapStateToProps, mapDispatchToProps)(translated);
