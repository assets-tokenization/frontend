import config from 'config.json';
import * as Sentry from '@sentry/browser';

import qs from 'qs';
import generatePassword from 'password-generator';
import { readAsUint8Array } from 'helpers/readFileList';
import storage from 'helpers/storage';

import { logout } from 'actions/auth';
import { showServiceMessage } from 'actions/error';

import objectProxy from './objectProxy';
import requestDataTypes from './requestDataTypes';

const { backendUrl = '', encryptedGateway } = config;

export const API_URL = backendUrl + (backendUrl.charAt(backendUrl.length - 1) !== '/' ? '/' : '');

const disabledDebugActions = ['REQUEST_USER_INFO', 'SEARCH_USERS'];

const getResponseBody = async (response, options) => {
  const contentType = response.headers.get('content-type');

  if (contentType.includes('application/json')) {
    if (options?.rawFile && response.status === 200) {
      const blob = await response.blob();
      return blob;
    }
    const json = await response.json();
    return objectProxy(json, { headers: response.headers });
  }

  if (contentType.includes('text/html')) {
    const text = await response.text();
    return text;
  }

  const blob = await response.blob();
  return blob;
};

// eslint-disable-next-line no-undef
const euSCClient = window.EUSCClient && new EUSCClient(encryptedGateway);

const st = storage.getItem('cabState');
async function createRequest(request, action, dispatch, payload, options) {
  if (!navigator.onLine) {
    // await new Promise(resolve => setTimeout(resolve, 1000));
    // return createRequest(request, action, dispatch, payload);
    dispatch(showServiceMessage(new Error('ConnectionFailed')));
    return;
  }

  const { url, ...conf } = request;
  const { method } = request;
  dispatch({ type: action, payload, body: request.body, url, method });

  const debugUserId = storage.getItem('debug-user-id');

  const requestData = {
    ...conf,
    cache: 'reload',
    headers: {
      ...conf.headers
      // token: storage.getItem('token')
    }
  };

  if (debugUserId && !disabledDebugActions.includes(action)) {
    requestData.headers['debug-user-id'] = debugUserId;
  }

  try {
    let response;
    if (encryptedGateway) {
      // eslint-disable-next-line no-undef
      const requestDataType =
        EUSCClient.DataType[
          (requestDataTypes[action] && requestDataTypes[action].request) || 'String'
        ];
      // eslint-disable-next-line no-undef
      const responseDataType =
        EUSCClient.DataType[
          (requestDataTypes[action] && requestDataTypes[action].response) || 'String'
        ];

      // eslint-disable-next-line no-undef
      const euRequest = new EUSCRequest(
        url,
        method.toUpperCase(),
        Object.keys(requestData.headers).map((header) =>
          [header, requestData.headers[header]].join(': ')
        ),
        requestDataType,
        request.body,
        responseDataType
      );

      try {
        response = await euSCClient.transmit(euRequest);
      } catch (e) {
        throw new Error(e.message);
      }

      const headersMap = new Map();

      response.headers.forEach((header) => {
        const [key, value] = header?.split(': ');
        headersMap.set(key, value);
      });

      response.headers = headersMap;

      response.json = () => JSON.parse(response.data);
      response.text = () => response.data;
      response.blob = () =>
        new Blob([response.data], {
          type: response.headers.get('content-type') || 'application/octet-stream'
        });

      dispatch({ type: action + '_DECRYPTED', payload, body: response.data, url, method });
    } else {
      response = await fetch(url, requestData);
    }

    if (!navigator.onLine) {
      dispatch(showServiceMessage(new Error('ConnectionFailed')));
    }

    const responseBody = await getResponseBody(response, options);

    const errors = [].concat(responseBody.error, responseBody.errors).filter(Boolean);

    if (response.status === 401) {
      if (!st) {
        const signa = generatePassword(20, false);
        storage.setItem('cabState', signa);
      }
      dispatch(logout());
      throw new Error('401 unauthorized');
    }

    if (response.status === 403) {
      const error = new Error('403 forbidden');
      error.details = responseBody?.error?.details;
      throw error;
    }

    if (response.status === 413) {
      throw new Error('413 Payload Too Large');
    }

    if (response.status === 404) {
      throw new Error('404 not found');
    }

    if (errors.length) {
      const errorMessage = errors.shift();
      const error = new Error(errorMessage.message || errorMessage.msg || errorMessage);
      error.details = errorMessage.details;
      error.response = responseBody;
      throw error;
    }

    const responseData =
      'data' in responseBody
        ? objectProxy(responseBody.data, { headers: response.headers })
        : responseBody;

    if (responseBody.meta || responseBody.pagination) {
      responseData.meta = responseBody.pagination || responseBody.meta;
    }

    dispatch({
      type: `${action}_SUCCESS`,
      payload: responseData,
      request: payload,
      url,
      method,
      body: request.body
    });
    return responseData;
  } catch (error) {
    if (error.message === 'Failed to fetch' && navigator.onLine) {
      dispatch(showServiceMessage(error));
    }

    if (error.message === 'User without needed role.' && navigator.onLine) {
      dispatch(showServiceMessage(error));
    }

    if (error.message === 'Declined by user access rules.' && navigator.onLine) {
      dispatch(showServiceMessage(error));
    }

    dispatch({
      type: `${action}_FAIL`,
      payload: error,
      url,
      method,
      body: request.body,
      request: payload
    });

    if (
      error.message !== '401 unauthorized' &&
      error.message !== '404 not found' &&
      error.message !== 'NetworkError when attempting to fetch resource.' &&
      error.message === 'Failed to fetch'
    ) {
      Sentry.withScope((scope) => {
        Object.keys(error).forEach((key) => scope.setExtra(key, error[key]));
        scope.setTag('service', 'api');
        scope.setTag('Message', error.message);
        scope.setExtra('url', url);
        scope.setExtra('method', method);
        scope.setExtra('body', request.body);
        scope.setExtra('response', error.response);
        Sentry.captureException(error);
      });
    }
    throw error;
  }
}

export function get(url, action, dispatch, payload, options = {}) {
  const request = {
    url: API_URL + url,
    method: 'get'
  };

  return createRequest(request, action, dispatch, payload, options);
}

export function post(url, body, action, dispatch, additional = {}, options = {}) {
  const { headers } = options;
  const request = {
    url: API_URL + url,
    method: 'post',
    headers: { 'Content-Type': 'application/json', ...(headers || {}) },
    body: JSON.stringify(body)
  };

  return createRequest(request, action, dispatch, { ...body, ...additional });
}

export async function upload(url, file, params, action, dispatch) {
  const queryString = qs.stringify(params, {
    arrayFormat: 'index',
    encode: false
  });

  const binary = await readAsUint8Array(file);

  const request = {
    url: API_URL + url + (queryString ? '?' + queryString : ''),
    method: 'post',
    headers: { 'Content-Type': file.type },
    body: binary
  };

  return createRequest(request, action, dispatch, binary);
}

export function put(url, body, action, dispatch, additional = {}, options = {}) {
  const { headers } = options;

  const request = {
    url: API_URL + url,
    method: 'put',
    headers: { 'Content-Type': 'application/json', ...(headers || {}) },
    body: JSON.stringify(body)
  };

  return createRequest(request, action, dispatch, { ...body, ...additional });
}

export function del(url, body, action, dispatch, payload) {
  const request = {
    url: API_URL + url,
    method: 'delete',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  };

  return createRequest(request, action, dispatch, payload);
}
