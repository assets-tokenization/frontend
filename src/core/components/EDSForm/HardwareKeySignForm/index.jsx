import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-translate';
import PropTypes from 'prop-types';
import MobileDetect from 'mobile-detect';
import { TimeoutError } from 'promise-timeout';

import {
    Button,
    FormControl,
    TextField,
    MenuItem,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    LinearProgress,
    Typography,
    //   Hidden,
    InputAdornment,
    IconButton,
    CircularProgress,
} from '@mui/material';

import withStyles from '@mui/styles/withStyles';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import Preloader from 'components/Preloader';
import edsService from 'services/eds';
import renderHTML from 'react-render-html';

import config from 'config';

import DeviceSelect from './components/DeviceSelect';
import ProxySettings from '../ProxySettings';

const { useProxySettings, showServerList } = (config && config.eds) || {};

const styles = theme => ({
    content: {
        padding: '0 !important',
        marginBottom: 40
    },
    grow: {
        flexGrow: 1
    },
    errorText: {
        padding: 20,
        marginBottom: 20,
        paddingLeft: 0,
        fontSize: '1rem',
        lineHeight: '1.5em',
        color: 'rgba(0, 0, 0, 0.87)',
        '& > div > a': {
            textDecoration: 'none',
            color: '#0059aa'
        },
        '& > div > a:hover': {
            textDecoration: 'underline',
            color: '#000'
        },
        '@media screen and (max-width: 767px)': {
            display: 'block',
            fontSize: 14
        }
    },
    actions: {
        marginTop: 10,
        justifyContent: 'flex-start',
        [theme.breakpoints.down('md')]: {
            paddingLeft: 0,
            paddingRight: 0,
            display: 'inline-grid'
        }
    },
    progress: {
        marginRight: 4
    },
    progressText: {
        marginBottom: 10
    }
});

const serviceMessages = [
    'Виникла помилка при доступі до носія ключової інформації',
    'Виникла помилка при зчитуванні особистого ключа з носія ключової інформації'
];

class HardwareKeySignForm extends React.Component {
    constructor(props) {
        super(props);
        const { hardwareSigner } = edsService;
        const md = new MobileDetect(window.navigator.userAgent);

        this.state = {
            server: 0,
            password: null,
            error: hardwareSigner.error,
            kmType: '',
            kmDevice: '',
            updating: false,
            errors: {},
            signingError: null,
            showErrorDialog: false,
            showServerSelect: props.showServerList,
            waiting: true,
            itsMobile: !!md.mobile()
        };
    }

    componentDidUpdate(prevProps) {
        const { inited } = this.props;

        if (inited !== prevProps.inited) {
            this.updateDevices();
        }
    }

    componentDidMount() {
        this.updateDevices();
    }

    updateDevices = async () => {
        const { hardwareSigner } = edsService;
        const { updating } = this.state;
        if (updating) {
            return;
        }
        this.setState({ updating: true });
        try {
            await hardwareSigner.getKMTypes();
        } catch (e) {
            //Nothign to do
        }
        this.setState({ updating: false });
    };

    handleChange = name => ({ target: { value } }) => this.setState({ [name]: value }, () => {
        const { errors } = this.state;
        delete errors[name];
        this.setState({ errors });
    });

    handleKeyChange = ({ target }) =>
        target.files.length && this.setState({ key: target.files[0] }, () => {
            const { errors, key } = this.state;
            delete errors[key];
            this.setState({ errors });
        });

    tryToSubmit = ({ key }) => key === 'Enter' && this.handleSelectKey();

    handleClose = () => this.setState({ showErrorDialog: false });

    handleSelectKey = async () => {
        const { t, onSelectKey, setBusy } = this.props;
        if (!onSelectKey) {
            return;
        }

        const { server, kmType, kmDevice, password } = this.state;
        const { hardwareSigner: signer } = edsService;
        const errors = this.validate();

        if (Object.keys(errors).length) {
            this.setState({ errors, waiting: false });
            return;
        }

        this.setState({ waiting: true });
        setBusy(true);
        setTimeout(() => this.setState({ waiting: false }), 20000);

        const readKeyOnServer = async (serverIndex, iterate = true) => {
            const serverList = edsService.getServerList();
            const acskServer = serverList[serverIndex];
            if (!acskServer) {
                return null;
            }

            try {
                await signer.execute('setServer', acskServer);
                const encodedKey = await signer.execute('ReadHardwareKey', kmType, kmDevice, password);
                return encodedKey;
            } catch (e) {
                if (!iterate || serviceMessages.includes(e.message)) {
                    throw e;
                }
                return readKeyOnServer(serverIndex + 1, iterate);
            }
        };

        try {
            const privateKey = await readKeyOnServer(server && (server - 1), !server);

            if (privateKey === null) {
                this.setState({
                    errors: { server: t('CantDetectACSK') },
                    showServerSelect: true
                });
            } else {
                await onSelectKey(
                    privateKey,
                    signer,
                    () => signer.execute('ResetPrivateKey'),
                    { type: 'hardware' }
                );
            }
        } catch (e) {
            this.setState({
                signingError: (e instanceof TimeoutError) ? t(e.message) : e.message,
                showErrorDialog: true
            });
        }

        setBusy(false);
    };

    validate() {
        const { t } = this.props;
        const { server, kmType, kmDevice, password } = this.state;
        const errors = {};

        if (server === null) {
            errors.server = t('SelectServer');
        }

        if (kmType === '') {
            errors.kmType = t('SelectType');
        }

        if (kmDevice === '') {
            errors.kmDevice = t('SelectDevice');
        }

        if (!password) {
            errors.password = t('FillPassword');
        }

        return errors;
    }

    render() {
        const {
            t,
            busy,
            onClose,
            classes,
            setId,
            inited,
            kmTypes,
            readPrivateKeyText,
            signProgress,
            signProgressText
        } = this.props;

        const {
            updating,
            server,
            kmType,
            kmDevice,
            password,
            errors,
            signingError,
            showErrorDialog,
            waiting,
            itsMobile,
            showServerSelect,
            showPassword
        } = this.state;

        // const { hardwareSigner: signer } = edsService;

        const error = this.state.error || this.props.error;

        const serverList = edsService.getServerList();

        const warningPaper = (causeOfError, text = '') => (
            <Typography
                variant="h5"
                gutterBottom={true}
                id={setId('warning-text')}
                className={classes.errorText}
            >
                {text || t(`HardwareKeySignMethodNotSupported${causeOfError}`)}
            </Typography>
        );

        if (error && !itsMobile) {
            return warningPaper('Browser', renderHTML(error));
        }

        if (itsMobile) {
            return warningPaper('Mobile');
        }

        if (!inited) {
            return (waiting ? <Preloader /> : warningPaper('BROWSER'));
        }

        return <>
            <DialogContent className={classes.content}>
                <FormControl
                    variant="standard"
                    fullWidth={true}
                    className={classes.formControl}
                    id={setId('form')}>
                    {(errors.server || showServerSelect) ? (
                        <TextField
                            variant="standard"
                            id={setId('server')}
                            select={true}
                            label={t('ACSKServer')}
                            value={server || 0}
                            error={!!errors.server}
                            onChange={this.handleChange('server')}
                            margin="normal"
                            disabled={busy}
                            helperText={errors.server}
                            SelectProps={{ MenuProps: { className: classes.menu } }}>
                            <MenuItem
                                value={0}
                                id={setId('server-autodetect')}
                                className={classes.menuItem}
                            >
                                {t('ACSKAutoDetect')}
                            </MenuItem>
                            {serverList && serverList.map((option, index) => {
                                const name = option.issuerCNs[0];
                                return (
                                    <MenuItem
                                        key={index}
                                        value={index + 1}
                                        id={setId(`server-${name}`)}
                                        className={classes.menuItem}
                                    >
                                        {name}
                                    </MenuItem>
                                );
                            })}
                        </TextField>
                    ) : null}
                    <DeviceSelect
                        kmType={kmType}
                        kmDevice={kmDevice}
                        kmTypes={kmTypes}
                        updating={updating}
                        onUpdate={this.updateDevices}
                        onChange={this.handleChange}
                        error={errors.kmType}
                    />
                    {kmType !== '' ? (
                        <TextField
                            variant="standard"
                            id={setId('device')}
                            select={true}
                            label={t('SelectKmDevice')}
                            className={classes.textField}
                            value={kmDevice}
                            onChange={this.handleChange('kmDevice')}
                            SelectProps={{
                                MenuProps: {
                                    className: classes.menu
                                }
                            }}
                            disabled={busy || kmTypes[kmType].devices.length === 1}
                            margin="normal"
                            error={!!errors.kmDevice}
                            helperText={errors.kmDevice}>
                            {kmTypes[kmType].devices.map(({ name, index }) => (
                                <MenuItem
                                    key={index}
                                    value={index}
                                    id={setId(`device-${index}`)}
                                    className={classes.menuItem}
                                >
                                    {name}
                                </MenuItem>
                            ))}
                        </TextField>
                    ) : null}
                    <TextField
                        variant="standard"
                        id={setId('password')}
                        label={t('Password')}
                        value={password || ''}
                        error={!!errors.password}
                        onKeyPress={this.tryToSubmit}
                        onChange={this.handleChange('password')}
                        margin="normal"
                        type={showPassword ? 'text' : 'password'}
                        disabled={busy}
                        helperText={errors.password}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => this.setState({ showPassword: !showPassword })}
                                        size="large">
                                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }} />
                </FormControl>
                {useProxySettings ? <ProxySettings signer={edsService.getSigner()} busy={busy} /> : null}
            </DialogContent>
            {busy ? (
                <>
                    {signProgressText ? (
                        <Typography className={classes.progressText}>
                            {signProgress ? <CircularProgress size={12} className={classes.progress} /> : null}
                            {signProgressText}
                        </Typography>
                    ) : null}
                    <LinearProgress
                        value={signProgress}
                        variant={signProgress ? 'determinate' : 'indeterminate'}
                    />
                </>
            ) : null}
            <DialogActions className={classes.actions}>
                {onClose ? (
                    // <Hidden smDown={true} implementation="css">
                    <Button
                        size="large"
                        onClick={onClose}
                        disabled={busy}
                        id={setId('cancel-button')}
                        setId={elementName => setId(`cancel-${elementName}`)}
                    >
                        {t('Cancel')}
                    </Button>
                    //  </Hidden> 
                ) : null}
                <Button
                    size="large"
                    color="primary"
                    variant="contained"
                    onClick={this.handleSelectKey}
                    disabled={busy}
                    id={setId('sign-button')}
                    setId={elementName => setId(`sign-${elementName}`)}
                >
                    {readPrivateKeyText || t('Sign')}
                </Button>
            </DialogActions>
            <Dialog
                open={showErrorDialog}
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                id={setId('dialog')}
                className={classes.dialog}
            >
                <DialogTitle
                    id={setId('dialog alert-dialog-title')}
                    className={classes.dialogContentWrappers}
                >
                    {t('SigningDataError')}
                </DialogTitle>
                <DialogContent className={classes.dialogContentWrappers}>
                    <DialogContentText id={setId('dialog alert-dialog-description')}>
                        {signingError}
                    </DialogContentText>
                </DialogContent>
                <DialogActions className={classes.dialogContentWrappers}>
                    <Button
                        size="large"
                        color="primary"
                        variant="contained"
                        onClick={this.handleClose}
                        autoFocus={true}
                        id={setId('close-button')}
                        setId={elementName => setId(`close-${elementName}`)}
                    >
                        {t('CloseDialog')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>;
    }
}

HardwareKeySignForm.propTypes = {
    setId: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    kmTypes: PropTypes.array.isRequired,
    inited: PropTypes.bool.isRequired,
    onSelectKey: PropTypes.func.isRequired,
    error: PropTypes.string,
    showServerList: PropTypes.bool
};

HardwareKeySignForm.defaultProps = {
    error: '',
    showServerList
};


// decorate and export
const styled = withStyles(styles)(HardwareKeySignForm);
const translated = translate('SignForm')(styled);
export default connect(({ eds }) => eds)(translated);
