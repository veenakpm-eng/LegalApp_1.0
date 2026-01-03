import React, { useState } from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Button,
  Card,
  Text,
  Body1,
  Body1Strong,
  Caption1,
  Divider,
} from '@fluentui/react-components';
import {
  ChevronUpRegular,
  ChevronDownRegular,
  PlayRegular,
  PauseRegular,
  ClockRegular,
  ArrowSyncRegular,
  DismissCircleRegular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    position: 'fixed',
    bottom: '20px',
    left: '20px',
    zIndex: 1000,
  },
  toggleButton: {
    marginBottom: '8px',
  },
  panel: {
    width: '300px',
    ...shorthands.padding('16px'),
    boxShadow: tokens.shadow16,
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
  },
  header: {
    marginBottom: '4px',
  },
  headerTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
  },
  helperText: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
    marginBottom: '16px',
  },
  iconSection: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
    marginBottom: '16px',
  },
  iconContainer: {
    position: 'relative',
    width: '40px',
    height: '40px',
    flexShrink: 0,
  },
  appIcon: {
    width: '40px',
    height: '40px',
    ...shorthands.borderRadius('6px'),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '600',
    color: '#fff',
    backgroundColor: '#0078D4', // LegalApp brand color
  },
  statusDot: {
    position: 'absolute',
    bottom: '-2px',
    right: '-2px',
    width: '14px',
    height: '14px',
    ...shorthands.borderRadius('50%'),
    ...shorthands.border('2px', 'solid', tokens.colorNeutralBackground1),
  },
  statusActive: {
    backgroundColor: tokens.colorPaletteGreenForeground1,
  },
  statusPaused: {
    backgroundColor: '#F7B500', // Yellow
  },
  statusDisconnected: {
    backgroundColor: tokens.colorNeutralForeground4,
  },
  statusLabel: {
    fontSize: '12px',
    fontWeight: '500',
  },
  tooltipSection: {
    marginBottom: '16px',
  },
  sectionLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '6px',
  },
  tooltipBox: {
    ...shorthands.padding('8px', '10px'),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    fontSize: '12px',
    color: tokens.colorNeutralForeground1,
    fontFamily: 'Segoe UI, sans-serif',
  },
  menuSection: {
    marginTop: '16px',
  },
  menuItem: {
    width: '100%',
    justifyContent: 'flex-start',
    ...shorthands.padding('8px', '12px'),
    marginBottom: '4px',
    fontSize: '13px',
    height: 'auto',
    minHeight: '32px',
  },
  menuDivider: {
    marginTop: '4px',
    marginBottom: '4px',
  },
  syncingText: {
    fontSize: '11px',
    color: tokens.colorBrandForeground1,
    fontStyle: 'italic',
    marginTop: '4px',
  },
});

interface TrayDemoProps {
  onNavigateToActivity?: () => void;
}

type TrayStatus = 'tracking' | 'paused' | 'disconnected';

const TrayDemo: React.FC<TrayDemoProps> = ({ onNavigateToActivity }) => {
  const styles = useStyles();
  const [isExpanded, setIsExpanded] = useState(true);
  const [status, setStatus] = useState<TrayStatus>('tracking');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState('2 minutes ago');

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handlePauseResume = () => {
    if (status === 'tracking') {
      setStatus('paused');
    } else if (status === 'paused') {
      setStatus('tracking');
    }
  };

  const handleOpenActivityFeed = () => {
    if (onNavigateToActivity) {
      onNavigateToActivity();
    }
  };

  const handleSyncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSync('Just now');
    }, 2000);
  };

  const handleQuit = () => {
    alert('In a real app, this would quit LegalApp');
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'tracking':
        return {
          dotClass: styles.statusActive,
          label: 'Tracking Active',
          labelColor: tokens.colorPaletteGreenForeground1,
          tooltip: 'LegalApp · Tracking · 3h 42m today',
        };
      case 'paused':
        return {
          dotClass: styles.statusPaused,
          label: 'Paused',
          labelColor: '#F7B500',
          tooltip: 'LegalApp · Paused',
        };
      case 'disconnected':
        return {
          dotClass: styles.statusDisconnected,
          label: 'Disconnected',
          labelColor: tokens.colorNeutralForeground4,
          tooltip: 'LegalApp · Disconnected',
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className={styles.container}>
      <Button
        appearance="primary"
        size="small"
        onClick={toggleExpanded}
        icon={isExpanded ? <ChevronDownRegular /> : <ChevronUpRegular />}
        className={styles.toggleButton}
      >
        {isExpanded ? 'Hide' : 'Show'} Tray Preview
      </Button>

      {isExpanded && (
        <Card className={styles.panel}>
          {/* Header */}
          <div className={styles.header}>
            <Text className={styles.headerTitle}>System Tray Preview (Demo)</Text>
          </div>
          <Text className={styles.helperText}>
            This simulates the background tray experience
          </Text>

          <Divider />

          {/* Tray Icon Simulation */}
          <div style={{ marginTop: '16px' }}>
            <div className={styles.sectionLabel}>Tray Icon Simulation</div>
            <div className={styles.iconSection}>
              <div className={styles.iconContainer}>
                <div className={styles.appIcon}>LA</div>
                <div className={`${styles.statusDot} ${statusConfig.dotClass}`} />
              </div>
              <Text className={styles.statusLabel} style={{ color: statusConfig.labelColor }}>
                {statusConfig.label}
              </Text>
            </div>
          </div>

          {/* Tooltip Preview */}
          <div className={styles.tooltipSection}>
            <div className={styles.sectionLabel}>Tooltip Preview</div>
            <div className={styles.tooltipBox}>{statusConfig.tooltip}</div>
          </div>

          <Divider />

          {/* Right-Click Menu Simulation */}
          <div className={styles.menuSection}>
            <div className={styles.sectionLabel}>Right-Click Menu Simulation</div>

            {status === 'tracking' ? (
              <Button
                appearance="subtle"
                className={styles.menuItem}
                icon={<PauseRegular />}
                onClick={handlePauseResume}
              >
                Pause Tracking
              </Button>
            ) : (
              <Button
                appearance="subtle"
                className={styles.menuItem}
                icon={<PlayRegular />}
                onClick={handlePauseResume}
              >
                Resume Tracking
              </Button>
            )}

            <Button
              appearance="subtle"
              className={styles.menuItem}
              icon={<ClockRegular />}
              onClick={handleOpenActivityFeed}
            >
              Open Activity Feed
            </Button>

            <Button
              appearance="subtle"
              className={styles.menuItem}
              icon={<ArrowSyncRegular />}
              onClick={handleSyncNow}
              disabled={isSyncing}
            >
              Sync Now
            </Button>
            {isSyncing && (
              <Text className={styles.syncingText}>Syncing...</Text>
            )}
            {!isSyncing && lastSync === 'Just now' && (
              <Text className={styles.syncingText}>Last sync: Just now</Text>
            )}

            <Divider className={styles.menuDivider} />

            <Button
              appearance="subtle"
              className={styles.menuItem}
              icon={<DismissCircleRegular />}
              onClick={handleQuit}
            >
              Quit LegalApp
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TrayDemo;
