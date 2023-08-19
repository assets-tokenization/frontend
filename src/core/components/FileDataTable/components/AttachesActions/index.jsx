import React, { Fragment } from 'react';
import ShowPreview from './ShowPreview';
// import DeleteFile from './DeleteFile';

export default ({ item, actions, fileStorage, darkTheme }) => (
    <Fragment>
        <ShowPreview
            item={item}
            fileStorage={fileStorage}
            handleDownloadFile={(actions || {}).handleDownloadFile}
            darkTheme={darkTheme}
        />
        {/* <DownloadFile item={item} fileStorage={fileStorage} handleDownloadFile={actions.handleDownloadFile} /> */}
        {/* {actions.handleDeleteFile ? <DeleteFile item={item} handleDeleteFile={actions.handleDeleteFile} /> : null} */}
    </Fragment>
);
