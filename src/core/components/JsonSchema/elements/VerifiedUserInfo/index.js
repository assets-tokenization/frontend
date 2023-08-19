import React from 'react';
import { PropTypes } from 'prop-types';
import { useTranslate } from 'react-translate';
import { useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import ElementContainer from 'components/JsonSchema/components/ElementContainer';
import RenderFields from './components/renderFields';
import UserInputFields from './components/userInputFields';

const styles = {
  headline: {
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 56,
    lineHeight: '64px',
    color: '#000000',
    marginBottom: 57
  },
  contentWrapper: {
    maxWidth: 640,
    marginBottom: 80,
    padding: 2,
    position: 'relative',
    animation: '10s ease 0s infinite normal none running granimate',
    transition: 'margin 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    boxShadow: 'none',
    backgroundSize: '200% 300%',
    backgroundImage: 'linear-gradient(217deg, rgba(255, 0, 0, 0.8), rgba(255, 0, 0, 0) 70.71%), linear-gradient(127deg, rgba(0, 0, 255, 0.8), rgba(0, 0, 255, 0) 70.71%), linear-gradient(336deg, rgba(0, 255, 0, 0.8), rgba(0, 255, 0, 0) 70.71%)'
  },
  content: {
    padding: '26px 32px',
    background: 'rgb(255, 255, 255)'
  },
  contentHeadline: {
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 18,
    lineHeight: '28px',
    color: '#000000',
    marginBottom: 24,
    letterSpacing: '-0.02em',
    wordBreak: 'break-word'
  },
  contentText: {
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 12,
    lineHeight: '16px',
    color: '#000000',
    marginBottom: 3,
    letterSpacing: '-0.02em',
    opacity: 0.5,
    wordBreak: 'break-word'
  },
  contentTextValue: {
    fontStyle: 'normal',
    fontWeight: 300,
    fontSize: 16,
    lineHeight: '24px',
    color: '#000000',
    marginBottom: 24,
    letterSpacing: '-0.02em',
    wordBreak: 'break-word'
  },
  flexWrapper: {
    display: 'flex',
    '& > div': {
      width: '50%'
    }
  },
  infoBlockHeadline: {
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 24,
    lineHeight: '28px',
    color: '#000000',
    marginBottom: 24,
    letterSpacing: '-0.02em',
    wordBreak: 'break-word'
  },
  infoBlockHeadlinePassport: {
    marginTop: 70,
    marginBottom: 40
  }
};

const useStyles = makeStyles(styles);

const VerifiedUserInfo = (props) => {
  let {
    hidden,
    value,
    sample,
    required,
    error,
    errors,
    width,
    maxWidth,
    noMargin,
    stepName,
    path,
    taskId,
    handleStore,
    actions
  } = props;
  const t = useTranslate('VerifiedUserInfo');
  const classes = useStyles();
  const userInfo = useSelector(state => state.auth);

  if (hidden) {
    return null;
  }

  const verifiedFields = Object.keys(value?.verified || {}).filter((key) => value?.verified[key]) || [];
  const unVerifiedFields = Object.keys(value?.verified || {}).filter((key) => !value?.verified[key]) || [];

  const allFieldsFound = !unVerifiedFields.length;

  const controlPath = [stepName].concat(path);

  return (
    <ElementContainer
      sample={sample}
      required={required}
      error={error}
      bottomSample={true}
      width={width}
      maxWidth={maxWidth}
      noMargin={noMargin}
    >
      {
        allFieldsFound ? (
          <div className={classes.headline}>
            {t('VerifiedUserFullInfo')}
          </div>
        ) : (
          <div className={classes.headline}>
            {t('VerifiedUserPartialInfo')}
          </div>
        )   
      }

      <RenderFields
        t={t}
        classes={classes}
        value={value}
        userInfo={userInfo}
        fields={verifiedFields}
      />

      <UserInputFields
        t={t}
        value={value}
        taskId={taskId}
        path={controlPath}
        errors={errors}
        classes={classes}
        fields={unVerifiedFields}
        handleStore={handleStore}
        actions={actions}
        getSavingInterval={actions.getSavingInterval}
      />
    </ElementContainer>
  );
};

VerifiedUserInfo.propTypes = {
  actions: PropTypes.object.isRequired,
  stepName: PropTypes.string.isRequired,
  path: PropTypes.array.isRequired,
  taskId: PropTypes.string.isRequired,
  hidden: PropTypes.bool,
  value: PropTypes.object,
  sample: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.bool,
  width: PropTypes.number,
  maxWidth: PropTypes.number,
  noMargin: PropTypes.bool,
  errors: PropTypes.array
};

VerifiedUserInfo.defaultProps = {
  hidden: false,
  value: {},
  sample: false,
  required: false,
  error: false,
  width: '100%',
  maxWidth: '100%',
  noMargin: false,
  errors: []
};

export default VerifiedUserInfo;
