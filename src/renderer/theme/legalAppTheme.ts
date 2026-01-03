import {
  BrandVariants,
  Theme,
  createLightTheme,
  createDarkTheme,
} from '@fluentui/react-components';

/**
 * LegalApp Brand Color Ramp
 * Primary: #1F4E79 (Professional Blue)
 *
 * The color ramp provides shades from 10 (lightest) to 160 (darkest)
 * for consistent theming across the application.
 */
const legalAppBrand: BrandVariants = {
  10: '#F3F7FB',
  20: '#E1EBF5',
  30: '#C9DDEE',
  40: '#ADCDE5',
  50: '#8FBCDB',
  60: '#6FA9D0',
  70: '#4D94C4',
  80: '#1F4E79', // Primary brand color
  90: '#1A4269',
  100: '#163759',
  110: '#122C49',
  120: '#0E2239',
  130: '#0A1829',
  140: '#070F1A',
  150: '#04080D',
  160: '#020305',
};

/**
 * Light Theme for LegalApp
 * Optimized for daytime use with high contrast and readability
 */
export const lightTheme: Theme = {
  ...createLightTheme(legalAppBrand),
};

/**
 * Dark Theme for LegalApp
 * Optimized for low-light environments with reduced eye strain
 */
export const darkTheme: Theme = {
  ...createDarkTheme(legalAppBrand),
};

/**
 * CSS Custom Properties for Fluent Materials
 * These provide consistent visual effects across the application
 */
export const fluentMaterialStyles = `
  :root {
    /* Mica Material Effect - Subtle translucency for windows */
    --mica-base: rgba(255, 255, 255, 0.85);

    /* Acrylic Material Effect - Frosted glass appearance */
    --acrylic-base: rgba(255, 255, 255, 0.7);
    --acrylic-blur: blur(30px) saturate(125%);

    /* Border Radius Tokens */
    --radius-large: 8px;
    --radius-medium: 4px;
  }

  [data-theme="dark"] {
    /* Dark theme overrides for materials */
    --mica-base: rgba(32, 32, 32, 0.85);
    --acrylic-base: rgba(32, 32, 32, 0.7);
  }

  /* Helper classes for applying material effects */
  .mica-background {
    background-color: var(--mica-base);
    backdrop-filter: var(--acrylic-blur);
  }

  .acrylic-background {
    background-color: var(--acrylic-base);
    backdrop-filter: var(--acrylic-blur);
  }

  .radius-large {
    border-radius: var(--radius-large);
  }

  .radius-medium {
    border-radius: var(--radius-medium);
  }
`;

/**
 * Inject material styles into the document
 * Call this once during application initialization
 */
export const injectMaterialStyles = (): void => {
  if (typeof document === 'undefined') return;

  const styleId = 'legal-app-material-styles';

  // Avoid duplicate injection
  if (document.getElementById(styleId)) return;

  const styleElement = document.createElement('style');
  styleElement.id = styleId;
  styleElement.textContent = fluentMaterialStyles;
  document.head.appendChild(styleElement);
};

// Default export for convenience
export default {
  lightTheme,
  darkTheme,
  injectMaterialStyles,
};
