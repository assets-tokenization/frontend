import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import _ from 'lodash/fp';
import objectPath from 'object-path';
import { jsonSchemaInjection } from 'actions/documentTemplate';
import { calcTriggers, defaultSchema } from './schemas/sparatedRegister';

const insertKey = (key, value, obj, pos) => {
  const keys = Object.keys(obj) || [];

  if (pos >= keys.length) {
    obj[key] = value;
    return obj;
  }

  const mappedObject = {};

  keys.forEach((el, i) => {
    if (keys[i - 1] === pos) {
      mappedObject[key] = value;
    }

    mappedObject[el] = obj[el];

    if (keys[i] === pos && i === keys.length - 1) {
      mappedObject[key] = value;
    }
  });

  return mappedObject;
};

const SeparatedRegister = ({
  template,
  stepName,
  schema,
  schema: { inject = null },
  withNamedObjects,
  recordsTree
}) => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    try {
      const schemaEvaluated = defaultSchema({
        stepName,
        withNamedObjects,
        recordsTree
      });

      const evaluatedCalcTriggers = calcTriggers({
        stepName
      });

      const mergedSchema = _.merge(schemaEvaluated, schema);

      if (inject) {
        inject.forEach((element) => {
          const { position, control } = element;
          Object.keys(control).forEach((key) => {
            const group = position.split('.')[0];
            const groupIndex = position.split('.')[1];
            const source = !groupIndex ? mergedSchema : mergedSchema?.properties[group];
            const injectedSchema = insertKey(
              key,
              control[key],
              source.properties,
              groupIndex || group
            );
            objectPath.set(source, 'properties', injectedSchema);
          });
        });
      }

      let stepObjectWithAdress = {};
      const stepProperties = template.jsonSchema.properties[stepName].properties;

      for (const [key, value] of Object.entries(stepProperties)) {
        stepObjectWithAdress[key] = value;

        if (value.control === 'address') {
          stepObjectWithAdress = { ...stepObjectWithAdress, ...mergedSchema?.properties };
        }
      }

      delete template.jsonSchema.properties[stepName].properties.address;

      template.jsonSchema.properties[stepName].properties = stepObjectWithAdress;

      template.jsonSchema.calcTriggers = [
        ...(template.jsonSchema.calcTriggers || []),
        ...evaluatedCalcTriggers
      ];

      jsonSchemaInjection(template)(dispatch);
    } catch (e) {
      console.log('address init error', e);
    }
  }, [dispatch, template, stepName, schema, withNamedObjects, inject, recordsTree]);

  return null;
};

SeparatedRegister.propTypes = {
  template: PropTypes.object,
  stepName: PropTypes.string,
  schema: PropTypes.object,
  withNamedObjects: PropTypes.bool,
  recordsTree: PropTypes.bool
};

SeparatedRegister.defaultProps = {
  template: {},
  stepName: '',
  schema: {},
  withNamedObjects: null,
  recordsTree: false
};

export default SeparatedRegister;
