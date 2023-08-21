/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-translate';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import objectPath from 'object-path';
import {
  getPaymentInfo,
  getPaymentStatus,
  confirmSmsCode,
  loadTask
} from 'application/actions/task';
import { addMessage } from 'actions/error';
import Message from 'components/Snackbars/Message';
import PaymentLayout from 'components/JsonSchema/elements/Payment/layout';
import QrLayout from 'components/JsonSchema/elements/Payment/qrLayout';
import PhoneLayout from 'components/JsonSchema/elements/Payment/phoneLayout';

const awaitDelay = (delay) =>
  new Promise((fulfill) => {
    setTimeout(fulfill, delay);
  });

class Payment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentValue: 0,
      phone: '',
      code: '',
      paymentRequestData: null,
      loadingValue: false,
      loading: false,
      isSuccess: false,
      phoneExists: false,
      codeNotValid: false,
      phoneNotValid: false,
      timeout: null,
      inited: false
    };
  }

  onChangePhone = (value) => this.setState({ phone: value });

  onChangeCode = (value) => this.setState({ code: value });

  paymentAction = () => {
    const { paymentRequestData } = this.state;

    if (!paymentRequestData) return;

    window.location.href = paymentRequestData.url;
  };

  checkPaymentStatus = async () => {
    const {
      importActions,
      rootDocument: { id }
    } = this.props;

    this.setState({ loading: true });

    const result = await importActions.getPaymentStatus(id);

    result && (await this.parseResult(result));

    this.setState({ loading: false });

    const { isSuccess } = this.state;

    !isSuccess && importActions.addMessage(new Message('PendingPaymentStatus', 'warning'));
  };

  parseResult = async (result) => {
    const { value, taskId, importActions, paymentControlPath } = this.props;

    if (!paymentControlPath) return;

    const dataPath = paymentControlPath.replace(/properties./g, '');

    const paymentInfo = objectPath.get(result.data, dataPath);

    if (!paymentInfo) return;

    const {
      processed,
      calculated: { amount, paymentRequestData }
    } = paymentInfo;

    const paymentValue = Array.isArray(amount)
      ? amount.reduce((sum, item) => sum + item.amount, 0)
      : amount;

    const isSuccess =
      (typeof processed !== 'undefined' && !!processed[processed.length - 1].status.isSuccess) ||
      false;

    const alreadyPassed =
      (typeof value.processed !== 'undefined' &&
        !!value.processed[value.processed.length - 1].status.isSuccess) ||
      false;

    isSuccess && !alreadyPassed && (await importActions.loadTask(taskId));

    isSuccess && importActions.addMessage(new Message('SuccessPaymentStatus', 'success'));

    this.setState({
      paymentValue: paymentValue && paymentValue.toFixed(2),
      paymentRequestData,
      isSuccess
    });
  };

  sendPhone = async () => {
    const { phone } = this.state;

    if (phone.length < 12) {
      this.setState({ phoneNotValid: true });
      return;
    }

    this.setState({ loading: true, phoneNotValid: false });

    const {
      importActions,
      rootDocument: { id },
      paymentControlPath
    } = this.props;

    const result = await importActions.getPaymentInfo(id, {
      paymentControlPath,
      extraData: { phone }
    });

    result && this.setState({ phoneExists: true });

    this.setState({ loading: false });
  };

  sendCode = async () => {
    const { code } = this.state;

    if (!code.length) {
      this.setState({ codeNotValid: true });
      return;
    }

    this.setState({
      loading: true,
      codeNotValid: false
    });

    const {
      importActions,
      rootDocument: { id },
      paymentControlPath
    } = this.props;

    const { isConfirmed } = await importActions.confirmSmsCode({
      paymentControlPath,
      documentId: id,
      code
    });

    if (!isConfirmed) {
      importActions.addMessage(new Message('PaymentCheckCode', 'warning'));
      this.setState({ loading: false });
      return;
    }

    await awaitDelay(500);

    const result = await importActions.getPaymentStatus(id);

    result && (await this.parseResult(result));

    this.setState({
      loading: false,
      isConfirmed
    });

    const { isSuccess } = this.state;

    !isSuccess && importActions.addMessage(new Message('PendingPaymentStatus', 'warning'));
  };

  resendCode = () => this.setState({ phoneExists: false });

  initPayment = async () => {
    const {
      importActions,
      rootDocument: { id },
      paymentControlPath,
      paymentType,
      taskId,
      withRedirect
    } = this.props;
    const { loadingValue } = this.state;

    if (loadingValue) return;

    this.setState({ loadingValue: true });

    if (paymentType === 'phone') {
      const result = await importActions.getPaymentStatus(id);
      result && (await this.parseResult(result));
    } else {
      if (withRedirect) {
        const result = await importActions.getPaymentStatus(id);
        result && (await this.parseResult(result));
      }

      const { isSuccess } = this.state;

      if (!isSuccess) {
        const res = await importActions.getPaymentInfo(id, {
          paymentControlPath
        });

        const failed = typeof res === 'undefined';

        this.setState({ failed });

        res && this.parseResult(res);
      }
    }

    await importActions.loadTask(taskId);

    this.setState({ loadingValue: false, inited: true });
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { hidden, paymentType } = this.props;
    const { paymentRequestData, loadingValue, failed } = this.state;

    clearTimeout(this.timeout);

    if (hidden || paymentRequestData || paymentType === 'phone') return;
    if (loadingValue && loadingValue === prevState.loadingValue) return;
    if (failed) return;

    this.timeout = setTimeout(() => this.initPayment(), 250);
  };

  componentDidMount = () => {
    const { hidden } = this.props;
    !hidden && this.initPayment();
  };

  render = () => {
    const { paymentType, hidden } = this.props;

    if (hidden) return null;

    const propperties = { ...this.props, ...this.state };

    if (paymentType === 'phone') {
      return (
        <PhoneLayout
          {...propperties}
          onChangePhone={this.onChangePhone}
          onChangeCode={this.onChangeCode}
          sendPhone={this.sendPhone}
          sendCode={this.sendCode}
          resendCode={this.resendCode}
          checkPaymentStatus={this.checkPaymentStatus}
        />
      );
    }

    if (paymentType === 'QR') {
      return <QrLayout {...propperties} checkPaymentStatus={this.checkPaymentStatus} />;
    }

    return <PaymentLayout {...propperties} paymentAction={this.paymentAction} />;
  };
}

Payment.propTypes = {
  importActions: PropTypes.object.isRequired,
  value: PropTypes.object,
  rootDocument: PropTypes.object.isRequired,
  paymentControlPath: PropTypes.string.isRequired,
  paymentType: PropTypes.string,
  hidden: PropTypes.bool,
  taskId: PropTypes.string.isRequired,
  withRedirect: PropTypes.bool
};

Payment.defaultProps = {
  paymentType: null,
  value: {},
  hidden: false,
  withRedirect: false
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  importActions: {
    getPaymentInfo: bindActionCreators(getPaymentInfo, dispatch),
    getPaymentStatus: bindActionCreators(getPaymentStatus, dispatch),
    addMessage: bindActionCreators(addMessage, dispatch),
    loadTask: bindActionCreators(loadTask, dispatch),
    confirmSmsCode: bindActionCreators(confirmSmsCode, dispatch)
  }
});

const translated = translate('Elements')(Payment);
export default connect(mapStateToProps, mapDispatchToProps)(translated);
