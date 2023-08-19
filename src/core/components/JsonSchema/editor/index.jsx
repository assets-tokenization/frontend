import React from 'react';

import { Editor } from './JsonSchemaProvider';
import ElementDesktop from './components/ElementDesktop';

const JsonSchemaEditor = (props) => (
  <Editor {...props}>
    <ElementDesktop />
  </Editor>
);

export default JsonSchemaEditor;
