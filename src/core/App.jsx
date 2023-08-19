import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { TranslatorProvider } from 'react-translate';
import { ThemeProvider, StyledEngineProvider, createTheme, adaptV4Theme } from '@mui/material/styles';
import store from 'store';
import translation from 'translation';
import * as Sentry from '@sentry/browser';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import theme from 'theme';
import config from 'config';
import BlockScreen from 'components/BlockScreen';
import Auth from 'components/Auth';
import WebChat from 'components/WebChat';
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'assets/css/mgrpdf.theme.css';
import 'assets/css/main.css';
import 'dayjs/locale/uk';

const AppRouter = React.lazy(() => import('components/AppRouter'));

const { sentryDns, application: { environment, version } } = config;

if (sentryDns) {
    Sentry.init({
        dsn: sentryDns,
        environment,
        release: version,
        ignoreErrors: ['401 unauthorized', '404 not found', 'NetworkError when attempting to fetch resource.', 'Failed to fetch', 'Перелік закінчено', 'NS_BINDING_ABORTED:', 'Error: ESOCKETTIMEDOUT']
    });
}

const auth = (
    <TranslatorProvider translations={translation}>
        <Auth>
            <Suspense fallback={<BlockScreen open={true} transparentBackground={true} />}>
                <AppRouter />
                <WebChat />
            </Suspense>
        </Auth>
    </TranslatorProvider>
);

const storeProvider = (
    <Provider store={store}>
        {auth}
    </Provider>
);

const themeProvider = (
    <StyledEngineProvider injectFirst>
        <ThemeProvider theme={createTheme(adaptV4Theme(theme))}>
            {storeProvider}
        </ThemeProvider>
    </StyledEngineProvider>
);

export default (
    <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale={'uk'}
    >
        {themeProvider}
    </LocalizationProvider>
);

