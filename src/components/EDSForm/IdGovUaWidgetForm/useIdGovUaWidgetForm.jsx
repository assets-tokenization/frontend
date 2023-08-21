/* eslint-disable no-unused-vars */
import React from 'react';
import uuid from 'uuid-random';
import config from 'config';
import DiiaWidgetHandler from './diiaWidgetHandler';

const { eds: { idGovUaWidget = {} } = {} } = config;

const useIdGovUaWidgetForm = ({ onSelectKey }) => {
  const [containerId] = React.useState(uuid());
  const [error, setError] = React.useState(null);
  const [inited, setInited] = React.useState(false);
  const [euSign, setEuSign] = React.useState(null);
  const [keyReaded, setKeyReaded] = React.useState(false);

  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = '/js/eusign.js';
    script.async = true;
    document.body.appendChild(script);

    const timer = setInterval(() => {
      if (window.EndUser) {
        clearInterval(timer);
        setInited(true);
      }
    }, 100);

    return () => {
      clearInterval(timer);
      document.body.removeChild(script);
    };
  }, []);

  React.useEffect(() => {
    if (inited) {
      console.log('inited', inited);
      setEuSign(
        new window.EndUser(containerId, `${containerId}-euSign`, idGovUaWidget.signWidgetUrl)
      );
    }
  }, [containerId, inited]);

  React.useEffect(() => {
    if (euSign) {
      euSign
        .ReadPrivateKey()
        .then((a) => {
          console.log('a', a);
          setKeyReaded(true);
          onSelectKey(a, new DiiaWidgetHandler(euSign));
        })
        .catch((e) => {
          setError(`Виникла помилка при зчитуванні ос. ключа. Опис помилки: ${e.message || e}`);
        });
    }
  });

  return {
    containerId,
    euSign
  };
};

export default useIdGovUaWidgetForm;
