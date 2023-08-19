import React, { Suspense, lazy } from 'react';
import { makeStyles } from '@mui/styles';
import classNames from 'classnames';

import Preloader from 'components/Preloader';

import PdfDocument from 'components/FilePreview/components/PdfDocument';
import CodeDocument from 'components/FilePreview/components/CodeDocument';
import UnsupportedComponent from 'components/FilePreview/components/UnsupportedComponent';

import XlsxViewer from 'components/FilePreview/components/xslx/xslx';

const FileViewer = lazy(() => import('react-file-viewer'));

const useStyles = makeStyles(theme => ({
    root: {
        position: 'relative',
        backgroundColor: '#ffffff',
        [theme.breakpoints.down('xl')]: {
            left: 'unset'
        },
        '& .rpv-core__viewer > div > div': {
            overflow: 'inherit!important'
        }
    },
    toolbar: {
        position: 'sticky',
        bottom: 0,
        padding: '0 10px'
    },
    unsupportedContainer: {
        padding: 40
    },
    printIcon: {
        position: 'absolute',
        bottom: 65,
        left: 10,
        [theme.breakpoints.down('xl')]: {
            display: 'none'
        }
    }
}));

const FilePreview = ({ file, fileType, darkTheme }) => {
    const classes = useStyles();

    return (
        <div className={classNames(classes.root, classes[fileType])}>
            {fileType === 'pdf' ? (
                <PdfDocument
                    file={file}
                    darkTheme={darkTheme}
                />
            ) : (fileType === 'xlsx' ? (
                <XlsxViewer
                    filePath={file}
                    fileType={fileType}
                    darkTheme={darkTheme}
                />
            ) : (['json', 'bpmn'].includes(fileType) ? (
                <CodeDocument
                    file={file}
                    fileType={fileType}
                />
            ) : (
                <Suspense fallback={<Preloader flex={true} />}>
                    <FileViewer
                        darkTheme={darkTheme}
                        filePath={file}
                        fileType={fileType}
                        unsupportedComponent={UnsupportedComponent}
                    />
                </Suspense>
            )))}
            <span></span>
        </div>
    );
}

export default FilePreview;
