import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { jsonSchemaInjection } from 'actions/documentTemplate';
import { requestExternalData } from 'actions/externalReader';
import { updateTaskDocumentValues } from 'application/actions/task';
import diff from 'helpers/diff';
import evaluate from 'helpers/evaluate';

const BankQuestionnaire = (props) => {
  const {
    template,
    stepName,
    actions,
    name,
    path,
    filters,
    rootDocument,
    serviceErrorMessage,
    pendingMessage,
    onChange,
    taskId,
    handleStore
  } = props;
  const dispatch = useDispatch();

  React.useEffect(() => {
    const setExternalErrorMessage = (result, serviceErrorMessage) => {
      if (!serviceErrorMessage) return;
  
      let evaluatedErrorMessage = evaluate(serviceErrorMessage, result);
  
      if (evaluatedErrorMessage instanceof Error) {
        evaluatedErrorMessage = serviceErrorMessage;
      }

      const injectedTemplate = JSON.parse(JSON.stringify({ ...template }));

      injectedTemplate.jsonSchema.properties[stepName] = {
        ...template.jsonSchema.properties[stepName],
        properties: {
          ...template.jsonSchema.properties[stepName].properties,
          warning: {
            control: 'text.block',
            htmlBlock: `
              <div class='fop-blocked-descr'>
                <p class="info-block-icon" style="font-size: 38px; margin-bottom: 15px;">🤷🏻‍♂</p>
                <p>${evaluatedErrorMessage}</p>
              </div>
            `
          }
        }
      };

      jsonSchemaInjection(injectedTemplate)(dispatch);
    };

    const setPendingMessage = (message) => {
      delete template.jsonSchema.properties[stepName].properties.pending;

      delete template.jsonSchema.properties[stepName].properties[name];

      const injectedTemplate = JSON.parse(JSON.stringify({ ...template }));

      injectedTemplate.jsonSchema.properties[stepName] = {
        ...template.jsonSchema.properties[stepName],
        properties: {
          ...template.jsonSchema.properties[stepName].properties,
          pending: {
            control: 'text.block',
            htmlBlock: `<p class='info-block'>${message}</p>`
          }
        }
      };

      if (!message) {
        actions.setBusy(false);
        return;
      }

      actions.setBusy(true);

      jsonSchemaInjection(injectedTemplate)(dispatch);
    };

    const fetchData = async () => {
      try {
        setPendingMessage(pendingMessage);
  
        let filterValue = evaluate(filters, rootDocument.data);
  
        const result = await requestExternalData({
          service: 'bank',
          method: 'init',
          filters: filterValue instanceof Error ? {} : filterValue,
        })(dispatch);

        setPendingMessage(null);

        if (result instanceof Error || result.error) {
          setExternalErrorMessage(result.error || result, serviceErrorMessage);
          return;
        }

        const questionnaire = Object.values(result).find((item) => item.type === 'object');
    
        const injectedTemplate = JSON.parse(JSON.stringify({ ...template }));
  
        injectedTemplate.jsonSchema.properties[stepName] = {
          ...template.jsonSchema.properties[stepName],
          ...questionnaire,
          properties: {
            ...template.jsonSchema.properties[stepName].properties,
            ...questionnaire.properties
          }
        };
  
        const diffs = diff(template, injectedTemplate);
  
        if (!diffs) return;

        jsonSchemaInjection(injectedTemplate)(dispatch);

        await dispatch(updateTaskDocumentValues(
          taskId,
          [stepName].concat('workflowId'),
          result.workflowId
        ));

        handleStore();
      } catch (error) {
        console.error(error);
        setExternalErrorMessage(error, serviceErrorMessage);
        setPendingMessage(null);
      }
    };

    fetchData();
  }, [dispatch, actions, path, template, stepName, name, filters, rootDocument, serviceErrorMessage, pendingMessage, onChange, taskId, handleStore]);

  return null;
};

BankQuestionnaire.propTypes = {
  actions: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  template: PropTypes.object,
  stepName: PropTypes.string,
  serviceErrorMessage: PropTypes.string,
  pendingMessage: PropTypes.string
};

BankQuestionnaire.defaultProps = {
  template: {},
  stepName: '',
  serviceErrorMessage: null,
  pendingMessage: null
};

export default BankQuestionnaire;

