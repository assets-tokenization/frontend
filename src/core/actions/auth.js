import * as api from 'services/api';
import store from 'store';
import config from 'config.json';
import objectPath from 'object-path';
import qs from 'qs';
import * as Sentry from '@sentry/browser';
import storage from 'helpers/storage';
import getCookie from 'helpers/getCookie';
import setCookie from 'helpers/setCookie';
import deleteCookie from 'helpers/deleteCookie';

import generatePassword from 'password-generator';

export const REQUEST_UNITS = 'REQUEST_UNITS';
export const REQUEST_UNIT_INFO = 'REQUEST_UNIT_INFO';
export const REQUEST_USER_INFO = 'REQUEST_USER_INFO';
export const REQUEST_AUTH = 'REQUEST_AUTH';
export const TOKEN_ERROR = 'TOKEN_ERROR';
export const AUTH_SET_TOKEN = 'AUTH_SET_TOKEN';
export const UPDATE_USER_INFO = 'UPDATE_USER_INFO';
export const SEARCH_USER = 'SEARCH_USER';

const REQUEST_USER_SUGGESTIONS = 'REQUEST_USER_SUGGESTIONS';
const REQUEST_AUTH_MODE = 'REQUEST_AUTH_MODE';

const SEND_SMS_CODE = 'SEND_SMS_CODE';
const CHECK_PHONE_EXISTS = 'CHECK_PHONE_EXISTS';
const VERIFY_SMS_CODE = 'VERIFY_SMS_CODE';
const SEND_EMAIL_CODE = 'SEND_EMAIL_CODE';
const CHECK_EMAIL = 'CHECK_EMAIL';
const VERIFY_EMAIL_CODE = 'VERIFY_EMAIL_CODE';

const TOGGLE_DEBUG_MODE = 'TOGGLE_DEBUG_MODE';

const AUTH_URL = 'auth';
const USERS_URL = 'users';

const { backendUrl } = config;
const LOGOUT_LINK = backendUrl + '/redirect/logout';

export const logout = (redirect = false) => {
    storage.removeItem('token');
    storage.removeItem('debug-user-id');
    storage.removeItem('code');
    storage.removeItem('residentData');
    storage.removeItem('enabled_mocks');
    storage.setItem('backUrl', window.location.pathname + (window.location.search || ''));
    deleteCookie('lang');

    let signature = storage.getItem('cabState');

    if (!signature) {
        const signa = generatePassword(20, false);
        storage.setItem('cabState', signa);
        signature = storage.getItem('cabState');
    }

    if (redirect) {
        window.location.href = LOGOUT_LINK + `/?state=${signature}`;
        return { type: 'LOGOUT_DEEP' };
    }

    return { type: 'LOGOUT' };
};

export const isLoggedInCompletely = () => {
    const { auth } = store.getState() || {};
    return !!storage.getItem('token') && auth && auth.token && auth.info;
};

export const getToken = () => storage.getItem('token');

export const getQueryLangParam = () => {
    const searchString = window.location.search;
    const chosenLanguage = getCookie('lang');

    if (chosenLanguage) return chosenLanguage;

    if (!searchString) return null;

    const params = qs.parse(window.location.search, { ignoreQueryPrefix: true });

    const langExists = (Object.keys(params || {}) || []).includes('lang');

    if (!langExists) return null;

    if (langExists) {
        setCookie('lang', params.lang, 1);
        return params.lang;
    }

    deleteCookie('lang');

    return null;
};

export const requestUserInfo = () => (dispatch) => {
    if (!storage.getItem('token')) {
        throw new Error('401 unauthorized');
    }

    const lang = getQueryLangParam();

    const queryString = lang ? '?lang=eng' : '';
    
    return api
        .get(`${AUTH_URL}/me${queryString}`, REQUEST_USER_INFO, dispatch)
        .then((auth) => {
            Sentry.configureScope((scope) => {
                scope.setUser(auth);
                scope.setExtra('userCert', objectPath.get(auth, 'services.eds.data.pem'));
            });
            return auth;
        });
}

export const requestUnits = () => dispatch => api
    .get('units', REQUEST_UNITS, dispatch)
    .catch((error) => {
        Sentry.captureException(error);
        return error;
    });

export const requestAllUnits = () => dispatch => api
    .get('units/all', REQUEST_UNITS, dispatch)
    .catch((error) => {
        Sentry.captureException(error);
        return error;
    });

export const requestTestCode = () => () => {
    const { testAuth, testAuth: { body, url } } = config;
    const headers = new Headers(testAuth.headers);

    return fetch(url, { method: 'POST', mode: 'cors', headers, body: JSON.stringify(body) })
        .then(async (response) => {
            const result = await response.json();
            const { data: { code } } = result;
            return code;
        });
};

export const loginByCode = (code, state) => dispatch => api
    .post(`${AUTH_URL}/login`, { code, state }, REQUEST_AUTH, dispatch)
    .catch((error) => {
        Sentry.captureException(error);
        return error;
    });

export const requestAuth = (code, state) => async (dispatch) => {
    const existedToken = storage.getItem('token');

    if (!code && !existedToken) {
        //  return logout(true);
        throw new Error('401 unauthorized');
    }

    if (code && state) {
        storage.removeItem('debug-user-id');
        const loginResult = await loginByCode(code, state)(dispatch);

        if (loginResult instanceof Error || !loginResult || !loginResult.token) {
            storage.removeItem('token');
            dispatch({ type: TOKEN_ERROR, payload: true });
            return loginResult;
        }

        const { token } = loginResult;
        storage.setItem('token', token);
        dispatch({ type: AUTH_SET_TOKEN, payload: token });
    }

    if (!storage.getItem('token')) {
        throw new Error('401 unauthorized');
    }

    return requestUserInfo()(dispatch);
};

export const updateUserInfo = userInfo => (dispatch) => {
    return api.put(USERS_URL, userInfo, UPDATE_USER_INFO, dispatch);
};

export const isLoggedIn = () => !!storage.getItem('token');

export const isRole = (check) => {
    const { auth: { info } } = store.getState() || {};
    if (!info) {
        return false;
    }
    const { courtIdUserScopes } = info;
    return courtIdUserScopes.includes(check);
};

export const getUserSuggestions = searchString => (dispatch) => {
    return api.post(`${USERS_URL}/search`, { searchString }, REQUEST_USER_SUGGESTIONS, dispatch).then(result => result.users);
};

export const requestAuthMode = () => (dispatch) => {
    return api.get(`${USERS_URL}/two_factor_auth`, REQUEST_AUTH_MODE, dispatch);
};

export const checkPhoneExists = phone => dispatch => api
    .get(`${USERS_URL}/phone/already_used?phone=${phone}`, CHECK_PHONE_EXISTS, dispatch)
    .catch((error) => {
        // dispatch(addError(new Error('FailSendingSMS')));
        Sentry.captureException(error);
        return error;
    });

export const setAuthMode = mode => (dispatch) => {
    return api.post(`${USERS_URL}/two_factor_auth`, mode, REQUEST_AUTH_MODE, dispatch);
};

export const sendSMSCode = phone => dispatch => api
    .post(`${USERS_URL}/phone/send_sms_for_phone_verification`, { phone }, SEND_SMS_CODE, dispatch)
    .catch((error) => {
        // dispatch(addError(new Error('FailSendingSMS')));
        Sentry.captureException(error);
        return error;
    });

export const verifySMSCode = (phone, code) => dispatch => api
    .post(`${USERS_URL}/phone/verify`, { phone, code }, VERIFY_SMS_CODE, dispatch)
    .catch((error) => {
        // dispatch(addError(new Error('FailVerifyingSMS')));
        Sentry.captureException(error);
        return error;
    });

export const sendEmailCode = email => dispatch => api
    .put(`${USERS_URL}/email/change`, { email }, SEND_EMAIL_CODE, dispatch)
    .catch((error) => {
        // dispatch(addError(new Error('FailSendingEmail')));
        Sentry.captureException(error);
        return error;
    });

export const checkEmail = email => dispatch => api
    .post(`${USERS_URL}/email/check`, { email }, CHECK_EMAIL, dispatch)
    .catch((error) => {
        // dispatch(addError(new Error('FailSendingEmail')));
        Sentry.captureException(error);
        return error;
    });

export const verifyEmailCode = (email, code) => dispatch => api
    .post(`${USERS_URL}/email/confirm`, { email, code }, VERIFY_EMAIL_CODE, dispatch)
    .catch((error) => {
        // dispatch(addError(new Error('FailVerifyingEmail')));
        Sentry.captureException(error);
        return error;
    });

export const onlyVerifyEmailCode = (email, code) => dispatch => api
    .post(`${USERS_URL}/email/check_email_confirmation_code`, { email, code }, VERIFY_EMAIL_CODE, dispatch)
    .catch((error) => {
        // dispatch(addError(new Error('FailVerifyingEmail')));
        Sentry.captureException(error);
        return error;
    });

export const searchUser = data => (dispatch) => {
    return api.post(`${USERS_URL}/search`, data, SEARCH_USER, dispatch);
};

export const toggleDebugMode = () => ({
    type: TOGGLE_DEBUG_MODE
});
