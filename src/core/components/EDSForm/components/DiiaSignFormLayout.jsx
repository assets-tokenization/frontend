import React from 'react';
import QRCode from 'qrcode.react';

import { makeStyles } from '@mui/styles';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AutorenewIcon from '@mui/icons-material/Autorenew';

import { Card, CardContent, Button, Typography, Toolbar, Divider, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';
import { useTranslate } from 'react-translate';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex'
    },
    icon: {
        fontSize: 120,
        color: 'green'
    },
    error: {
        fontSize: 120,
        color: 'red'
    },
    container: {
        border: '#aaa 1px dashed',
        borderRadius: 5,
        height: 160,
        width: 160,
        display: 'flex',
        alignItems: 'center'
    },
    divider: {
        marginTop: 20,
        marginBottom: 5
    },
    retry: {
        marginTop: 10
    },
    progress: {
        margin: 'auto'
    },
    processing: {
        marginRight: 4
    },
    processingText: {
        marginTop: 10
    }
}));

const DiiaSignFormLayout = ({
    error,
    retry,
    loading,
    onClose,
    deepLink,
    finished,
    preparing,
    processing,
    updateData,
    signingError,
    showErrorDialog,
    setShowErroDialog
}) => {
    const t = useTranslate('DiiaSignForm');
    const classes = useStyles();
    return (
        <>
            <Card className={classes.root} elevation={0}>
                <CardContent className={classes.container}>
                    {finished ? (
                        <CheckRoundedIcon className={classes.icon} />
                    ) : (
                        <>
                            {error ? (
                                <ErrorOutlineIcon className={classes.error} />
                            ) : (
                                <>
                                    {loading || preparing ? <CircularProgress className={classes.progress} /> : null}
                                    {deepLink && !preparing ? (
                                        <a href={deepLink} aria-label="QR">
                                            <QRCode value={deepLink} />
                                        </a>
                                    ) : null}
                                </>
                            )}
                        </>
                    )}
                </CardContent>
                <CardContent>
                    <Typography gutterBottom variant="h6" component="h6">
                        {t('DiiaSignFormTitle')}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {preparing ? t('DiiaSignFormLoading') : (
                            finished ? t('DiiaSignFormSuccess') :
                                (error ? t('DiiaSignFormError') :
                                    (loading ? t('PreparingDeeplink') : t('DiiaSignFormDescription'))))
                        }
                    </Typography>
                    {error ? (
                        <Button
                            onClick={retry}
                            autoFocus={true}
                            variant="outlined"
                            className={classes.retry}
                        >
                            {t('Retry')}
                        </Button>
                    ) : null}
                    {processing ? (
                        <Typography className={classes.processingText}>
                            <CircularProgress size={12} className={classes.processing} />
                            {t('Processing')}
                        </Typography>
                    ) : null}
                    {deepLink && !processing && !loading && !error && !preparing ? (
                        <Button
                            size="small"
                            onClick={updateData}
                            startIcon={<AutorenewIcon />}
                        >
                            {t('RenewQR')}
                        </Button>
                    ) : null}
                </CardContent>
            </Card>
            <Divider className={classes.divider} />
            <Toolbar disableGutters={true} align>
                <div style={{ flexGrow: 1 }} />
                <Button
                    onClick={onClose}
                    autoFocus={true}
                >
                    {t('CloseDialog')}
                </Button>
            </Toolbar>
            <Dialog
                open={showErrorDialog}
                onClose={() => setShowErroDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className={classes.dialog}
            >
                <DialogTitle
                    className={classes.dialogContentWrappers}
                >
                    {t('SigningDataError')}
                </DialogTitle>
                <DialogContent className={classes.dialogContentWrappers}>
                    <DialogContentText color="primary">
                        {signingError}
                    </DialogContentText>
                </DialogContent>
                <DialogActions className={classes.dialogContentWrappers}>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => setShowErroDialog(false)}
                        className={classes.closeDialogButton}
                        autoFocus={true}
                    >
                        {t('CloseDialog2')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default DiiaSignFormLayout;
