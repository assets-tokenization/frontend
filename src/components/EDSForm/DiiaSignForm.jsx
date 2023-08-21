import React from 'react';
import useDiiaSign from 'services/diiaSign/useDiiaSign';
import storage from 'helpers/storage';
import isCyrillic from 'helpers/isCyrillic';
import config from 'config';
import DiiaSignFormLayout from 'components/EDSForm/components/DiiaSignFormLayout';

const { diiaSignUrl } = config;
const reinitTimer = 180;

const DiiaSignForm = ({ t, onSignHash, getDataToSign, onClose, task, template }) => {
  const [signingError, setSigningError] = React.useState();
  const [showErrorDialog, setShowErroDialog] = React.useState(false);
  const [preparing, setPreparing] = React.useState(true);
  const [processing, setProcessing] = React.useState(false);
  const [timer, setTimer] = React.useState(0);

  const { error, loading, finished, deepLink, setDataToSign, retry, setError, setFinished } =
    useDiiaSign({
      url: diiaSignUrl,
      token: storage.getItem('token'),
      handleSign: async (signs) => {
        try {
          setProcessing(true);
          await onSignHash(signs, { type: 'diia-qr' });
          setProcessing(false);
        } catch (error) {
          setSigningError(isCyrillic(error.message) ? error.message : t(error.message));
          setShowErroDialog(true);
          setError(error);
          setFinished(false);
          setProcessing(false);
        }
      }
    });

  const updateData = React.useCallback(async () => {
    try {
      setTimer(0);
      setPreparing(true);
      setDataToSign(await getDataToSign());
      setPreparing(false);
    } catch (error) {
      setTimer(0);
      setSigningError(
        error.details || (isCyrillic(error.message) ? error.message : t(error.message))
      );
      setShowErroDialog(true);
      setError(error);
      setFinished(false);
      setProcessing(false);
    }
  }, [t, setDataToSign, getDataToSign, setError, setFinished]);

  React.useEffect(() => {
    if (!getDataToSign) {
      return;
    }
    updateData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const timerListener = setTimeout(() => {
      setTimer(timer + 1);
    }, 1000);

    if (timer >= reinitTimer) {
      if (!(deepLink && !processing && !loading && !error && !preparing)) {
        return;
      }
      clearTimeout(timerListener);
    }

    return () => clearTimeout(timerListener);
  }, [timer, deepLink, processing, loading, error, preparing]);

  return (
    <DiiaSignFormLayout
      timer={timer}
      reinitTimer={reinitTimer}
      error={error}
      retry={retry}
      loading={loading}
      onClose={onClose}
      deepLink={deepLink}
      finished={finished}
      preparing={preparing}
      processing={processing}
      updateData={updateData}
      signingError={signingError}
      showErrorDialog={showErrorDialog}
      setShowErroDialog={setShowErroDialog}
      task={task}
      template={template}
    />
  );
};

export default DiiaSignForm;
