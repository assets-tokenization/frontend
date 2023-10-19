import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { TranslatorProvider } from 'react-translate';
import { ThemeProvider, StyledEngineProvider, createTheme } from '@mui/material/styles';
import Auth from 'pages/Auth';
import Routes from 'routes';
import translation from 'translation';
import theme from 'theme';
import store from 'store';
import 'assets/index.css';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={createTheme(theme)}>
      <TranslatorProvider translations={translation}>
        <Provider store={store}>
          <Auth>
            <Routes />
          </Auth>
        </Provider>
      </TranslatorProvider>
    </ThemeProvider>
  </StyledEngineProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
