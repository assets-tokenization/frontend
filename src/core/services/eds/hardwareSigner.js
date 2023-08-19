import promiseChain from 'helpers/promiseChain';

import config from 'config';
import store from 'store';

import EdsException from './EdsException';
import CAs from './CAs.json';
import testACSK from './CA-TEST.json';
import CACertificates from './CACertificates.p7b';

const CHARSET = 'UTF-8';
const CA_DEFAULT_SERVER = 'acskidd.gov.ua';
const CA_DEFAULT_PORT = '80';

const EDS_CLEAR_TYPES = 'eds/clearTypes';
const EDS_ADD_KM_TYPE = 'eds/addKmType';
const EDS_ADD_KM_DEVICE = 'eds/addKmDevice';
const EDS_LIBRARY_INIT_FAILED = 'eds/libraryInitFailed';
const EDS_INITED = 'eds/libraryInitSuccess';

const { TextDecoder, TextEncoder } = window;

const stringToArray = bufferString => new TextEncoder('utf-8').encode(bufferString);
const arrayToString = array => new TextDecoder('utf-8').decode(array);

/**
 * Service for working with electron digital signature (EDS)
 */

const { eds } = config;

class HardwareSigner {
    inited = false;

    proxySettings = {
        useProxy: false,
        anonymous: true,
        address: '',
        port: '3128',
        user: '',
        password: '',
        savePassword: false
    };

    actions = {
        setServer: (server, resolve, reject) => this.setServer(server).then(resolve).catch(reject),
        SetUseCMP: (useCMP, resolve, reject) => {
            const cmpSettings = this.signer.CreateCMPSettings();
            cmpSettings.SetUseCMP(useCMP);
            this.signer.SetCMPSettings(cmpSettings, resolve, reject);
        },
        ReadPrivateKey: (key, password, resolve, reject) => {
            this.signer.ReadPrivateKeyBinary(key, password, () => {
                this.signer.GetPrivateKeyOwnerInfo(resolve, reject);
            }, reject);
        },
        ReadHardwareKey: (type, device, password, resolve, reject) => {
            this.signer.ReadPrivateKeySilently(parseInt(type, 10), parseInt(device, 10), password, () => {
                this.signer.GetPrivateKeyOwnerInfo(resolve, reject);
            }, reject);
        },
        SignData: (data, internal = true, resolve, reject) => {
            if (internal) {
                this.signer.SignInternal(true, data, resolve, reject);
            } else {
                this.signer.Sign(data, resolve, reject);
            }
        },
        GetSigns: async (signedData, resolve) => {
            const list = [];
            let source = null;

            const checkSignData = async (data) => {
                const base64data = this.signer.BASE64Encode(data);
                try {
                    const signsCount = await this.execute('GetSignsCount', base64data);

                    for (let index = 0; index < signsCount; index++) {
                        const signInfo = await this.execute('VerifySpecificInternal', base64data, index);
                        list.push(signInfo);
                        await checkSignData(signInfo.data);
                    }
                } catch (e) {
                    source = data || source;
                }
            };

            await checkSignData(signedData);
            resolve({ source, list });
        },
        HashData: (data, resolve, reject) => this.signer.Hash(data, resolve, reject),
        VerifyDataInternal: (data, showSignerInfo = true, resolve, reject) => {
            this.signer.VerifyInternal(data, showSignerInfo, resolve, reject);
        },
        UnprotectDataByPassword: (data, password, resolve, reject) => {
            this.signer.UnprotectDataByPassword(data, password, unprotected => resolve(arrayToString(unprotected), unprotected), reject);
        },
        EnvelopDataToRecipientsWithDynamicKey: (recipientCerts, signData, appendCert, data, asBase64String, resolve, reject) => {
            this.signer.EnvelopToRecipientsWithDynamicKey(recipientCerts, signData, appendCert, data, resolve, reject);
        },
        ProtectDataByPassword: (data, password, resolve, reject) => {
            this.signer.ProtectDataByPassword(stringToArray(data), password, resolve, reject);
        },
        ParseCertificate: (cert, resolve, reject) => {
            if (typeof cert === 'string') {
                cert = stringToArray(cert);
            }
            this.signer.ParseCertificate(cert, resolve, reject);
        },
        SaveCertificate: (cert, resolve, reject) => {
            this.signer.SaveCertificate(stringToArray(cert), resolve, reject);
        },
        ParseCertificateEx: (cert, resolve, reject) => {
            this.signer.ParseCertificateEx(stringToArray(cert), resolve, reject);
        },
        DevelopData: (data, resolve, reject) => {
            this.signer.Develop(data, false, resolve, reject);
        },
        EnvelopDataEx: (issuers, serials, isAddSign, data, asBase64String, resolve, reject) => {
            this.signer.EnvelopEx(issuers, serials, isAddSign, data, resolve, reject);
        },
        GetCertificatesByKeyInfo: (keyInfo, servers, resolve, reject) => {
            this.signer.GetCertificatesByKeyInfo(keyInfo, servers, null, resolve, reject);
        },
        SetProxySettings: (settings, resolve, reject) => {
            const proxySettings = this.signer.CreateProxySettings();

            Object.keys(settings).forEach((key) => {
                proxySettings[key] = settings[key];
            });

            this.signer.SetProxySettings(proxySettings, resolve, reject);
        },
        Base64Encode: (data, resolve, reject) => {
            this.signer.BASE64Encode(data, resolve, reject);
        }
    };

    constructor() {
        const proxySettings = localStorage.getItem('proxySettings');

        if (proxySettings !== null) {
            this.proxySettings = JSON.parse(proxySettings);
        }
    }

    execute(...rest) {
        const commandData = Array.prototype.slice.call(rest) || [];
        const cmd = commandData.shift();

        let commandAction = this.signer[cmd] && this.signer[cmd].bind(this.signer);

        if ((cmd in this.actions)) {
            commandAction = this.actions[cmd];
        }

        if (!commandAction) {
            // console.log('No method ' + cmd);
            return Promise.reject(new Error('No method ' + cmd));
        }

        return new Promise((resolve, reject) => {
            commandData.push(resolve);
            commandData.push(error => {
                // console.log('hardware key error', { error, cmd, commandData });
                reject(new EdsException(error.message, { cmd }, 'hardware'));
            });
            commandAction(...(commandData || []));
        });
    }

    /**
     * Method for initializing EUSignCP module
     */
    init = () => new Promise((resolve, reject) => {
        const { EndUserLibraryLoader } = window;

        const libType = EndUserLibraryLoader.LIBRARY_TYPE_DEFAULT;
        const langCode = EndUserLibraryLoader.EU_DEFAULT_LANG;
        const loader = new EndUserLibraryLoader(libType, 'euSign', langCode, true);

        loader.onload = (library) => {
            this.signer = library;
            this.signer.Initialize(async () => {
                const { dispatch } = store;
                let serverList;

                try {
                    if (!eds.casUrl) {
                        throw new Error('CAS url is not defined');
                    }
                    serverList = await fetch(eds.casUrl).then(res => res.json());
                } catch (e) {
                    serverList = eds?.useTestACSK ? testACSK.concat(CAs) : CAs;
                }

                serverList = serverList.sort((a, b) => (
                    (a.issuerCNs.some(cn => cn.indexOf('Тест') >= 0 || cn.indexOf('test') >= 0) ? -1 : 1)
                    - (b.issuerCNs.some(cn => cn.indexOf('Тест') >= 0 || cn.indexOf('test') >= 0) ? -1 : 1)));

                await this.setDefaultSettings({ proxySettings: this.proxySettings, serverList });
                this.inited = true;
                dispatch({ type: EDS_CLEAR_TYPES, payload: {} });
                // await this.getKMTypes();
                dispatch({ type: EDS_INITED, payload: {} });

                const certificatesResponce = await fetch(config.eds.caCertsUrl || CACertificates);
                const certificateBuffer = await certificatesResponce.arrayBuffer();
                const certificates = new Uint8Array(certificateBuffer);
                this.signer.SaveCertificates(certificates, resolve, reject);
            }, (error) => {
                this.error = error;
                error ? reject(error) : resolve();
            });
        };

        loader.onerror = (error) => {
            const { dispatch } = store;
            this.error = error;
            dispatch({ type: EDS_LIBRARY_INIT_FAILED, payload: error });
            reject(error);
        };

        loader.load();
    });

    getKMDevices = typeIndex => new Promise((resolve) => {
        const getKeyMediaDevice = (ti, deviceIndex) => this.signer.EnumKeyMediaDevices(
            ti,
            deviceIndex,
            (device) => {
                const { dispatch } = store;

                if (device === null || device === '') {
                    return resolve();
                }

                dispatch({ type: EDS_ADD_KM_DEVICE, payload: { typeIndex, deviceIndex, device } });
                return getKeyMediaDevice(ti, deviceIndex + 1);
            },
            () => {
            }
        );
        getKeyMediaDevice(typeIndex, 0);
    });

    getKMTypes = () => new Promise((resolve) => {
        const getKeyMediaType = index => this.signer.EnumKeyMediaTypes(
            index,
            (type) => {
                const { dispatch } = store;

                if (type === null || type === '') {
                    return resolve();
                }

                dispatch({ type: EDS_ADD_KM_TYPE, payload: { index, type } });
                return this.getKMDevices(index).then(() => getKeyMediaType(index + 1));
            },
            () => getKeyMediaType(index + 1)
        );

        getKeyMediaType(0);
    });

    /**
     * Method for setting default EUSign settings
     */
    setDefaultSettings = (settings) => {
        const { EndUserLibraryLoader } = window;
        const { signer } = this;

        const fileStoreSettings = signer.CreateFileStoreSettings();
        fileStoreSettings.SetPath('');
        fileStoreSettings.SetSaveLoadedCerts(true);

        const proxySettings = signer.CreateProxySettings();
        Object.keys(settings.proxySettings).forEach((key) => {
            proxySettings[key] = settings.proxySettings[key];
        });

        const tspSettings = signer.CreateTSPSettings();
        const ldapSettings = signer.CreateLDAPSettings();
        const ocspSettings = signer.CreateOCSPSettings();
        ocspSettings.SetUseOCSP(true);
        ocspSettings.SetBeforeStore(true);
        ocspSettings.SetAddress('');
        ocspSettings.SetPort('80');
        ocspSettings.SetUseOCSP(true);

        const cmpSettings = signer.CreateCMPSettings();
        const ocspAccessInfoModeSettings = signer.CreateOCSPAccessInfoModeSettings();
        ocspAccessInfoModeSettings.SetEnabled(true);

        const modeSettings = signer.CreateModeSettings();
        modeSettings.SetOfflineMode(false);

        return promiseChain([
            () => new Promise((resolve, reject) => signer.SetRuntimeParameter(
                signer.EU_SAVE_SETTINGS_PARAMETER,
                signer.EU_SETTINGS_ID_PROXY,
                resolve, reject
            )),
            () => new Promise((resolve, reject) => signer.SetRuntimeParameter(
                signer.EU_CHECK_CERT_CHAIN_ON_SIGN_TIME_PARAMETER,
                true,
                resolve, reject
            )),
            () => new Promise((resolve, reject) => signer.IsInitialized((isInitialized) => {
                if (isInitialized) {
                    return resolve();
                }
                return signer.SetUIMode(false, () => signer.Initialize(resolve, reject), reject);
            }, reject)),
            () => new Promise((resolve, reject) => signer.SetUIMode(false, resolve, reject)),
            () => new Promise((resolve, reject) => signer.SetCharset(CHARSET, resolve, reject)),
            () => new Promise((resolve, reject) => signer.SetLanguage(EndUserLibraryLoader.EU_UA_LANG, resolve, reject)),
            () => new Promise((resolve, reject) => signer.SetFileStoreSettings(fileStoreSettings, resolve, reject)),
            () => new Promise((resolve, reject) => signer.SetProxySettings(proxySettings, resolve, reject)),
            () => new Promise((resolve, reject) => signer.SetTSPSettings(tspSettings, resolve, reject)),
            () => new Promise((resolve, reject) => signer.SetLDAPSettings(ldapSettings, resolve, reject)),
            () => new Promise((resolve, reject) => signer.SetOCSPSettings(ocspSettings, resolve, reject)),
            () => new Promise((resolve, reject) => signer.SetCMPSettings(cmpSettings, resolve, reject)),
            () => new Promise((resolve, reject) => signer.SetOCSPAccessInfoModeSettings(ocspAccessInfoModeSettings, resolve, reject)),
            ...settings.serverList.map(ca => () => new Promise((resolve, reject) => {
                const ocspAccessInfoSettings = signer.CreateOCSPAccessInfoSettings();
                ocspAccessInfoSettings.SetAddress(ca.ocspAccessPointAddress);
                ocspAccessInfoSettings.SetPort(ca.ocspAccessPointPort);

                for (let j = 0; j < ca.issuerCNs.length; j++) {
                    ocspAccessInfoSettings.SetIssuerCN(ca.issuerCNs[j]);
                    signer.SetOCSPAccessInfoSettings(ocspAccessInfoSettings, resolve, reject);
                }
            })),
            () => new Promise((resolve, reject) => signer.SetModeSettings(modeSettings, resolve, reject)),
            () => new Promise((resolve, reject) => signer.ResetPrivateKey(resolve, reject)),
            () => new Promise((resolve, reject) => signer.SetRuntimeParameter(
                signer.EU_SIGN_TYPE_PARAMETER,
                signer.EU_SIGN_TYPE_CADES_X_LONG || signer.EU_SIGN_TYPE_CADES_X_LONG_TRUSTED,
                resolve,
                reject
            ))
        ]);
    };

    setServer = ({ tspAddress, tspAddressPort, ocspAccessPointAddress, ocspAccessPointPort, cmpAddress }) => promiseChain([
        () => new Promise((resolve, reject) => {
            const tspSettings = this.signer.CreateTSPSettings();
            tspSettings.SetGetStamps(true);
            if (tspAddress !== '') {
                tspSettings.SetAddress(tspAddress);
                tspSettings.SetPort(tspAddressPort);
            } else {
                tspSettings.SetAddress(CA_DEFAULT_SERVER);
                tspSettings.SetPort(CA_DEFAULT_PORT);
            }
            this.signer.SetTSPSettings(tspSettings, resolve, reject);
        }),
        () => new Promise((resolve, reject) => {
            const ocspSettings = this.signer.CreateOCSPSettings();
            ocspSettings.SetUseOCSP(true);
            ocspSettings.SetBeforeStore(true);
            ocspSettings.SetAddress(ocspAccessPointAddress);
            ocspSettings.SetPort(ocspAccessPointPort);
            this.signer.SetOCSPSettings(ocspSettings, resolve, reject);
        }),
        () => new Promise((resolve, reject) => {
            const cmpSettings = this.signer.CreateCMPSettings();
            cmpSettings.SetUseCMP(!!cmpAddress);
            cmpSettings.SetAddress(cmpAddress);
            cmpSettings.SetPort(CA_DEFAULT_PORT);
            this.signer.SetCMPSettings(cmpSettings, resolve, reject);
        })
    ]);
}

export default HardwareSigner;
