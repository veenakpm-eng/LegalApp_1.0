import React from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Text,
  Button,
} from '@fluentui/react-components';
import {
  PlayRegular,
  DismissRegular,
  PauseCircleRegular,
} from '@fluentui/react-icons';

interface TrackingPausedBannerProps {
  visible: boolean;
  onResume: () => void;
  onDismiss: () => void;
}

const useStyles = makeStyles({
  banner: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.padding('6px', '20px'),
    ...shorthands.gap('10px'),
    backgroundColor: 'rgba(138, 87, 0, 0.06)',
    borderBottom: '1px solid rgba(138, 87, 0, 0.15)',
    flexShrink: 0,
    minHeight: '36px',
  },

  statusDot: {
    width: '8px',
    height: '8px',
    ...shorthands.borderRadius('50%'),
    backgroundColor: '#8A5700',
    flexShrink: 0,
    boxShadow: tokens.shadow4,
  },

  icon: {
    color: '#8A5700',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
  },

  label: {
    fontSize: '13px',
    color: '#8A5700',
    fontWeight: 600,
    flex: 1,
  },

  resumeButton: {
    color: '#8A5700',
    backgroundColor: 'rgba(138, 87, 0, 0.08)',
    ...shorthands.border('1px', 'solid', 'rgba(138, 87, 0, 0.2)'),
    transition: 'all 0.15s ease-in-out',
    flexShrink: 0,
    ':hover': {
      backgroundColor: 'rgba(138, 87, 0, 0.14)',
      ...shorthands.border('1px', 'solid', 'rgba(138, 87, 0, 0.3)'),
    },
    ':active': {
      backgroundColor: 'rgba(138, 87, 0, 0.18)',
    },
  },

  dismissButton: {
    color: tokens.colorNeutralForeground3,
    minWidth: 'auto',
    flexShrink: 0,
    ':hover': {
      color: tokens.colorNeutralForeground2,
    },
  },
});

const TrackingPausedBanner: React.FC<TrackingPausedBannerProps> = ({
  visible,
  onResume,
  onDismiss,
}) => {
  const styles = useStyles();

  if (!visible) return null;

  return (
    <div className={styles.banner} role="status" aria-live="polite">
      <div className={styles.statusDot} aria-hidden="true" />
      <span className={styles.icon}>
        <PauseCircleRegular fontSize={16} />
      </span>
      <Text className={styles.label}>Tracking paused</Text>
      <Button
        appearance="subtle"
        icon={<PlayRegular />}
        size="small"
        className={styles.resumeButton}
        onClick={onResume}
        aria-label="Resume tracking"
      >
        Resume
      </Button>
      <Button
        appearance="subtle"
        icon={<DismissRegular />}
        size="small"
        className={styles.dismissButton}
        onClick={onDismiss}
        aria-label="Dismiss tracking paused notification"
      />
    </div>
  );
};

export default TrackingPausedBanner;
