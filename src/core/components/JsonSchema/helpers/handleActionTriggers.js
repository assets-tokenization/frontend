import objectPath from 'object-path';
import evaluate from 'helpers/evaluate';
import promiseChain from 'helpers/promiseChain';

export default async (triggers, props) => {
  let { dataPath, documentData } = props;

  const triggerActions = [];

  (triggers || []).forEach((trigger) => {
    const { action } = trigger;

    if (!action || !trigger.source || !trigger.target) {
      return;
    }

    [].concat(trigger.source).forEach((source) => {
      const params = {};
      const pathElements = dataPath.split('.');
      const sourcePath = source
        .split('.')
        .map((element, index) => {
          if (/\$\{.+?}/.test(element)) {
            params[element] = pathElements[index];
            return pathElements[index];
          }
          return element;
        })
        .join('.');

      if (dataPath !== sourcePath) {
        return;
      }

      [].concat(trigger.target).forEach((target) => {
        let targetPath = Object.keys(params).reduce(
          (acc, key) => acc.replace(key, params[key]),
          target
        );

        const calculateFunc = Object.keys(params).reduce((acc, key) => {
          const regexp = new RegExp(
            key.replace('$', '\\$').replace('{', '\\{').replace('}', '\\}'),
            'g'
          );
          return acc.replace(regexp, params[key]);
        }, action);

        triggerActions.push({
          props,
          targetPath,
          sourcePath,
          calculateFunc,
          action: () => evaluate(calculateFunc, props)
        });
      });
    });
  });

  await promiseChain(
    triggerActions.map(({ props, targetPath, sourcePath, calculateFunc, action }) => async () => {
      try {
        const result = await action();

        let value = result;
        if (typeof result !== 'boolean' && typeof result !== 'number') {
          value = result || undefined;
        }
        console.log('handle action trigger', sourcePath, targetPath, value);
        documentData = JSON.parse(JSON.stringify(documentData));
        objectPath.set(documentData, targetPath, value);
      } catch (error) {
        console.error('trigger error', {
          error,
          props,
          targetPath,
          sourcePath,
          calculateFunc
        });
      }
    })
  );

  return documentData;
};
