import objectPath from 'object-path';
import evaluate from 'helpers/evaluate';
import deleteDocumentAttaches from './deleteDocumentAttaches';

const handleTriggers = (
  origin = {},
  triggers,
  dataPath,
  changesData,
  stepData,
  documentData,
  parentData,
  userInfo,
  taskSchema,
  activityLog
) => {
  (triggers || []).forEach((trigger) => {
    const { calculate } = trigger;

    if (!calculate || !trigger.source || !trigger.target) {
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
        }, calculate);

        const result = evaluate(
          calculateFunc,
          changesData,
          stepData,
          documentData,
          parentData,
          userInfo,
          activityLog
        );

        if (result instanceof Error) {
          console.error('trigger error', {
            sourcePath,
            targetPath,
            calculateFunc
          });
          result.commit({
            type: 'calc trigger error',
            calculateFunc,
            targetPath
          });
          return;
        }

        try {
          let value = result;

          if (typeof result !== 'boolean' && typeof result !== 'number') {
            value = result || undefined;
          }

          const copySource = JSON.parse(JSON.stringify(documentData));

          console.log('handle trigger', sourcePath, targetPath, value);

          objectPath.set(origin, targetPath, value);

          deleteDocumentAttaches({
            taskSchema,
            documentData: copySource,
            documentDataModified: origin,
            targetPath
          });
        } catch (e) {
          console.error('trigger error', e);
        }
      });
    });
  });

  return origin;
};

export default handleTriggers;
