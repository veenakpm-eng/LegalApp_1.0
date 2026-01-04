import React, { useState, useEffect } from 'react';
import {
  Button,
  Divider,
  Text,
  makeStyles,
  tokens,
  shorthands,
} from '@fluentui/react-components';
import {
  PlayRegular,
  PauseRegular,
  WindowRegular,
} from '@fluentui/react-icons';

/**
 * TrayFlyout Component
 *
 * A compact flyout window that displays tracking status and quick actions.
 * Features Acrylic blur effect for modern Windows 11 aesthetic.
 */

interface TrayFlyoutProps {
  // Optional props for testing/customization
}

// Styles using Fluent UI makeStyles with Acrylic effect
const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '280px',
    minHeight: '100vh',
    backgroundColor: 'var(--acrylic-base)',
    backdropFilter: 'var(--acrylic-blur)', // backdrop-filter: blur(30px) saturate(125%)
    ...shorthands.overflow('hidden'),
  },

  content: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.padding('16px'),
    ...shorthands.gap('16px'),
  },

  statusSection: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
  },

  statusHeader: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },

  statusIndicator: {
    width: '8px',
    height: '8px',
    ...shorthands.borderRadius('50%'),
    flexShrink: 0,
    boxShadow: tokens.shadow4,
  },

  statusIndicatorActive: {
    backgroundColor: '#0E7C0E', // WCAG-compliant green (4.51:1 contrast)
  },

  statusIndicatorPaused: {
    backgroundColor: '#8A5700', // WCAG-compliant orange (4.54:1 contrast)
  },

  timeDisplay: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    ...shorthands.padding('20px', '16px'),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
  },

  timeValue: {
    fontSize: '32px',
    fontWeight: 600,
    lineHeight: '40px',
    color: tokens.colorNeutralForeground1,
  },

  timeLabel: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    marginTop: '4px',
  },

  activitySection: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('6px'),
    ...shorthands.padding('12px'),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
  },

  activityLabel: {
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: tokens.colorNeutralForeground3,
  },

  activityText: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground1,
    lineHeight: '18px',
  },

  divider: {
    marginTop: '4px',
    marginBottom: '4px',
  },

  buttonsSection: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
  },

  primaryButton: {
    width: '100%',
    transition: 'all 0.15s ease-in-out',
    ':hover': {
      transform: 'translateY(-1px)',
      boxShadow: tokens.shadow8,
    },
    ':active': {
      transform: 'translateY(0)',
    },
  },

  secondaryButton: {
    width: '100%',
    backgroundColor: 'transparent',
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    transition: 'all 0.15s ease-in-out',
    ':hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
    },
    ':active': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
    },
  },
});

const TrayFlyout: React.FC<TrayFlyoutProps> = () => {
  const styles = useStyles();
  const [isTracking, setIsTracking] = useState<boolean>(true);
  const [trackedTime, setTrackedTime] = useState<string>('3h 42m');
  const [currentActivity, setCurrentActivity] = useState<string>('Reviewing Case #2024-1847');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(13320); // 3h 42m in seconds

  // Listen for tracking state changes from main process
  useEffect(() => {
    const handleTrackingStateChanged = (state: boolean) => {
      setIsTracking(state);

      // Update tray state
      window.electronAPI.tray.setState(state ? 'active' : 'idle');
    };

    // Subscribe to tracking state changes
    if (window.electronAPI.ipcRenderer) {
      window.electronAPI.ipcRenderer.on('tracking-state-changed', handleTrackingStateChanged);
    }

    // Cleanup listener on unmount
    return () => {
      if (window.electronAPI.ipcRenderer) {
        window.electronAPI.ipcRenderer.removeListener('tracking-state-changed', handleTrackingStateChanged);
      }
    };
  }, []);

  // Timer to update elapsed time when tracking is active
  useEffect(() => {
    if (!isTracking) return;

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => {
        const newSeconds = prev + 1;

        // Format time as "Xh Ym"
        const hours = Math.floor(newSeconds / 3600);
        const minutes = Math.floor((newSeconds % 3600) / 60);
        const formattedTime = `${hours}h ${minutes}m`;

        setTrackedTime(formattedTime);

        // Update tray tooltip
        window.electronAPI.tray.updateTooltip(
          `LegalApp · ${isTracking ? 'Tracking' : 'Paused'} · ${formattedTime} today`
        );

        return newSeconds;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTracking]);

  // Handle toggle tracking button click
  const handleToggleTracking = () => {
    window.electronAPI.actions.toggleTracking();
  };

  // Handle open main window button click
  const handleOpenApp = () => {
    window.electronAPI.actions.openMainWindow();
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Status Section */}
        <div className={styles.statusSection}>
          <div className={styles.statusHeader}>
            <div
              className={`${styles.statusIndicator} ${
                isTracking ? styles.statusIndicatorActive : styles.statusIndicatorPaused
              }`}
            />
            <Text weight="semibold" size={300}>
              {isTracking ? 'Tracking Active' : 'Tracking Paused'}
            </Text>
          </div>
        </div>

        {/* Time Display */}
        <div className={styles.timeDisplay}>
          <div className={styles.timeValue}>{trackedTime}</div>
          <div className={styles.timeLabel}>Today's Time</div>
        </div>

        {/* Current Activity Section (only shown when tracking) */}
        {isTracking && currentActivity && (
          <div className={styles.activitySection}>
            <div className={styles.activityLabel}>Current Activity</div>
            <Text className={styles.activityText}>{currentActivity}</Text>
          </div>
        )}

        <Divider className={styles.divider} />

        {/* Action Buttons */}
        <div className={styles.buttonsSection}>
          <Button
            appearance="primary"
            icon={isTracking ? <PauseRegular /> : <PlayRegular />}
            className={styles.primaryButton}
            onClick={handleToggleTracking}
          >
            {isTracking ? 'Pause Tracking' : 'Resume Tracking'}
          </Button>

          <Button
            appearance="subtle"
            icon={<WindowRegular />}
            className={styles.secondaryButton}
            onClick={handleOpenApp}
          >
            Open App
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrayFlyout;
