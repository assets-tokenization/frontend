/* eslint-disable no-eval */
// eslint-disable-next-line import/no-webpack-loader-syntax
import ValidateWorker from 'worker-loader!./worker';
import customPassword from 'helpers/customPassword';

export default (pageDataOrigin = {}, schema, documentData = {}) => new Promise((resolve, reject) => {
    const worker = new ValidateWorker();
    const commandId = customPassword();

    const messageListener = (e) => {
        if (e.data.commandId !== commandId) {
            return;
        }

        const { error, result } = e.data;
        worker.removeEventListener('message', messageListener, true);
        worker.terminate();

        if (error) {
            reject(error);
        } else {
            resolve(result);
        }
    };

    worker.addEventListener('message', messageListener, false);
    worker.postMessage(JSON.parse(JSON.stringify({ commandId, pageDataOrigin, schema, documentData })));
});
