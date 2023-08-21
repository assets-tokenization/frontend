import React from 'react';

import AceEditor from 'react-ace';

import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-xml';
import 'ace-builds/src-noconflict/theme-twilight';

const CodeDocument = ({ file, fileType }) => {
  const value =
    fileType === 'json' ? JSON.stringify(file, null, 4) : atob(file.filePath.split(',').pop());

  return (
    <AceEditor
      mode={fileType}
      theme="twilight"
      enableSnippets={true}
      fontSize={14}
      showPrintMargin={true}
      showGutter={true}
      highlightActiveLine={true}
      value={value}
      width="100%"
      height={600}
      readOnly={true}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        showLineNumbers: true,
        tabSize: 4
      }}
    />
  );
};

export default CodeDocument;
