/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { useTranslate } from 'react-translate';
import { pdfjs, Document, Page } from 'react-pdf';
import Pagination from '@mui/material/Pagination';
import { Button, IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import classNames from 'classnames';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import ReactResizeDetector from 'react-resize-detector';

import config from 'config';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const useStyles = makeStyles((theme) => ({
  root: {
    overflow: 'auto',
  },
  wrapper: {
    overflow: 'auto',
    overflowY: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    '& > *': {
      margin: 'auto',
    },
  },
  paginationWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 40,
  },
  pagination: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: 40,
    [theme.breakpoints.down('lg')]: {
      display: 'none',
    },
  },
  zoom: {
    marginLeft: 0,
  },
  darkTheme: {
    background: '#404040',
  },
}));

const PdfDocument = ({ file, darkTheme }) => {
    const t = useTranslate('TaskPage');

    const wrapperRef = React.useRef();

    const classes = useStyles();
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const [width, setWidth] = React.useState(720);
    const [height, setHeight] = React.useState();

    React.useEffect(() => {
        if (!wrapperRef.current) {
            return;
        }

        setWidth(wrapperRef.current.clientWidth);
    }, [wrapperRef]);

    // const onResize = React.useCallback(() => {
    //     if (!wrapperRef.current) {
    //         return;
    //     }

    //     setWidth(wrapperRef.current.clientWidth);
    // }, [wrapperRef]);

    const buttonAttributes = darkTheme ? {
        variant: 'outlined',
        color: 'primary'
    } : {}

    return (
        <>
            <div className={classes.root}>
                <div className={classes.wrapper} ref={wrapperRef}>
                    {config?.variables?.pdfPreviewUseZoom ? <div className={classes.zoom} >
                        <IconButton
                            disabled={width > 3500}
                            onClick={() => setWidth(width + 250)}
                            aria-label={t('PdfPreviewPlus')}
                        >
                            <AddIcon />
                        </IconButton>
                        <IconButton
                            disabled={width < 600}
                            onClick={() => setWidth(width - 250)}
                            aria-label={t('PdfPreviewMinus')}
                        >
                            <RemoveIcon />
                        </IconButton>
                    </div> : null}
                    <div tabIndex="0" style={{ minHeight: height }}>
                        <Document
                            file={file}
                            loading={t('Loading')}
                            noData={t('NoData')}
                            onLoadError={console.error}
                            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                        >
                            <Page pageNumber={pageNumber} width={width} tabIndex="0" />
                        </Document>
                        <ReactResizeDetector handleHeight={true} onResize={(w, h) => setHeight(h)} />
                    </div>
                </div>
            </div>
            {numPages && numPages > 1 ?
                <div
                    className={
                        classNames({
                            [classes.paginationWrapper]: true,
                            [classes.darkTheme]: darkTheme,
                        })}
                >
                    <Button
                        disabled={pageNumber === 1}
                        startIcon={<ArrowBackIcon />}
                        onClick={() => setPageNumber(pageNumber - 1)}
                        {...buttonAttributes}
                    >
                        {t('PreviousPage')}
                    </Button>
                    <Pagination
                        page={pageNumber}
                        count={numPages}
                        {...buttonAttributes}
                        hidePrevButton={true}
                        hideNextButton={true}
                        getItemAriaLabel={(page, pageNumber) => t('Page', { page: pageNumber })}
                        className={classes.pagination}
                        onChange={(e, page) => setPageNumber(page)}
                    />
                    <Button
                        disabled={pageNumber === numPages}
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => setPageNumber(pageNumber + 1)}
                        {...buttonAttributes}
                    >
                        {t('NextPage')}
                    </Button>
                </div> : null}
        </>
    );
}

export default PdfDocument;
