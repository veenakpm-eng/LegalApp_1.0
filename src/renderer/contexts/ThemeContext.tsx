import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { FluentProvider, webLightTheme, webDarkTheme, Theme } from '@fluentui/react-components';

/**
 * Theme Context for Dark Mode Support
 *
 * Features:
 * - Automatic system theme detection
 * - Manual theme override
 * - Fluent UI theme integration
 * - CSS custom properties for Mica materials
 */

type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextValue {
  /** Current theme mode (light/dark/auto) */
  mode: ThemeMode;
  /** Resolved theme (light or dark, with auto resolved) */
  resolvedTheme: 'light' | 'dark';
  /** Set the theme mode */
  setMode: (mode: ThemeMode) => void;
  /** Current Fluent UI theme object */
  fluentTheme: Theme;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  /** Initial theme mode (defaults to 'auto') */
  initialMode?: ThemeMode;
}

/**
 * Theme Provider Component
 *
 * Wraps the app and provides theme context with dark mode support
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialMode = 'auto',
}) => {
  const [mode, setMode] = useState<ThemeMode>(initialMode);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Detect and apply system theme preference
  useEffect(() => {
    const updateResolvedTheme = () => {
      if (mode === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setResolvedTheme(prefersDark ? 'dark' : 'light');
      } else {
        setResolvedTheme(mode);
      }
    };

    // Initial update
    updateResolvedTheme();

    // Listen for system theme changes only if in auto mode
    if (mode === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        setResolvedTheme(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);

      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, [mode]);

  // Update CSS custom properties based on theme
  useEffect(() => {
    const root = document.documentElement;

    if (resolvedTheme === 'dark') {
      root.style.setProperty('--mica-base', 'rgba(32, 32, 32, 0.85)');
      root.style.setProperty('--mica-alt', 'rgba(28, 28, 28, 0.85)');
      root.style.setProperty('--mica-header', 'rgba(32, 32, 32, 0.5)');
      root.style.setProperty('--mica-sidebar', 'rgba(28, 28, 28, 0.5)');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.style.setProperty('--mica-base', 'rgba(255, 255, 255, 0.85)');
      root.style.setProperty('--mica-alt', 'rgba(249, 249, 249, 0.85)');
      root.style.setProperty('--mica-header', 'rgba(255, 255, 255, 0.5)');
      root.style.setProperty('--mica-sidebar', 'rgba(249, 249, 249, 0.5)');
      root.setAttribute('data-theme', 'light');
    }
  }, [resolvedTheme]);

  // Select appropriate Fluent UI theme
  const fluentTheme = resolvedTheme === 'dark' ? webDarkTheme : webLightTheme;

  const contextValue: ThemeContextValue = {
    mode,
    resolvedTheme,
    setMode,
    fluentTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <FluentProvider theme={fluentTheme}>
        {children}
      </FluentProvider>
    </ThemeContext.Provider>
  );
};

/**
 * Hook to use theme context
 *
 * @example
 * const { mode, resolvedTheme, setMode } = useTheme();
 * setMode('dark'); // Switch to dark mode
 */
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
