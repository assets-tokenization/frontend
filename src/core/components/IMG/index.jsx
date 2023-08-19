import React from 'react';
import PropTypes from 'prop-types';
import setComponentsId from 'helpers/setComponentsId';

import { Icon, Button } from '@mui/material';

import withStyles from '@mui/styles/withStyles';

// import styles from 'variables/styles/pdfDocument';

const IMGPreview = ({
    fileName,
    setId,
    imageUrl,
    classes,
    handleDownload
}) => (
    <div id={setId('wrap')}>?
        <img
            id={setId('full-preview')}
            src={imageUrl}
            width="100%"
            alt={fileName}
        />
        <Button
            color="yellow"
            className={classes.pdfDownload}
            onClick={handleDownload}
            setId={elementName => setId(`download-${elementName}`)}
        >
            <Icon>save_alt</Icon>
        </Button>
    </div>
);

IMGPreview.propTypes = {
    classes: PropTypes.object.isRequired,
    imageUrl: PropTypes.string,
    setId: PropTypes.func,
    handleDownload: PropTypes.func,
    fileName: PropTypes.string
};

IMGPreview.defaultProps = {
    setId: setComponentsId('img-preview'),
    imageUrl: '',
    handleDownload: undefined,
    fileName: 'Зображення'
};

// decorate and export
export default withStyles({})(IMGPreview);
