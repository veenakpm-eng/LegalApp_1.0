import React from 'react';
import ReactDOM from 'react-dom/client';
import { FluentProvider } from '@fluentui/react-components';
import TrayFlyout from './components/TrayFlyout/TrayFlyout';
import { lightTheme, injectMaterialStyles } from './theme/legalAppTheme';

/**
 * Tray Flyout Entry Point
 *
 * This is a separate React root for the tray flyout window.
 * It renders the TrayFlyout component with Fluent UI theming and Acrylic effects.
 */

// Inject Fluent material styles (mica, acrylic effects)
injectMaterialStyles();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <FluentProvider theme={lightTheme}>
      <TrayFlyout />
    </FluentProvider>
  </React.StrictMode>
);
