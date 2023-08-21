import React from 'react';

import { Worker, Viewer } from '@react-pdf-viewer/core';
import { makeStyles } from '@mui/styles';

import '@react-pdf-viewer/core/lib/styles/index.css';

const useStyles = makeStyles({
  root: {
    maxWidth: 1100,
    margin: 'auto',
    padding: '10px 0'
  }
});

const PdfDocument = ({ file }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.10.377/build/pdf.worker.min.js">
        <Viewer fileUrl={file} />
      </Worker>
    </div>
  );
};

export default PdfDocument;
