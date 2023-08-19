/* eslint-disable no-eval */
// eslint-disable-next-line import/no-webpack-loader-syntax
import EvaluateWorker from 'worker-loader!./worker';
import customPassword from 'helpers/customPassword';

import EvaluateError from './EvaluateError';

export default (func, ...params) => new Promise((resolve, reject) => {
    const worker = new EvaluateWorker();
    const commandId = customPassword();

    const messageListener = (e) => {
        if (e.data.commandId !== commandId) {
            return;
        }

        const { error, result } = e.data;
        worker.removeEventListener('message', messageListener, true);
        worker.terminate();

        if (error) {
            reject(new EvaluateError(error, func, params));
        } else {
            resolve(result);
        }
    };

    worker.addEventListener('message', messageListener, false);
    worker.postMessage({ commandId, func, params: params && JSON.parse(JSON.stringify(params)) });
});
