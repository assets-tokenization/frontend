import React from 'react';
import { translate } from 'react-translate';

import {
    Checkbox,
    TextField,
    FormControlLabel
} from '@mui/material';

import FormElementsGroup from 'components/FormElementsGroup';

class ProxySettings extends React.Component {
    handleChange = ({ target: { name, value } }) => {
        const { signer, signer: { proxySettings } } = this.props;
        if (name === 'port' && value) {
            const port = parseInt(value, 10);
            if (port < 65536 && port >= 0) {
                proxySettings[name] = value;
            }
        } else {
            proxySettings[name] = value;
        }

        this.forceUpdate();
        localStorage.setItem('proxySettings', JSON.stringify(proxySettings));
        signer.execute('SetProxySettings', proxySettings);
        // bridgeToValidate(name, value);
    };

    handleCheck = ({ target: { name, checked } }) => {
        const { signer, signer: { proxySettings } } = this.props;
        proxySettings[name] = checked;
        this.forceUpdate();
        localStorage.setItem('proxySettings', JSON.stringify(proxySettings));
        signer.execute('SetProxySettings', proxySettings);
    };

    render() {
        const { t, signer: { proxySettings }, errors = {} } = this.props;
        return (
            <React.Fragment>
                <FormControlLabel
                    control={
                        <Checkbox
                            name="useProxy"
                            checked={proxySettings.useProxy}
                            onChange={this.handleCheck}
                            color="default"
                        />
                    }
                    label={t('PROXY_SETTINGS_ENABLE')}
                />
                {proxySettings.useProxy && (
                    <FormElementsGroup label={t('PROXY_SETTING')}>
                        <TextField
                            variant="standard"
                            name="address"
                            label={t('PROXY_SETTINGS_ADDRESS')}
                            error={!!errors.address}
                            helperText={errors.address}
                            value={proxySettings.address}
                            onChange={this.handleChange}
                            margin="normal" />
                        <TextField
                            variant="standard"
                            name="port"
                            error={!!errors.port}
                            helperText={errors.port}
                            label={t('PROXY_SETTINGS_PORT')}
                            value={proxySettings.port}
                            onChange={this.handleChange}
                            type="number"
                            margin="normal" />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="anonymous"
                                    checked={proxySettings.anonymous}
                                    onChange={this.handleCheck}
                                    color="default"
                                />
                            }
                            label={t('PROXY_SETTINGS_ANONYMOUS')}
                        />
                        {!proxySettings.anonymous && (
                            <React.Fragment>
                                <TextField
                                    variant="standard"
                                    name="user"
                                    label={t('PROXY_SETTINGS_USER')}
                                    value={proxySettings.user}
                                    onChange={this.handleChange}
                                    margin="normal" />
                                <TextField
                                    variant="standard"
                                    name="password"
                                    label={t('PROXY_SETTINGS_PASSWORD')}
                                    value={proxySettings.password}
                                    onChange={this.handleChange}
                                    type="password"
                                    margin="normal" />
                            </React.Fragment>
                        )}
                    </FormElementsGroup>
                )}
            </React.Fragment>
        );
    }
}

export default translate('SignForm')(ProxySettings);
