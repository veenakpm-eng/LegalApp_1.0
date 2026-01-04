import React, { useEffect, useState, ReactNode } from 'react';
import { makeStyles, shorthands } from '@fluentui/react-components';

/**
 * MicaBackground Component
 *
 * Implements the Mica material system from Fluent Design 2.0
 *
 * Features:
 * - Mica Alt effect with backdrop-filter blur
 * - Light and dark mode variants
 * - Fallback for browsers that don't support backdrop-filter
 * - Proper z-index layering
 * - System theme detection
 */

interface MicaBackgroundProps {
  children: ReactNode;
  variant?: 'light' | 'dark' | 'auto';
  className?: string;
}

const useStyles = makeStyles({
  micaContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    isolation: 'isolate', // Create new stacking context
  },

  micaBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    pointerEvents: 'none', // Allow clicks to pass through to content
  },

  micaBackgroundLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    // @ts-ignore - backdrop-filter is supported but TypeScript doesn't know
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)', // Safari support
  },

  micaBackgroundDark: {
    backgroundColor: 'rgba(32, 32, 32, 0.85)',
    // @ts-ignore - backdrop-filter is supported but TypeScript doesn't know
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)', // Safari support
  },

  // Fallback for browsers that don't support backdrop-filter
  micaBackgroundLightFallback: {
    backgroundColor: 'rgba(243, 243, 243, 0.95)',
  },

  micaBackgroundDarkFallback: {
    backgroundColor: 'rgba(28, 28, 28, 0.95)',
  },

  micaContent: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    height: '100%',
  },
});

const MicaBackground: React.FC<MicaBackgroundProps> = ({
  children,
  variant = 'auto',
  className = '',
}) => {
  const styles = useStyles();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [supportsBackdropFilter, setSupportsBackdropFilter] = useState(true);

  // Detect system theme preference
  useEffect(() => {
    if (variant === 'auto') {
      // Check initial theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');

      // Listen for theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        setTheme(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);

      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    } else {
      setTheme(variant);
    }
  }, [variant]);

  // Check for backdrop-filter support
  useEffect(() => {
    const testElement = document.createElement('div');
    testElement.style.backdropFilter = 'blur(10px)';
    const hasBackdropFilter = testElement.style.backdropFilter !== '';

    // Also check for WebKit prefix
    if (!hasBackdropFilter) {
      testElement.style.webkitBackdropFilter = 'blur(10px)';
      const hasWebkitBackdropFilter = testElement.style.webkitBackdropFilter !== '';
      setSupportsBackdropFilter(hasWebkitBackdropFilter);
    } else {
      setSupportsBackdropFilter(true);
    }
  }, []);

  // Determine which background class to use
  const getBackgroundClass = () => {
    const isLight = theme === 'light';

    if (supportsBackdropFilter) {
      return isLight ? styles.micaBackgroundLight : styles.micaBackgroundDark;
    } else {
      return isLight ? styles.micaBackgroundLightFallback : styles.micaBackgroundDarkFallback;
    }
  };

  return (
    <div className={`${styles.micaContainer} ${className}`}>
      {/* Mica background layer */}
      <div className={`${styles.micaBackground} ${getBackgroundClass()}`} />

      {/* Content layer */}
      <div className={styles.micaContent}>
        {children}
      </div>
    </div>
  );
};

export default MicaBackground;
