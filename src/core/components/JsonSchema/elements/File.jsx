import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate } from 'react-translate';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Toolbar } from '@mui/material';
import Preloader from 'components/Preloader';
import FileDataTable from 'components/FileDataTable';
import ConfirmDialog from 'components/ConfirmDialog';
import { addError } from 'actions/error';
import { uploadFile } from 'application/actions/files';
import SelectFileArea from './SelectFiles/components/SelectFileArea';

const File = ({
    t,
    value = {},
    actions,
    hidden,
    path,
    name,
    sample,
    maxSize,
    accept,
    readOnly,
    onChange
}) => {
    const [open, setOpen] = React.useState(false);
    const [busy, setBusy] = React.useState(false);
    const [error, setError] = React.useState();
    const [openErrorDialog, setOpenErrorDialog] = React.useState(false);

    if (hidden) return null;

    const files = [].concat(value)
        .filter(Boolean)
        .filter(file => Object.keys(file).length > 0);

    const onSelectFiles = async (acceptedFiles) => {
        if (!acceptedFiles.length) {
            setError(new Error(t('FileSizeLimitReached')));
            setOpenErrorDialog(true);
            return;
        }

        const acceptedFile = acceptedFiles.shift();

        setBusy(true);

        try {
            const uploadResult = await actions.uploadFile(acceptedFile);

            const uploadedFile = {
                name: acceptedFile.name,
                type: acceptedFile.type,
                link: uploadResult.url
            };

            onChange(uploadedFile);
            setOpen(false);
        } catch (e) {
            // error handler
        }

        setBusy(false);
    };

    return (
        <>
            {
                readOnly ? null : (
                    <Toolbar disableGutters={true}>
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={() => setOpen(true)}
                            disabled={readOnly}
                        >
                            {t(value.name ? 'UploadAnotherFile' : 'UploadFiles')}
                        </Button>
                    </Toolbar>
                )
            }

            <FileDataTable
                data={files}
                fileControl={true}
                directDownload={true}
                handleDeleteFile={readOnly ? null : () => onChange({})}
                controls={
                    {
                        pagination: false,
                        toolbar: false,
                        search: false,
                        header: true,
                        refresh: false,
                        switchView: true,
                        customizateColumns: false
                    }
                }
            />

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth={true}
                maxWidth="md"
            >
                <DialogTitle>{t('UploadFiles')}</DialogTitle>
                <DialogContent>
                    {
                        busy
                        ? <Preloader />
                        : (
                            <SelectFileArea
                                path={path}
                                name={name}
                                sample={sample}
                                maxSize={maxSize}
                                accept={accept}
                                multiple={false}
                                readOnly={readOnly}
                                onSelect={onSelectFiles}
                            />
                        )
                    }
                </DialogContent>
                <DialogActions>
                    <Button
                        disabled={busy}
                        onClick={() => setOpen(false)}
                    >
                        {t('Close')}
                    </Button>
                </DialogActions>
            </Dialog>

            <ConfirmDialog
                open={openErrorDialog}
                title={t('Error')}
                description={error && error.message}
                handleClose={() => setOpenErrorDialog(false)}
            />
        </>
    );
};

File.propTypes = {
    value: PropTypes.object.isRequired
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
    actions: {
        addError: bindActionCreators(addError, dispatch),
        uploadFile: bindActionCreators(uploadFile, dispatch)
    }
});

const translated = translate('Elements')(File);
export default connect(mapStateToProps, mapDispatchToProps)(translated);
