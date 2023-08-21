import React from 'react';
import { translate } from 'react-translate';

import { Grid, TextField, DialogContent } from '@mui/material';

import EDSForm from 'components/EDSForm';
import useStickyState from 'helpers/useStickyState';
import edsService from 'services/eds';

import AceEditor from 'react-ace';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-twilight';

const EDSFormTest = () => {
  const [key, setKey] = React.useState(null);
  const [data, setData] = useStickyState('test', 'EDSFormTest-data');
  const [result, setResult] = React.useState('');

  return (
    <Grid container>
      <Grid item xs={6}>
        <DialogContent>
          <EDSForm
            diiaSign={true}
            getDataToSign={() => [
              {
                data,
                name: 'test',
                internal: true
              }
            ]}
            onSignHash={async (signature) => {
              const signer = edsService.getFileKeySigner();
              const b64Signature = await signer.execute('Base64Decode', signature);
              const internalSignature = await signer.execute('HashToInternal', b64Signature, data);
              setResult(internalSignature);
            }}
            onSelectKey={async (encryptedKey, signer) => {
              setKey(encryptedKey);
              const res = await signer.execute('SignData', data, true);
              setResult(res);
            }}
          />
          <TextField
            variant="standard"
            label="Дані для підпису"
            rows={5}
            multiline={true}
            value={data}
            onChange={({ target: { value } }) => setData(value)}
          />
        </DialogContent>
      </Grid>
      <Grid item xs={6}>
        <AceEditor
          mode="json"
          theme="twilight"
          fontSize={14}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          value={JSON.stringify(key, null, 4)}
          width="100%"
          height="100%"
          readOnly={true}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 4
          }}
        />
        <AceEditor
          mode="json"
          theme="twilight"
          fontSize={14}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          value={result}
          width="100%"
          height="100%"
          readOnly={true}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 4
          }}
        />
      </Grid>
    </Grid>
  );
};

export default translate('EDSFormTest')(EDSFormTest);
