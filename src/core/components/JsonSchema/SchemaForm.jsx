/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import objectPath from 'object-path';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

import Preloader from 'components/Preloader';
import formElements from 'components/JsonSchema/elements';

import getFormElementName from 'components/JsonSchema/helpers/getFormElementName';
import getMessages from 'components/JsonSchema/helpers/getMessages';

import evaluate from 'helpers/evaluate';
import waiter from 'helpers/waitForAction';
import diff from 'helpers/diff';

import checkIsHidden from 'components/JsonSchema/helpers/checkIsHidden';
import getSampleText from 'components/JsonSchema/helpers/getSampleText';
import getIsReadonly from 'components/JsonSchema/helpers/getIsReadonly';
import getRequired from 'components/JsonSchema/helpers/getRequired';
import getIsRequired from 'components/JsonSchema/helpers/getIsRequired';

import { deleteDocumentAttach } from 'application/actions/task';

const SUPPORTED_TOOLTIP = ['string'];

const SUPPORTED_TOOLTIP_LISTS = [
  'register',
  'external.register',
  'register.list',
  'related.selects',
  'select',
  'registry.search',
  'dynamic.select'
];

const UNSUPPORTED_TOOLTIP = ['radio.group', 'checkbox.group'];

const SYMBOLS_LIMIT = 60;

const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 640
  }
});

const SchemaForm = (props) => {
  const {
    path = [],
    value,
    steps,
    errors,
    actions = {},
    readOnly,
    readonly,
    stepName,
    onChange,
    activeStep,
    parentValue,
    rootDocument = {},
    userInfo,
    customControls,
    schema,
    schema: { control, keepSelection, setDefaultValue, cleanWhenHidden } = {},
    task: { meta: { defaultValueExecuted = [] } = {} } = {}
  } = props;

  const stringifiedPath = path.join('.');

  const [isHidden, setIsHidden] = React.useState(checkIsHidden(props));
  const [isReadonly, setIsReadonly] = React.useState(getIsReadonly(props));
  const [sample, setSample] = React.useState(getSampleText(props));
  const [required, setRequired] = React.useState(getRequired(props));
  const [isRequired, setIsRequired] = React.useState(getIsRequired(props));

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (
      setDefaultValue &&
      control !== 'register' &&
      value === undefined &&
      !defaultValueExecuted.includes(stringifiedPath)
    ) {
      try {
        const newValue = evaluate(setDefaultValue, rootDocument.data);
        if (newValue !== undefined) {
          console.log('set default value', stringifiedPath, newValue);
          actions.setDefaultValueExecuted && actions.setDefaultValueExecuted(stringifiedPath);
          onChange(newValue);
        }
      } catch (e) {
        console.error('set default value error', e);
      }
    }
  }, [
    actions,
    control,
    defaultValueExecuted,
    onChange,
    stringifiedPath,
    rootDocument.data,
    setDefaultValue,
    value
  ]);

  React.useEffect(() => {
    const newIsHidden = checkIsHidden({
      value,
      steps,
      activeStep,
      parentValue,
      rootDocument,
      userInfo,
      schema
    });

    if (newIsHidden !== isHidden || (value !== null && value !== undefined)) {
      setIsHidden(newIsHidden);

      if (
        value !== null &&
        value !== undefined &&
        newIsHidden &&
        cleanWhenHidden &&
        !keepSelection
      ) {
        waiter.addAction(
          'deleteAttaches-' + stringifiedPath,
          async () => {
            if (schema?.control === 'select.files') {
              const controlData = objectPath.get(
                rootDocument.data,
                `${steps[activeStep]}.${stringifiedPath}`
              );
              if (!controlData) return;
              [].concat(controlData).forEach((file) => deleteDocumentAttach(file)(dispatch));
            }
          },
          150
        );

        waiter.addAction('setNull-' + stringifiedPath, () => onChange(null), 50);
      }
    }
  }, [
    activeStep,
    isHidden,
    parentValue,
    rootDocument,
    schema,
    steps,
    value,
    cleanWhenHidden,
    keepSelection,
    onChange,
    stringifiedPath,
    userInfo,
    dispatch
  ]);

  React.useEffect(() => {
    const newSample = getSampleText({
      value,
      steps,
      sample,
      activeStep,
      parentValue,
      rootDocument,
      schema
    });

    if (sample !== newSample) {
      setSample(newSample);
    }
  }, [activeStep, parentValue, rootDocument, sample, schema, steps, value]);

  React.useEffect(() => {
    const newIsReadonly = getIsReadonly({
      value,
      steps,
      readOnly,
      readonly,
      activeStep,
      parentValue,
      rootDocument,
      schema
    });

    if (newIsReadonly !== isReadonly) {
      setIsReadonly(newIsReadonly);
    }
  }, [activeStep, isReadonly, parentValue, readOnly, readonly, rootDocument, schema, steps, value]);

  React.useEffect(() => {
    const newRequired = getRequired({ value, schema });

    if (diff(newRequired, required)) {
      setRequired(newRequired);
    }
  }, [required, schema, value]);

  React.useEffect(() => {
    const newIsRequired = getIsRequired({
      value,
      steps,
      required: props.required,
      activeStep,
      parentValue,
      rootDocument,
      schema
    });
    if (newIsRequired !== isRequired) {
      setIsRequired(newIsRequired);
    }
  }, [activeStep, isRequired, parentValue, props.required, rootDocument, schema, steps, value]);

  const componentName = getFormElementName(schema);
  const FormControl = { ...formElements, ...customControls }[componentName];

  const error = React.useMemo(() => {
    return errors && errors.find((e) => e.path === stringifiedPath);
  }, [errors, stringifiedPath]);

  if (!componentName || !path) {
    return null;
  }

  if (!FormControl) {
    return <div>{`${componentName} не налаштований`}</div>;
  }

  if (schema.external && !value) {
    return <Preloader />;
  }

  const withTooltip = (() => {
    try {
      const isSupported =
        SUPPORTED_TOOLTIP_LISTS.concat(SUPPORTED_TOOLTIP).some((supported) =>
          [schema?.type, schema?.control].includes(supported)
        ) && !UNSUPPORTED_TOOLTIP.some((supported) => [schema?.control].includes(supported));

      if (!isSupported) return;

      const evaluatedTitle = evaluate(
        schema?.description,
        value,
        rootDocument.data[steps[activeStep]],
        rootDocument.data
      );

      const isLonger = (string) => (string || '').length > SYMBOLS_LIMIT && !schema?.properties;

      if (evaluatedTitle instanceof Error) {
        return isLonger(schema?.description);
      }

      return isLonger(evaluatedTitle);
    } catch {
      return false;
    }
  })();

  const tooltipPosition = SUPPORTED_TOOLTIP_LISTS.includes(schema?.control)
    ? 'top-start'
    : 'bottom-start';

  const controlComponent = (
    <FormControl
      {...schema}
      {...props}
      template={props.template || { jsonSchema: schema }}
      messageList={getMessages(schema, [].concat(stepName, path), props)}
      schema={schema}
      setDefaultValue={schema.setDefaultValue}
      sample={sample}
      description={schema.description}
      error={error}
      readOnly={isReadonly}
      required={isRequired}
      hidden={checkIsHidden(props)}
    />
  );

  if (withTooltip) {
    return (
      <CustomWidthTooltip title={schema?.description} placement={tooltipPosition}>
        <div>{controlComponent}</div>
      </CustomWidthTooltip>
    );
  }

  return controlComponent;
};

SchemaForm.propTypes = {
  schema: PropTypes.object,
  errors: PropTypes.array,
  path: PropTypes.array,
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
  rootDocument: PropTypes.object,
  onChange: PropTypes.func,
  customControls: PropTypes.object,
  readOnly: PropTypes.bool,
  locked: PropTypes.bool
};

SchemaForm.defaultProps = {
  schema: {},
  errors: [],
  path: [],
  required: false,
  rootDocument: { data: {} },
  onChange: () => null,
  customControls: {},
  readOnly: false,
  locked: false
};

const mapStateToProps = ({ auth: { info, userUnits } }) => ({
  userInfo: {
    ...info,
    userUnits
  }
});

export default connect(mapStateToProps, null)(SchemaForm);
