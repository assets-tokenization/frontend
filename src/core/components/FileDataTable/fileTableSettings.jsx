import React from 'react';
import { Tooltip, IconButton } from '@mui/material';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import FileNameColumn from './components/FileNameColumn';
import DataTableCard from './components/DataTableCard';
import DeleteFileButton from './components/DeleteFileButton';
import DirectPreview from './components/DirectPreview';

export default ({
    t,
    handleDownload,
    directDownload,
    handleDeleteFile
}) => ({
    components: {
        DataTableCard
    },
    controls: {
        pagination: false,
        toolbar: true,
        search: false,
        header: true,
        refresh: false,
        switchView: false,
        customizateColumns: false
    },
    checkable: false,
    columns: [
        {
            id: 'fileName',
            name: t('FileName'),
            padding: 'none',
            render: (value, item) => {
                const fileName = value || item.name || t('Unnamed');
                return (
                    <FileNameColumn
                        name={fileName}
                        item={item}
                        extension={fileName.split('.').pop()}
                    />
                );
            }
        },
        {
            id: 'url',
            name: t('DownloadFile'),
            align: 'right',
            padding: 'checkbox',
            render: (url, file) => (
                <>
                    {
                        directDownload ? (
                            <>
                                <DirectPreview
                                    url={url || file?.link}
                                />

                                <a href={url || file?.link}>
                                    <Tooltip title={t('DownloadFile')}>
                                        <IconButton size="large">
                                            <SaveAltIcon />
                                        </IconButton>
                                    </Tooltip>
                                </a>
                            </>
                        ) : (
                            <Tooltip title={t('DownloadFile')}>
                                <IconButton onClick={handleDownload} size="large">
                                    <SaveAltIcon />
                                </IconButton>
                            </Tooltip>
                        )
                    }
                    {
                        handleDeleteFile ? (
                            <DeleteFileButton
                                file={file}
                                handleDeleteFile={handleDeleteFile}
                            />
                        ) : null
                    }
                </>
            )
        }
    ]
});
