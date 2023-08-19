import React from 'react';
import { translate } from 'react-translate';
import {
    Tooltip,
    IconButton,
    CircularProgress
} from '@mui/material';
import downloadBase64Attach from 'helpers/downloadBase64Attach';
import KeyIcon from '@mui/icons-material/VpnKey';
import base64ToBlob from 'helpers/base64ToBlob';

const DownloadP7SFile = ({ item, t, handleDownloadFile }) => {
    const [loading, setLoading] = React.useState(false);

    const handleDownload = async () => {
        if (loading) return;

        const fileName = item.fileName || item.name || t('IsGenerated');

        setLoading(true);

        const document = await handleDownloadFile(item, false, true);

        setLoading(false);

        document && downloadBase64Attach({
            fileName: fileName + '.p7s'
        }, base64ToBlob(document));
    };

    const icon = loading ? <CircularProgress size={24} /> : <KeyIcon />;

    return (
        <Tooltip title={t('DownloadFileP7S')}>
            <IconButton onClick={handleDownload} size="large">
                {icon}
            </IconButton>
        </Tooltip>
    );
};

export default translate('WorkflowPage')(DownloadP7SFile);
