import React from 'react';
import PropTypes from 'prop-types';
import findPathDeep from 'deepdash/findPathDeep';
import objectPath from 'object-path';
import { useTranslate } from 'react-translate';
import makeStyles from '@mui/styles/makeStyles';

const filesLimit = 7;

const styles = {
  wrapper: {
    backgroundColor: '#fff7e3',
    padding: '25px 18px',
    marginTop: 20,
    marginBottom: 20,
    display: 'flex'
  }
};

const useStyles = makeStyles(styles);

const SignFilesLimit = ({ task, template }) => {
  const [files, setFiles] = React.useState([]);
  const classes = useStyles();
  const t = useTranslate('SignFilesLimit');

  React.useEffect(() => {
    try {
      const filesControl = findPathDeep(
        template?.jsonSchema?.properties,
        (value) => value === 'select.files'
      );
      const controlPropsPath = filesControl?.replace('.control', '')?.replace('.properties', '');
      const files = objectPath.get(task?.document?.data, controlPropsPath);
      setFiles(files);
    } catch (e) {
      console.log(e);
    }
  }, [task, template]);

  if ((files || []).length <= filesLimit) return null;

  return <div className={classes.wrapper}>{t('SignFilesLimit')}</div>;
};

SignFilesLimit.propTypes = {
  task: PropTypes.object,
  template: PropTypes.object
};

SignFilesLimit.defaultProps = {
  task: {},
  template: {}
};

export default SignFilesLimit;
