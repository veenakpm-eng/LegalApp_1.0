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
  Badge,
} from '@fluentui/react-components';
import {
  SparkleRegular,
  CheckmarkRegular,
  EditRegular,
  DismissRegular,
  Dismiss24Regular,
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
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    minWidth: '24px',
    width: '24px',
    height: '24px',
    ...shorthands.padding('0'),
    color: tokens.colorNeutralForeground3,
    ':hover': {
      color: tokens.colorNeutralForeground1,
    },
  },
  suggestedBadge: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('6px'),
    marginBottom: '12px',
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
  confidenceDotLow: {
    width: '8px',
    height: '8px',
    ...shorthands.borderRadius('50%'),
    backgroundColor: '#F7630C', // Fluent UI warning amber
  },
  confidenceText: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#107C10',
  },
  confidenceTextLow: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#F7630C',
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
  autoDismissContainer: {
    marginTop: '16px',
    paddingTop: '12px',
    ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke2),
  },
  autoDismissText: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
    marginBottom: '8px',
    textAlign: 'center',
  },
  progressBar: {
    height: '3px',
    backgroundColor: tokens.colorNeutralStroke2,
    ...shorthands.borderRadius('2px'),
    ...shorthands.overflow('hidden'),
  },
  progressBarFill: {
    height: '100%',
    width: '100%',
    backgroundColor: tokens.colorBrandBackground,
    ...shorthands.borderRadius('2px'),
  },
  footerLink: {
    marginTop: '12px',
    textAlign: 'center',
  },
  footerLinkButton: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
    textDecoration: 'none',
    cursor: 'pointer',
    ':hover': {
      textDecoration: 'underline',
      color: tokens.colorNeutralForeground2,
    },
  },
});

interface SuggestionPopupProps {
  visible: boolean;
  onClose: () => void;
  confidenceLevel?: 'high' | 'low';
}

const SuggestionPopup: React.FC<SuggestionPopupProps> = ({
  visible,
  onClose,
  confidenceLevel = 'high'
}) => {
  const styles = useStyles();

  const handleDontSuggest = () => {
    alert('This feature would prevent suggestions for this app in the future.');
  };

  if (!visible) {
    return null;
  }

  const isHighConfidence = confidenceLevel === 'high';
  const isLowConfidence = confidenceLevel === 'low';

  return (
    <div className={styles.popupContainer}>
      <Card className={styles.popup}>
        {/* Close Button */}
        <Button
          appearance="transparent"
          className={styles.closeButton}
          icon={<DismissRegular />}
          onClick={onClose}
          aria-label="Close"
        />

        {/* Suggested Badge */}
        <div className={styles.suggestedBadge}>
          <Badge appearance="outline" color="informative" size="small">
            Suggested
          </Badge>
          <SparkleRegular fontSize={14} className={styles.headerIcon} />
        </div>

        {/* Header */}
        <div className={styles.header}>
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
          <div className={isLowConfidence ? styles.confidenceDotLow : styles.confidenceDot} />
          <Text className={isLowConfidence ? styles.confidenceTextLow : styles.confidenceText}>
            {isLowConfidence ? 'Low confidence - please verify' : 'High confidence'}
          </Text>
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
          {isLowConfidence ? (
            <>
              {/* Low confidence: Edit is primary, Confirm is secondary */}
              <Button
                appearance="outline"
                icon={<CheckmarkRegular />}
                onClick={onClose}
              >
                Confirm
              </Button>
              <Button
                appearance="primary"
                icon={<EditRegular />}
                onClick={onClose}
              >
                Edit
              </Button>
            </>
          ) : (
            <>
              {/* High confidence: Edit is subtle, Confirm is primary */}
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
            </>
          )}
        </div>

        {/* Auto-Dismiss Indicator (High Confidence Only) */}
        {isHighConfidence && (
          <div className={styles.autoDismissContainer}>
            <div className={styles.autoDismissText}>Auto-dismissing in 30s</div>
            <div className={styles.progressBar}>
              <div className={styles.progressBarFill} />
            </div>
          </div>
        )}

        {/* Footer Link */}
        <div className={styles.footerLink}>
          <span
            className={styles.footerLinkButton}
            onClick={handleDontSuggest}
            role="button"
            tabIndex={0}
          >
            Don't suggest for this app
          </span>
        </div>
      </Card>
    </div>
  );
};

export default SuggestionPopup;
