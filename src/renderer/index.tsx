import React from 'react';
import ReactDOM from 'react-dom/client';
import { FluentProvider } from '@fluentui/react-components';
import App from './App';
import TrayFlyout from './components/TrayFlyout/TrayFlyout';
import { lightTheme, injectMaterialStyles } from './theme/legalAppTheme';

// Import global styling foundation
import './styles/global.css';

// Import WCAG 2.2 accessibility styles
import './styles/accessibility.css';

// Inject Fluent material styles (mica, acrylic effects)
injectMaterialStyles();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Check if we're rendering the flyout or main app based on hash
const isFlyout = window.location.hash === '#/flyout';

root.render(
  <React.StrictMode>
    <FluentProvider theme={lightTheme}>
      {isFlyout ? <TrayFlyout /> : <App />}
    </FluentProvider>
  </React.StrictMode>
);
