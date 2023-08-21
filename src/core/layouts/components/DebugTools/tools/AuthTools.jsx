import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-translate';

import { TextField } from '@mui/material';

import AceEditor from 'react-ace';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-twilight';

const AuthTools = ({ t, auth }) => (
  <>
    <TextField
      variant="standard"
      label={t('Token')}
      value={auth.token}
      fullWidth={true}
      InputProps={{
        readOnly: true
      }}
    />
    <AceEditor
      mode="json"
      theme="twilight"
      fontSize={14}
      showPrintMargin={true}
      showGutter={true}
      highlightActiveLine={true}
      value={JSON.stringify(auth.info, null, 4)}
      width="100%"
      height="calc(100% - 48px)"
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        showLineNumbers: true,
        tabSize: 4
      }}
    />
  </>
);

const mapStateToProps = ({ auth }) => ({
  auth
});

const translated = translate('DebugTools')(AuthTools);
export default connect(mapStateToProps)(translated);
