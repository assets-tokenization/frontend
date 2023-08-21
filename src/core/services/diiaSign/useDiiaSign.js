/* eslint-disable no-undef */
import React from 'react';
import uuid from 'uuid-random';
import querystring from 'querystring';
import { setWsHeartbeat } from 'ws-heartbeat/client';

import toHashes from './helpers/toHashes';

export default ({ handleSign, url, token, auth = false }) => {
  const ws = React.useRef();

  const [error, setError] = React.useState();
  const [sessionId, setSessionId] = React.useState(uuid());
  const [deepLink, setDeepLink] = React.useState();
  const [finished, setFinished] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState();

  const sendHashes = React.useCallback(async () => {
    if (!data) {
      return;
    }
    setLoading(true);
    const hashes = await Promise.all(data.map(toHashes));
    ws.current.send(JSON.stringify({ cmd: 'hashes', hashes, auth }));
  }, [data, auth]);

  const run = React.useCallback(() => {
    if (ws.current) {
      ws.current.close();
    }

    const query = querystring.stringify({ sessionId, token });

    try {
      ws.current = new WebSocket(`${url}?${query}`);

      setWsHeartbeat(ws.current, '{"kind":"ping"}', {
        pingTimeout: 30000,
        pingInterval: 10000
      });

      ws.current.onopen = sendHashes;
      ws.current.onerror = (event) => console.error('WebSocket error observed:', event);
      ws.current.onmessage = (e) => {
        const { cmd, ...data } = JSON.parse(e.data);
        switch (cmd) {
          case 'deeplink':
            setDeepLink(data.deeplink);
            setLoading(false);
            break;
          case 'signs':
            setFinished(true);
            handleSign(data.signs);
            break;
          case 'error':
            setError(data.error);
            break;
          default:
        }
      };
    } catch {
      setError(true);
    }

    return () => {
      ws.current.close();
    };
  }, [handleSign, sendHashes, sessionId, token, url]);

  const updateSessionId = React.useCallback(async () => {
    if (auth) {
      const [{ fileHash }] = await Promise.all(data.map(toHashes));
      setSessionId(fileHash);
      return;
    }
    setSessionId(uuid());
  }, [data, auth]);

  React.useEffect(() => {
    if (!data) {
      return;
    }

    updateSessionId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  React.useEffect(() => {
    setError();
    setDeepLink();
    setLoading(true);
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const retry = React.useCallback(async () => {
    updateSessionId();
  }, [updateSessionId]);

  return {
    error,
    finished,
    loading,
    deepLink,
    retry,
    setDataToSign: setData,
    setError,
    setFinished
  };
};
