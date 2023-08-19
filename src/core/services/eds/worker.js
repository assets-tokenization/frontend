import MobileDetect from 'mobile-detect';
import config from 'config';

import CACertificates from './CACertificates.p7b';

// eslint-disable-next-line no-undef
const md = new MobileDetect(navigator.userAgent);

/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
self.EU_MAX_DATA_SIZE_MB = md.mobile() ? 5 : 50;

importScripts('/js/iit/euscpt.js', '/js/iit/euscpm.js', '/js/iit/euscp.js');

// constants
const EDS_STORE_NAME = '/certificates';

const OCSP_RESPONSE_EXPIRE_TIME = 30;

const CA_DEFAULT_SERVER = 'acskidd.gov.ua';
const CA_DEFAULT_PORT = '80';

let sLoaded = false;
let inited = false;

/**
 * Service for working with electron digital signature (EDS)
 */
class Signer {
    constructor() {
        // eslint-disable-next-line no-undef
        this.signer = EUSignCP();
    }

    /**
     * Method for initializing EUSignCP module
     */
    async init(settings) {
        await this.signer.Initialize();
        await this.setDefaultSettings(settings);
        await this.loadCertsFromServer();
        inited = true;
    }

    async loadCertsFromServer() {
        const certificatesResponce = await fetch(config.eds.caCertsUrl || CACertificates);
        const certificateBuffer = await certificatesResponce.arrayBuffer();
        const certificates = new Uint8Array(certificateBuffer);
        this.signer.SaveCertificates(certificates);
    }

    /**
     * Method for setting default EUSign settings
     */
    setDefaultSettings(settings) {
        // set global settings
        this.signer.SetJavaStringCompliant(true);
        this.signer.SetCharset('UTF-8');
        this.signer.SetXMLHTTPProxyService(settings.edsServiceUrl);
        // this.signer.SetXMLHTTPDirectAccess(true);
        this.signer.SetOCSPResponseExpireTime(OCSP_RESPONSE_EXPIRE_TIME);

        // set file store settings
        const FileSettings = this.signer.CreateFileStoreSettings();
        FileSettings.SetPath(EDS_STORE_NAME);
        FileSettings.SetSaveLoadedCerts(true);
        this.signer.SetFileStoreSettings(FileSettings);

        // set proxy settings
        const proxySettings = this.signer.CreateProxySettings();

        Object.keys(settings.proxySettings).forEach((key) => {
            proxySettings[key] = settings.proxySettings[key];
        });

        this.signer.SetProxySettings(proxySettings);

        // set cmp settings
        const CMPSettings = this.signer.CreateCMPSettings();
        CMPSettings.SetUseCMP(true);
        this.signer.SetCMPSettings(CMPSettings);

        // set tsp settings
        const tspSettings = this.signer.CreateTSPSettings();
        this.signer.SetTSPSettings(tspSettings);

        // set osp settings
        const ocspSettings = this.signer.CreateOCSPSettings();
        ocspSettings.SetUseOCSP(true);
        ocspSettings.SetBeforeStore(true);
        ocspSettings.SetAddress('');
        ocspSettings.SetPort('80');
        this.signer.SetOCSPSettings(ocspSettings);

        // set ldap settings
        const ldapSettings = this.signer.CreateLDAPSettings();
        this.signer.SetLDAPSettings(ldapSettings);

        // set ocspa access settings
        const OCSPAccessSettings = this.signer.CreateOCSPAccessInfoModeSettings();
        OCSPAccessSettings.SetEnabled(true);
        this.signer.SetOCSPAccessInfoModeSettings(OCSPAccessSettings);

        const { cas = [] } = settings;
        for (let i = 0; i < cas.length; i++) {
            const ocspAccessInfoSettings = this.signer.CreateOCSPAccessInfoSettings();
            ocspAccessInfoSettings.SetAddress(cas[i].ocspAccessPointAddress);
            ocspAccessInfoSettings.SetPort(cas[i].ocspAccessPointPort);

            for (let j = 0; j < cas[i].issuerCNs.length; j++) {
                ocspAccessInfoSettings.SetIssuerCN(cas[i].issuerCNs[j]);
                this.signer.SetOCSPAccessInfoSettings(ocspAccessInfoSettings);
            }

            // this.signer.AddXMLHTTPDirectAccessAddress(cas[i].cmpAddress);
        }
        this.signer.SetRuntimeParameter(
            EU_SIGN_TYPE_PARAMETER,
            EU_SIGN_TYPE_CADES_X_LONG | EU_SIGN_TYPE_CADES_X_LONG_TRUSTED);

        this.signer.SetRuntimeParameter(
            EU_CHECK_CERT_CHAIN_ON_SIGN_TIME_PARAMETER,
            true);
    }

    SetProxySettings(settings) {
        const proxySettings = this.signer.CreateProxySettings();

        Object.keys(settings).forEach((key) => {
            proxySettings[key] = settings[key];
        });

        this.signer.SetProxySettings(proxySettings);
    }

    setServer(server) {
        const tspSettings = this.signer.CreateTSPSettings();
        tspSettings.SetGetStamps(true);
        if (server.tspAddress !== '') {
            tspSettings.SetAddress(server.tspAddress);
            tspSettings.SetPort(server.tspAddressPort);
        } else {
            tspSettings.SetAddress(CA_DEFAULT_SERVER);
            tspSettings.SetPort(CA_DEFAULT_PORT);
        }
        this.signer.SetTSPSettings(tspSettings);

        const ocspSettings = this.signer.CreateOCSPSettings();
        ocspSettings.SetUseOCSP(true);
        ocspSettings.SetBeforeStore(true);
        ocspSettings.SetAddress(server.ocspAccessPointAddress);
        ocspSettings.SetPort(server.ocspAccessPointPort);
        this.signer.SetOCSPSettings(ocspSettings);

        // set certificates server
        const cmpSettings = this.signer.CreateCMPSettings();
        cmpSettings.SetUseCMP(!!server.cmpAddress);
        cmpSettings.SetAddress(server.cmpAddress);
        cmpSettings.SetPort(CA_DEFAULT_PORT);
        this.signer.SetCMPSettings(cmpSettings);
    }
}

const signer = new Signer();

self.EUSignCPModuleInitialized = (isInitialized) => {
    sLoaded = isInitialized;
};

function send(data) {
    self.postMessage(data);
}

const stringToArray = bufferString => {
    if (typeof bufferString !== 'string') {
        return bufferString;
    }
    return new TextEncoder('utf-8').encode(bufferString);
};

function keyToUint8Array(input) {
    const keyLength = Object.values(input).length;
    const key = new Uint8Array(keyLength);
    for (let i = 0; i < keyLength; i++) {
        key[i] = input[i];
    }
    return key;
}

const actions = {
    init: settings => signer.init(settings),
    SetUseCMP: (useCMP) => {
        const CMPSettings = signer.signer.CreateCMPSettings();
        CMPSettings.SetUseCMP(useCMP);
        signer.signer.SetCMPSettings(CMPSettings);
    },
    setServer: server => signer.setServer(server),
    ReadPrivateKey: (key, password) => signer.signer.ReadPrivateKeyBinary(keyToUint8Array(key), password),
    Base64Encode: data => signer.signer.Base64Encode(keyToUint8Array(data)),
    GetSignerInfo: async (index, signature) => {
        const context = await signer.signer.CtxCreate();
        const signerInfo = await signer.signer.CtxGetSignerInfo(context, index, signature);
        await signer.signer.CtxFree();
        return signerInfo;
    },
    GetSigns: async signedData => {
        const context = await signer.signer.CtxCreate();
        await signer.signer.CtxSetParameter(context, EU_RESOLVE_OIDS_PARAMETER, false);
        const list = [];
        let source = null;

        const checkSignData = async (data) => {
            try {
                const signsCount = await signer.signer.CtxGetSignsCount(context, data);

                for (let index = 0; index < signsCount; index++) {
                    const signInfo = await signer.signer.CtxVerifyDataInternal(context, index, data);
                    list.push(signInfo);
                    source = signInfo.data;
                }

                await checkSignData(source);
            } catch (e) {
                console.log('error', e);
                // source = data;
            }
        };

        await checkSignData(signedData);

        return { source, list };
    },
    SignData: (data, internal = true) => {
        let dataToSign = data;

        if (typeof data === 'object') {
            dataToSign = keyToUint8Array(data);
        }

        if (internal) {
            return signer.signer.SignDataInternal(true, dataToSign, true);
        }

        return signer.signer.SignData(dataToSign, true);
    },
    SignHash: data => signer.signer.SignHash(data, true),
    // ResetPrivateKey: () => signer.signer.ResetPrivateKey(),
    ParseCertificate: cert => signer.signer.ParseCertificate(stringToArray(cert)),
    ParseCertificateEx: cert => signer.signer.ParseCertificateEx(stringToArray(cert)),
    EnumJKSPrivateKeys: (key, index) => signer.signer.EnumJKSPrivateKeys(keyToUint8Array(key), index),
    GetJKSPrivateKey: (key, index) => signer.signer.GetJKSPrivateKey(keyToUint8Array(key), index),
    SaveCertificate: cert => signer.signer.SaveCertificate(stringToArray(cert)),
    ProtectDataByPassword: (data, password, asBase64String) => signer.signer.ProtectDataByPassword(keyToUint8Array(data), password, asBase64String),
    SetProxySettings: settings => signer.SetProxySettings(settings),
    GetDataFromSignedFile: file => new Promise((resolve, reject) => {
        signer.signer.GetDataFromSignedFile(file, resolve, reject);
    }),
    HashToInternal: (signature, data) => {
        const context = signer.signer.CtxCreate();
        let newSign = signer.signer.CreateEmptySign(data, false);
        const signsCount = signer.signer.CtxGetSignsCount(context, signature);

        for (let index = 0; index < signsCount; index++) {
            const signerInfo = signer.signer.CtxGetSignerInfo(context, index, signature);
            const signerC = signer.signer.GetSigner(index, signature, false);
            newSign = signer.signer.CtxAppendSigner(context, 1, signerC, signerInfo.data, newSign, true);
        }

        return newSign;
    }
};

const onMessage = async function (e) {
    if (!sLoaded) {
        return setTimeout(() => onMessage(e), 100);
    }

    const { cmd, commandId, commandData } = e.data;

    if (cmd !== 'init' && !inited) {
        return setTimeout(() => onMessage(e), 100);
    }

    console.log('cmd', cmd, commandData);

    try {
        let data;
        if (cmd in actions) {
            data = await actions[cmd](...(commandData || []));
        } else {
            data = await signer.signer[cmd](...(commandData || []));
            console.log('data', data);
        }
        return send({ commandId, data });
    } catch (actionError) {
        return send({ commandId, error: actionError.message, data: { cmd } });
    }
};

self.addEventListener('message', onMessage, false);
