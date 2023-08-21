import React from 'react';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { SchemaForm } from 'components/JsonSchema';
import ElementGroupContainer from '../components/ElementGroupContainer';

const styles = (theme) => ({
  inlineDisplay: {
    display: 'flex',
    gap: 16,
    '& > div': {
      marginTop: 5
    },
    '& > div:last-child': {
      marginRight: 0
    },
    [theme.breakpoints.down('lg')]: {
      flexDirection: 'column'
    }
  },
  blockDisplay: {
    display: 'block'
  },
  formDescription: {
    marginBottom: 0
  },
  container: {
    marginBottom: 0
  },
  smBlockDisplay: {
    [theme.breakpoints.down('lg')]: {
      flexDirection: 'unset'
    }
  }
});

class FormGroup extends React.Component {
  constructor(props) {
    super(props);

    this.init(props);
  }

  componentDidUpdate({ path, activeStep }) {
    const { path: newPath, activeStep: newActiveStep } = this.props;

    if (path.join() !== newPath.join() || newActiveStep !== activeStep) {
      this.init(this.props);
    }
  }

  canChange = () => {
    const { onChange, hidden, cleanWhenHidden, keepSelection } = this.props;
    return onChange && !(hidden && cleanWhenHidden && !keepSelection);
  };

  init = ({ value, onChange }) => {
    if (!value && this.canChange()) {
      onChange({});
    }
  };

  render() {
    const {
      classes,
      actions,
      blockDisplay,
      properties,
      sample,
      description,
      readOnly,
      value,
      error,
      onChange,
      outlined,
      required,
      schema,
      path,
      hidden,
      steps,
      task,
      taskId,
      documents,
      rootDocument,
      originDocument,
      stepName,
      activeStep,
      errors,
      width,
      maxWidth,
      checkValid,
      checkRequired,
      fileStorage,
      noMargin,
      inlineDisplay,
      triggerExternalPath,
      externalReaderMessage,
      notRequiredLabel,
      parentValue,
      smBlockDisplay,
      isPopup
    } = this.props;

    if (hidden) return null;

    return (
      <ElementGroupContainer
        outlined={outlined}
        variant="subtitle1"
        description={description}
        sample={sample}
        required={required}
        error={error}
        descriptionClassName={classes.formDescription}
        width={width}
        maxWidth={maxWidth}
        className={classes.container}
        path={path}
        checkValid={checkValid}
        checkRequired={checkRequired}
        noMargin={noMargin}
        notRequiredLabel={notRequiredLabel}
      >
        <div
          className={classNames({
            [classes.inlineDisplay]: inlineDisplay,
            [classes.smBlockDisplay]: smBlockDisplay,
            [classes.blockDisplay]: blockDisplay
          })}
        >
          {Object.keys(properties || {}).map((key) => (
            <SchemaForm
              inlineDisplay={inlineDisplay}
              actions={actions}
              steps={steps}
              task={task}
              taskId={taskId}
              activeStep={activeStep}
              documents={documents}
              rootDocument={rootDocument}
              originDocument={originDocument}
              fileStorage={fileStorage}
              stepName={stepName}
              errors={errors}
              schema={properties[key]}
              parentValue={parentValue || value}
              key={key}
              path={path.concat(key)}
              readOnly={readOnly || properties[key].readOnly}
              value={(value || {})[key]}
              onChange={onChange.bind(null, key)}
              required={
                Array.isArray(schema.required) ? schema.required.includes(key) : schema.required
              }
              triggerExternalPath={triggerExternalPath}
              externalReaderMessage={externalReaderMessage}
              isPopup={isPopup}
              notRequiredLabel={properties[key]?.notRequiredLabel}
            />
          ))}
        </div>
      </ElementGroupContainer>
    );
  }
}

FormGroup.propTypes = {
  errors: PropTypes.array,
  value: PropTypes.object,
  outlined: PropTypes.bool,
  path: PropTypes.array,
  required: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  onChange: PropTypes.func,
  noMargin: PropTypes.bool,
  inlineDisplay: PropTypes.bool,
  triggerExternalPath: PropTypes.array,
  externalReaderMessage: PropTypes.node,
  smBlockDisplay: PropTypes.bool,
  isPopup: PropTypes.bool
};

FormGroup.defaultProps = {
  errors: {},
  value: null,
  outlined: true,
  path: [],
  required: [],
  onChange: () => null,
  noMargin: false,
  inlineDisplay: true,
  triggerExternalPath: null,
  externalReaderMessage: null,
  smBlockDisplay: false,
  isPopup: false
};

export default withStyles(styles)(FormGroup);
