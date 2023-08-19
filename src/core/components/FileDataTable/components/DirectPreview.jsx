import React from 'react';
import mime from 'mime-types';
import { useTranslate } from 'react-translate';
import { Tooltip, IconButton, CircularProgress } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileViewerDialog from 'components/FileViewerDialog';
import blobToBase64 from 'helpers/blobToBase64';

const DirectPreview = ({ url }) => {
    const [open, setOpen] = React.useState(false);
    const [blob, setBlob] = React.useState(false);
    const [fileType, setFileType] = React.useState(false);
    const [downloading, setDownloading] = React.useState(false);
    const t = useTranslate('FileDataTable');

    const handleClickOpen = () => {
        setOpen(true);

        const fetchData = async () => {
            setDownloading(true);

            const response = await fetch(url);

            if (response?.status !== 200) {
                setDownloading(false);
                return;
            }

            const responceToBlob = await response.blob();

            const decodedBlob = await blobToBase64(responceToBlob);

            const extension = mime.extension(responceToBlob?.type);

            setFileType(extension);

            setBlob(decodedBlob);

            setDownloading(false);
        };

        fetchData();
    };

    const handleClose = () => setOpen(false);

    if (!url) return null;

    const fileSource = fileType === 'xlsx' ? blob : url;

    return <>
        <Tooltip title={t('Preview')}>
            <IconButton onClick={handleClickOpen} size="large">
                {
                    downloading
                        ? <CircularProgress size={24} />
                        : <VisibilityIcon size={24} />
                }
            </IconButton>
        </Tooltip>

        <FileViewerDialog
            darkTheme={false}
            file={fileSource}
            fileName={url}
            open={open && fileType && blob}
            extension={fileType}
            onClose={handleClose}
        />
    </>;
};

export default DirectPreview;
