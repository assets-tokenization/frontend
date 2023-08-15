import * as React from 'react';
import { useTranslate } from 'react-translate';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Typography from '@mui/material/Typography';
import classNames from 'classnames';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import CheckIcon from 'assets/images/Tick.svg';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const styles = (theme) => ({
  dot: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    backgroundColor: 'rgba(34, 89, 228, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dotInner: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: '#fff',
  },
  actionDot: {
    backgroundColor: 'rgba(34, 89, 228, 1)'
  },
  activeWrapper: {
    backgroundColor: 'rgba(34, 89, 228, 0.2)',
    padding: 4,
    borderRadius: '50%',
    position: 'relative',
    left: -5
  },
  stepContent: {
    borderLeft: '2px solid rgba(34, 89, 228, 0.2)',
    position: 'relative',
    left: -1,
    paddingLeft: 26
  },
  stepContentLast: {
    borderLeft: 'none',
    paddingLeft: 28
  },
  iconContainer: {
    minWidth: 32
  },
  completed: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    borderRadius: '50%',
    backgroundColor: 'rgba(74, 164, 47, 1)',
  },
  stepText: {
    fontSize: 14,
    fontWeight: 400,
    lineHeight: '21px',
    letterSpacing: '0em',
    color: 'rgba(89, 89, 89, 1)',
    [theme.breakpoints.down('sm')]: {
      fontSize: 11,
      lineHeight: '16px'
    }
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '21px',
    letterSpacing: '0em',
    color: 'rgba(0, 0, 0, 1)',
    minWidth: 32,
    [theme.breakpoints.down('sm')]: {
      fontWeight: 600
    }
  },
  mobileStepper: {
    display: 'flex',
    alignItems: 'center',
  },
  mobileStepperProgress: {
    width: 64,
    height: 64,
    marginRight: 16,
    position: 'relative',
  },
  mobileStepperText: {
    fontSize: 11,
    color: 'rgba(89, 89, 89, 1)',
    fontWeight: 500,
    lineHeight: '16px',
    width: 30,
    position: 'absolute',
    textAlign: 'center',
    left: '50%',
    marginLeft: -15,
    top: '50%',
    marginTop: -16
  }
});

const useStyles = makeStyles(styles);

const Connector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: 'rgba(34, 89, 228, 0.2)',
      borderWidth: 2,
      position: 'relative',
      left: -1
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: 'rgba(34, 89, 228, 0.2)',
      borderWidth: 2,
      position: 'relative',
      left: -1
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: 'rgba(34, 89, 228, 0.2)',
    borderWidth: 2,
    position: 'relative',
    left: -1
  },
}));

const StepIcon = (props) => {
  const { active, completed } = props;

  const classes = useStyles();

  if (completed) {
    return (
      <div className={classes.completed}>
        <img
          src={CheckIcon}
          alt="check icon"
          className={classes.logo}
        />
      </div>
    );
  }

  if (active) {
    return (
      <div className={classes.activeWrapper}>
        <div className={classNames({
          [classes.dot]: true,
          [classes.actionDot]: true,
        })}>
          <div className={classNames({
            [classes.dotInner]: true,
            [classes.actionDotInner]: true,
          })}/>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.dot}>
      <div className={classes.dotInner}/>
    </div>
  );
};

const VerticalLinearStepper = ({
  steps,
  activeStep = 0
}) => {
  const t = useTranslate('LoginScreen');
  const classes = useStyles();

  const percentage = Math.round((activeStep / (steps.length)) * 100) || 1;

  const isSM = useMediaQuery(theme => theme.breakpoints.down('sm'));

  return (
    <>
      {
        !isSM ? (
          <Box>
            <Stepper
              activeStep={activeStep}
              orientation="vertical"
              connector={<Connector />}
            >
              {steps.map((step) => (
                <Step
                  key={step.label}
                  expanded={true}
                >
                  <StepLabel
                    StepIconComponent={StepIcon}
                    classes={{
                      label: classes.stepLabel,
                    }}
                  >
                    {step.label}
                  </StepLabel>
                  <StepContent
                    classes={{
                      root: classes.stepContent,
                      last: classes.stepContentLast
                    }}
                  >
                    <Typography className={classes.stepText}>
                      {step.description}
                    </Typography>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Box>
        ) : (
          <Box>
            <div className={classNames({
              [classes.mobileStepper]: true,
            })}>
              <div>
                <div className={classes.mobileStepperProgress}>
                  <div className={classes.mobileStepperText}>
                    {`${t('StepperText', {
                      step: activeStep >= steps.length ? activeStep : activeStep + 1,
                      total: steps.length
                    })}`}
                  </div>
                  <CircularProgressbar
                    value={percentage}
                    text={''}
                    styles={buildStyles({
                      rotation: 0,
                      strokeLinecap: 'round',
                      pathTransitionDuration: 0.5,
                      pathColor: 'rgba(74, 164, 47, 1)',
                      textColor: 'rgba(89, 89, 89, 1)',
                      trailColor: 'rgba(74, 164, 47, 0.2)',
                      textSize: '16px'
                    })}
                  />
                </div>
              </div>
              <div>
                <Typography className={classes.stepLabel}>
                  {steps[activeStep]?.label || steps[steps.length - 1]?.label}
                </Typography>
                <Typography className={classes.stepText}>
                  {steps[activeStep]?.description || steps[steps.length - 1]?.description}
                </Typography>
              </div>
            </div>
          </Box>
        )
      }
    </>
  );
}

export default VerticalLinearStepper;
