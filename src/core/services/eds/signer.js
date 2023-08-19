/**
 * Service for working with electron digital signature (EDS)
 */
// eslint-disable-next-line import/no-webpack-loader-syntax
import EDSWorker from 'worker-loader!./worker';
import config from 'config';
import customPassword from 'helpers/customPassword';
import EdsException from './EdsException';
import CAs from './CAs.json';
import testACSK from './CA-TEST.json';

const { eds } = config;

export default class Signer {
    inited = true;

    proxySettings = {
        useProxy: false,
        anonymous: true,
        address: '',
        port: '3128',
        user: '',
        password: '',
        savePassword: false
    };

    constructor() {
        const proxySettings = localStorage.getItem('proxySettings');

        if (proxySettings !== null) {
            this.proxySettings = JSON.parse(proxySettings);
        }

        this.worker = new EDSWorker();
        this.init()
    }

    async init() {
        try {
            if (!eds.casUrl) {
                throw new Error('CAS url is not defined');
            }
            this.serverList = await fetch(eds.casUrl).then(res => res.json());
        } catch (error) {
            this.serverList = eds?.useTestACSK ? testACSK.concat(CAs) : CAs;
        }

        this.serverList = this.serverList.sort((a, b) => (
            (a.issuerCNs.some(cn => cn.indexOf('Тест') >= 0 || cn.indexOf('test') >= 0) ? -1 : 1)
            - (b.issuerCNs.some(cn => cn.indexOf('Тест') >= 0 || cn.indexOf('test') >= 0) ? -1 : 1)
        ));

        this.execute('init', {
            cas: this.serverList,
            proxySettings: this.proxySettings,
            edsServiceUrl: (eds || {}).signDataUrl
        }).catch(() => null);
    }

    send = message => this.worker.postMessage(message);

    getServerList = () => this.serverList;

    execute(...rest) {
        const commandData = Array.prototype.slice.call(rest);
        const cmd = commandData.shift();
        return new Promise((resolve, reject) => {
            const commandId = customPassword();
            const messageListener = ({ data: result }) => {
                if (result.commandId !== commandId) {
                    return;
                }

                this.worker.removeEventListener('message', messageListener, true);
                const { error, data: resultData } = result;

                if (error) {
                    reject(new EdsException(error, resultData, 'file'));
                } else {
                    resolve(resultData);
                }
            };
            this.worker.addEventListener('message', messageListener, false);
            this.send({ cmd, commandId, commandData });
        });
    }
}
