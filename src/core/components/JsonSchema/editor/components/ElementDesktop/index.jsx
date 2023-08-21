import React from 'react';
import { useTranslate } from 'react-translate';
import { IconButton, Tooltip, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { withEditor } from 'components/JsonSchema/editor/JsonSchemaProvider';
import VisualEditor from './components/VisualEditor';
import CodeEditor from './components/CodeEditor';
import FormPreview from './components/FormPreview';

const editors = {
  VisualEditor,
  CodeEditor,
  FormPreview
};

const withStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  action: {
    top: 4,
    right: 100,
    position: 'absolute'
  },
  json5: {
    color: 'rgba(255, 255, 255, 0.7)'
  }
}));

const ElementDesktop = () => {
  const t = useTranslate('JsonSchemaEditor');
  const classes = withStyles();
  const [active, setActive] = React.useState(1);

  const Editor = Object.values(editors)[active];

  return (
    <>
      <div className={classes.action}>
        <Tooltip title={t('ChangeEditor')}>
          <IconButton onClick={() => setActive(active === 1 ? 0 : 1)}>
            {active === 1 ? (
              <AccountTreeIcon />
            ) : (
              <Typography className={classes.json5}>{'json5'}</Typography>
            )}
          </IconButton>
        </Tooltip>
      </div>
      <div className={classes.root}>
        <Editor />
      </div>
    </>
  );
};

export default withEditor(ElementDesktop);
