import React from 'react';
import PropTypes from 'prop-types';
import { MobileStepper, StepButton, Stepper, Step, StepLabel, Hidden, Tooltip } from '@mui/material';

import withStyles from '@mui/styles/withStyles';

import evaluate from 'helpers/evaluate';

const styles = {
    stepperToolbar: {
        padding: '0 4px'
    },
    steeper: {
        backgroundColor: '#fafafa',
        padding: '24px 0',
        overflow: 'hidden'
    },
    step: {
        wordWrap: 'break-word',
        boxSizing: 'border-box'
    },
    stepBtn: {
        '& span': {
            maxWidth: '100%'
        }
    },
    mobileStepper: {
        backgroundColor: '#fafafa',
        width: '100%',
        marginTop: 10,
        '& > div': {
            margin: 'auto'
        }
    },
    descriptionWord: {
        display: 'inline-block',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        marginRight: 4
    },
    tooltip: {
        marginTop: -12
    }
};

const LightTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[24],
        fontSize: 16,
    },
    arrow: {
        color: '#fff'
    }
}))(Tooltip);

const getTitle = (string, data) => {
    const evaluatedTitle = evaluate(string, data);

    if (!(evaluatedTitle instanceof Error)) return evaluatedTitle;

    return string;
};

const SchemaStepper = ({
    task,
    steps,
    classes,
    activeStep,
    errors,
    handleStep,
    jsonSchema: {
        properties,
        hideStepperTitles = false
    }
}) => {
    if (steps.length <= 1) return null;

    return <>
        <Hidden
            lgDown={true}
            implementation="css"
        >
            <Stepper
                alternativeLabel={true}
                activeStep={activeStep}
                className={classes.steeper}
                id="steper"
            >
                {steps.map((stepId, index) => {
                    const title = getTitle(properties[stepId].description || '', task && task.document && task.document.data);

                    const button = (
                        <StepButton
                            completed={false}
                            className={classes.stepBtn}
                            onClick={handleStep(index)}
                            disabled={index > steps.length - 1}
                        >
                            {hideStepperTitles ? null : <StepLabel error={errors[stepId]}>{title}</StepLabel>}
                        </StepButton>
                    );

                    return (
                        <Step
                            key={stepId}
                            // title={properties[stepId].description}
                            className={classes.step}
                            style={
                                {
                                    maxWidth: `${100 / steps.length}%`
                                }
                            }
                        >
                            {hideStepperTitles ? <LightTooltip classes={{ tooltip: classes.tooltip }} arrow={true} title={title}>{button}</LightTooltip> : button}
                        </Step>
                    );
                })}
            </Stepper>
        </Hidden>
        <Hidden mdUp={true}>
            <MobileStepper
                variant="dots"
                steps={steps.length}
                position="static"
                activeStep={activeStep}
                className={classes.mobileStepper}
            />
        </Hidden>
    </>;
};

SchemaStepper.propTypes = {
    steps: PropTypes.array.isRequired,
    errors: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
    activeStep: PropTypes.number.isRequired,
    handleStep: PropTypes.func.isRequired,
    jsonSchema: PropTypes.object.isRequired,
    task: PropTypes.object.isRequired
};

export default withStyles(styles)(SchemaStepper);
