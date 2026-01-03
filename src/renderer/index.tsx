import React from 'react';
import ReactDOM from 'react-dom/client';
import { FluentProvider } from '@fluentui/react-components';
import App from './App';
import { lightTheme, injectMaterialStyles } from './theme/legalAppTheme';

// Inject Fluent material styles (mica, acrylic effects)
injectMaterialStyles();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <FluentProvider theme={lightTheme}>
      <App />
    </FluentProvider>
  </React.StrictMode>
);
