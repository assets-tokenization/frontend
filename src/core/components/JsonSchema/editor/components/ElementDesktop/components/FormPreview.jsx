import React from 'react';
import {
  SchemaForm,
  SchemaStepper,
  validateData,
  handleChangeAdapter,
} from 'components/JsonSchema';
import Scrollbar from 'components/Scrollbar';
import { withEditor } from 'components/JsonSchema/editor/JsonSchemaProvider';
import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';

const styles = {
  root: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  schema: {
    padding: 20,
  },
  actionBtn: {
    marginTop: 20,
  },
};

const FormPreview = ({ classes, newValue }) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [value, setValue] = React.useState({});
  const [errors, setErrors] = React.useState([]);
  const { properties } = newValue;

  if (!properties) return null;

  const steps = Object.keys(properties);
  const stepName = steps[activeStep];

  return (
    <Scrollbar>
      <div className={classes.root}>
        <SchemaStepper
          errors={errors}
          steps={steps}
          jsonSchema={newValue}
          activeStep={activeStep}
          handleStep={(step) => () => setActiveStep(step)}
        />
        <div className={classes.schema}>
          <SchemaForm
            demo={true}
            errors={errors}
            value={value && value[stepName]}
            onChange={handleChangeAdapter(
              value && value[stepName],
              (stepValue) =>
                setValue({
                  ...value,
                  [stepName]: stepValue,
                })
            )}
            schema={properties[stepName]}
            stepName={stepName}
            steps={steps}
            activeStep={activeStep}
          />
          <Button
            variant="contained"
            color="primary"
            className={classes.actionBtn}
            onClick={() =>
              setErrors(
                validateData(
                  (value && value[stepName]) || {},
                  properties[stepName] || {},
                  value
                )
              )
            }
          >
            validate
          </Button>
        </div>
      </div>
    </Scrollbar>
  );
};

const styled = withStyles(styles)(FormPreview);
export default withEditor(styled);
