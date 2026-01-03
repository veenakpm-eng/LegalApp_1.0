import React from 'react';
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
  Subtitle2,
} from '@fluentui/react-components';
import {
  SparkleRegular,
  CheckmarkRegular,
  EditRegular,
  DismissRegular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  popupContainer: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '320px',
    zIndex: 1000,
  },
  popup: {
    ...shorthands.padding('16px'),
    boxShadow: tokens.shadow16,
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    marginBottom: '12px',
  },
  headerIcon: {
    color: tokens.colorBrandForeground1,
  },
  headerText: {
    fontSize: '14px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
  },
  section: {
    marginBottom: '12px',
  },
  label: {
    fontSize: '11px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '4px',
  },
  value: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground1,
    marginBottom: '8px',
  },
  valueStrong: {
    fontSize: '13px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
    marginBottom: '8px',
  },
  confidenceContainer: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('6px'),
    marginBottom: '12px',
  },
  confidenceDot: {
    width: '8px',
    height: '8px',
    ...shorthands.borderRadius('50%'),
    backgroundColor: '#107C10', // Fluent UI success green
  },
  confidenceText: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#107C10',
  },
  sourceText: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
    marginBottom: '16px',
    lineHeight: '1.4',
  },
  divider: {
    height: '1px',
    backgroundColor: tokens.colorNeutralStroke2,
    marginTop: '16px',
    marginBottom: '12px',
  },
  buttonContainer: {
    display: 'flex',
    ...shorthands.gap('8px'),
    justifyContent: 'flex-end',
  },
});

interface SuggestionPopupProps {
  visible: boolean;
  onClose: () => void;
}

const SuggestionPopup: React.FC<SuggestionPopupProps> = ({ visible, onClose }) => {
  const styles = useStyles();

  if (!visible) {
    return null;
  }

  return (
    <div className={styles.popupContainer}>
      <Card className={styles.popup}>
        {/* Header */}
        <div className={styles.header}>
          <SparkleRegular fontSize={18} className={styles.headerIcon} />
          <Text className={styles.headerText}>Time Entry Suggestion</Text>
        </div>

        {/* Case/Matter */}
        <div className={styles.section}>
          <div className={styles.label}>Case/Matter</div>
          <div className={styles.valueStrong}>Case #2024-001 - Smith v. Jones</div>
        </div>

        {/* Task Type */}
        <div className={styles.section}>
          <div className={styles.label}>Task Type</div>
          <div className={styles.value}>Document Review</div>
        </div>

        {/* Duration */}
        <div className={styles.section}>
          <div className={styles.label}>Duration</div>
          <div className={styles.value}>1h 15m</div>
        </div>

        {/* Description */}
        <div className={styles.section}>
          <div className={styles.label}>Description</div>
          <div className={styles.value}>Reviewed and edited Motion to Dismiss draft</div>
        </div>

        {/* Confidence Indicator */}
        <div className={styles.confidenceContainer}>
          <div className={styles.confidenceDot} />
          <Text className={styles.confidenceText}>High confidence</Text>
        </div>

        {/* Source Summary */}
        <div className={styles.sourceText}>
          Based on: Word, Acrobat activity 2:00-3:15 PM
        </div>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Action Buttons */}
        <div className={styles.buttonContainer}>
          <Button
            appearance="transparent"
            onClick={onClose}
          >
            Dismiss
          </Button>
          <Button
            appearance="subtle"
            icon={<EditRegular />}
            onClick={onClose}
          >
            Edit
          </Button>
          <Button
            appearance="primary"
            icon={<CheckmarkRegular />}
            onClick={onClose}
          >
            Confirm
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SuggestionPopup;
