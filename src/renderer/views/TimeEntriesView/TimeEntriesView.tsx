import React, { useMemo, useState } from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  Text,
  Badge,
  Button,
  Checkbox,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  Input,
} from '@fluentui/react-components';
import {
  ClockRegular,
  CheckmarkRegular,
  EditRegular,
  DeleteRegular,
  CalendarRegular,
  BriefcaseRegular,
  SparkleRegular,
  DocumentTextRegular,
  CheckmarkCircleFilled,
  DeleteDismissFilled,
  EditFilled,
  DismissRegular,
} from '@fluentui/react-icons';

/**
 * TimeEntriesView Component
 *
 * Core to the PRD's value proposition with:
 * - Time entry cards with case/matter, task description, duration, time range
 * - Status badge color system (Pending, Confirmed, Synced, Failed)
 * - Auto-captured vs Manual entry indicators
 * - Date-based grouping (Today, Yesterday, specific dates)
 * - Summary stats (total time today, pending count, synced count)
 * - Bulk selection with toolbar actions
 * - Card elevation on hover
 * - Action buttons: Confirm, Edit, Delete
 */

// ============================================
// Types
// ============================================

export type TimeEntryStatus = 'Pending' | 'Confirmed' | 'Synced' | 'Failed';
export type TimeEntrySource = 'Auto-captured' | 'Manual';

export interface TimeEntry {
  id: string;
  caseName: string;
  caseNumber: string;
  taskDescription: string;
  duration: number; // Duration in minutes
  startTime: Date;
  endTime: Date;
  status: TimeEntryStatus;
  source: TimeEntrySource;
  date: Date;
}

export interface TimeEntriesViewProps {
  /** List of time entries to display */
  timeEntries?: TimeEntry[];
  /** Callback when confirm is clicked */
  onConfirm?: (entry: TimeEntry) => void;
  /** Callback when edit is clicked */
  onEdit?: (entry: TimeEntry) => void;
  /** Callback when delete is clicked */
  onDelete?: (entry: TimeEntry) => void;
  /** Callback when bulk confirm is clicked */
  onBulkConfirm?: (entries: TimeEntry[]) => void;
  /** Callback when bulk delete is clicked */
  onBulkDelete?: (entries: TimeEntry[]) => void;
}

// ============================================
// Status Badge Configuration (from PRD)
// ============================================

interface StatusConfig {
  color: string;
  backgroundColor: string;
  label: string;
}

const getStatusConfig = (status: TimeEntryStatus): StatusConfig => {
  switch (status) {
    case 'Pending':
      return {
        color: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        label: 'Pending',
      };
    case 'Confirmed':
      return {
        color: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        label: 'Confirmed',
      };
    case 'Synced':
      return {
        color: '#6EE7B7',
        backgroundColor: 'rgba(110, 231, 183, 0.1)',
        label: 'Synced',
      };
    case 'Failed':
      return {
        color: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        label: 'Failed',
      };
  }
};

// ============================================
// Date Grouping Utilities
// ============================================

type DateGroup = 'Today' | 'Yesterday' | string; // string for actual dates

const getDateGroup = (date: Date): DateGroup => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const entryDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (entryDate.getTime() === today.getTime()) {
    return 'Today';
  } else if (entryDate.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  } else {
    // Return formatted date string for other dates
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }
};

// ============================================
// Time Formatting Utilities
// ============================================

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins}m`;
  } else if (mins === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${mins}m`;
  }
};

const formatTimeRange = (startTime: Date, endTime: Date): string => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};

// ============================================
// Summary Stats Utilities
// ============================================

interface SummaryStats {
  totalTimeToday: number; // in minutes
  pendingCount: number;
  syncedCount: number;
}

const calculateSummaryStats = (entries: TimeEntry[]): SummaryStats => {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const todayEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date.getFullYear(), entry.date.getMonth(), entry.date.getDate());
    return entryDate.getTime() === todayStart.getTime();
  });

  const totalTimeToday = todayEntries.reduce((sum, entry) => sum + entry.duration, 0);
  const pendingCount = entries.filter(entry => entry.status === 'Pending').length;
  const syncedCount = entries.filter(entry => entry.status === 'Synced').length;

  return { totalTimeToday, pendingCount, syncedCount };
};

// ============================================
// Styles
// ============================================

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('24px'),
    width: '100%',
  },

  summaryBar: {
    display: 'flex',
    ...shorthands.gap('16px'),
    flexWrap: 'wrap',
    ...shorthands.padding('20px'),
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius('var(--radius-medium)'),
  },

  summaryCard: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('4px'),
    ...shorthands.padding('12px', '16px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius('var(--radius-medium)'),
    minWidth: '140px',
    boxShadow: 'var(--shadow-card)',
  },

  summaryLabel: {
    fontSize: '12px',
    fontWeight: '500',
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  summaryValue: {
    fontSize: '24px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
    lineHeight: '32px',
  },

  summarySubtext: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
  },

  bulkToolbar: {
    backgroundColor: tokens.colorBrandBackground,
    ...shorthands.padding('12px', '16px'),
    ...shorthands.borderRadius('var(--radius-medium)'),
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
  },

  bulkToolbarText: {
    color: tokens.colorNeutralForegroundOnBrand,
    fontWeight: '600',
    fontSize: '14px',
  },

  sectionGroup: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('12px'),
  },

  sectionHeader: {
    fontSize: '12px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '4px',
  },

  entriesList: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('12px'),
  },

  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.padding('64px', '24px'),
    ...shorthands.gap('12px'),
    textAlign: 'center',
  },

  emptyStateIcon: {
    fontSize: '48px',
    color: tokens.colorNeutralForeground4,
    marginBottom: '8px',
  },

  emptyStateTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground2,
  },

  emptyStateDescription: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground3,
    maxWidth: '400px',
  },
});

const useTimeEntryCardStyles = makeStyles({
  card: {
    ...shorthands.padding('16px', '20px'),
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: 'var(--shadow-card)',
    ...shorthands.borderRadius('var(--radius-medium)'),
    cursor: 'pointer',
    transitionProperty: 'box-shadow, transform',
    transitionDuration: tokens.durationNormal,
    transitionTimingFunction: tokens.curveEasyEase,
    position: 'relative',
    display: 'flex',
    ...shorthands.gap('16px'),

    ':hover': {
      boxShadow: 'var(--shadow-card-hover)',
      transform: 'translateY(-1px)',
    },

    ':active': {
      transform: 'translateY(0)',
    },

    ':focus-visible': {
      ...shorthands.outline('2px', 'solid', tokens.colorBrandStroke1),
      outlineOffset: '2px',
    },
  },

  checkboxContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    paddingTop: '2px',
  },

  content: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('12px'),
    flex: 1,
    minWidth: 0,
  },

  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    ...shorthands.gap('16px'),
    flexWrap: 'wrap',
  },

  leftHeader: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('6px'),
    flex: 1,
    minWidth: 0,
  },

  caseRow: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },

  caseIcon: {
    fontSize: '16px',
    color: tokens.colorBrandForeground1,
    flexShrink: 0,
  },

  caseName: {
    fontFamily: 'Segoe UI Variable, Segoe UI, sans-serif',
    fontSize: '15px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
    lineHeight: '20px',
  },

  caseNumber: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground3,
    fontWeight: '500',
  },

  taskDescription: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground2,
    lineHeight: '18px',
  },

  durationSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    ...shorthands.gap('4px'),
  },

  duration: {
    fontSize: '20px',
    fontWeight: '700',
    color: tokens.colorBrandForeground1,
    lineHeight: '26px',
  },

  timeRange: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    fontWeight: '500',
  },

  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.gap('16px'),
    flexWrap: 'wrap',
  },

  statusSourceRow: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
  },

  statusBadge: {
    fontSize: '11px',
    fontWeight: '600',
    ...shorthands.padding('4px', '10px'),
    ...shorthands.borderRadius('10px'),
  },

  sourceIndicator: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('4px'),
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    fontWeight: '500',
  },

  sourceIcon: {
    fontSize: '14px',
  },

  sourceIconAuto: {
    color: tokens.colorBrandForeground1,
  },

  sourceIconManual: {
    color: tokens.colorNeutralForeground3,
  },

  actionButtons: {
    display: 'flex',
    ...shorthands.gap('6px'),
  },

  actionButton: {
    minWidth: '32px',
    height: '32px',
  },
});

// ============================================
// TimeEntryCard Component
// ============================================

interface TimeEntryCardProps {
  entry: TimeEntry;
  isSelected: boolean;
  onSelect: (id: string, selected: boolean) => void;
  onConfirm?: (entry: TimeEntry) => void;
  onEdit?: (entry: TimeEntry) => void;
  onDelete?: (entry: TimeEntry) => void;
}

const TimeEntryCard: React.FC<TimeEntryCardProps> = ({
  entry,
  isSelected,
  onSelect,
  onConfirm,
  onEdit,
  onDelete,
}) => {
  const styles = useTimeEntryCardStyles();
  const statusConfig = getStatusConfig(entry.status);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onSelect(entry.id, e.target.checked);
  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    onConfirm?.(entry);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(entry);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(entry);
  };

  const isAutoCapture = entry.source === 'Auto-captured';

  return (
    <Card className={styles.card}>
      <div className={styles.checkboxContainer}>
        <Checkbox
          checked={isSelected}
          onChange={handleCheckboxChange}
          aria-label={`Select time entry for ${entry.caseName}`}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.leftHeader}>
            <div className={styles.caseRow}>
              <BriefcaseRegular className={styles.caseIcon} />
              <div>
                <Text className={styles.caseName}>{entry.caseName}</Text>
                <Text className={styles.caseNumber}> • {entry.caseNumber}</Text>
              </div>
            </div>
            <Text className={styles.taskDescription}>{entry.taskDescription}</Text>
          </div>

          <div className={styles.durationSection}>
            <Text className={styles.duration}>{formatDuration(entry.duration)}</Text>
            <Text className={styles.timeRange}>
              {formatTimeRange(entry.startTime, entry.endTime)}
            </Text>
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.statusSourceRow}>
            <Badge
              className={styles.statusBadge}
              style={{
                color: statusConfig.color,
                backgroundColor: statusConfig.backgroundColor,
              }}
            >
              {statusConfig.label}
            </Badge>

            <div className={styles.sourceIndicator}>
              {isAutoCapture ? (
                <>
                  <SparkleRegular className={`${styles.sourceIcon} ${styles.sourceIconAuto}`} />
                  <Text>Auto-captured</Text>
                </>
              ) : (
                <>
                  <DocumentTextRegular className={`${styles.sourceIcon} ${styles.sourceIconManual}`} />
                  <Text>Manual</Text>
                </>
              )}
            </div>
          </div>

          <div className={styles.actionButtons}>
            {entry.status === 'Pending' && (
              <Button
                appearance="subtle"
                size="small"
                className={styles.actionButton}
                icon={<CheckmarkRegular />}
                onClick={handleConfirm}
                aria-label="Confirm time entry"
                title="Confirm"
              />
            )}
            <Button
              appearance="subtle"
              size="small"
              className={styles.actionButton}
              icon={<EditRegular />}
              onClick={handleEdit}
              aria-label="Edit time entry"
              title="Edit"
            />
            <Button
              appearance="subtle"
              size="small"
              className={styles.actionButton}
              icon={<DeleteRegular />}
              onClick={handleDelete}
              aria-label="Delete time entry"
              title="Delete"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

// ============================================
// Suggested Time Entry Types & Mock Data
// ============================================

export interface SuggestedTimeEntry {
  id: string;
  caseName: string;
  caseNumber: string;
  taskType: string;
  description: string;
  duration: number; // in hours (decimal)
}

const suggestedTimeEntries: SuggestedTimeEntry[] = [
  {
    id: 'sug-1',
    caseName: 'Johnson v. Tech Corp',
    caseNumber: '2024-CV-1234',
    taskType: 'Client Communication',
    description: 'Reviewed and responded to client email regarding discovery deadline',
    duration: 0.3,
  },
  {
    id: 'sug-2',
    caseName: 'ABC Corp Matter',
    caseNumber: '2024-CV-9999',
    taskType: 'Document Review',
    description: 'Reviewed contract amendments and tracked changes in agreement draft',
    duration: 1.2,
  },
  {
    id: 'sug-3',
    caseName: 'Anderson v. State',
    caseNumber: '2024-CR-7890',
    taskType: 'Legal Research',
    description: 'Researched case law precedents for summary judgment motion',
    duration: 0.5,
  },
];

// ============================================
// Suggested Card Styles
// ============================================

const useSuggestedCardStyles = makeStyles({
  card: {
    ...shorthands.padding('16px', '20px'),
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: 'var(--shadow-card)',
    ...shorthands.borderRadius('var(--radius-medium)'),
    transitionProperty: 'box-shadow, transform, opacity',
    transitionDuration: '300ms',
    transitionTimingFunction: tokens.curveEasyEase,
    position: 'relative',

    ':hover': {
      boxShadow: 'var(--shadow-card-hover)',
      transform: 'translateY(-1px)',
    },

    ':focus-visible': {
      ...shorthands.outline('2px', 'solid', tokens.colorBrandStroke1),
      outlineOffset: '2px',
    },
  },

  cardDismissed: {
    opacity: 0.35,
    transform: 'scale(0.98) !important' as any,
    pointerEvents: 'none' as any,
  },

  content: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('12px'),
  },

  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    ...shorthands.gap('16px'),
    flexWrap: 'wrap',
  },

  leftHeader: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
    flex: 1,
    minWidth: 0,
  },

  badgeRow: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('10px'),
  },

  badge: {
    fontSize: '11px',
    fontWeight: '600',
    ...shorthands.padding('4px', '10px'),
    ...shorthands.borderRadius('10px'),
  },

  taskType: {
    fontSize: '13px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground2,
  },

  caseRow: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },

  caseIcon: {
    fontSize: '16px',
    color: tokens.colorBrandForeground1,
    flexShrink: 0,
  },

  caseName: {
    fontFamily: 'Segoe UI Variable, Segoe UI, sans-serif',
    fontSize: '15px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
    lineHeight: '20px',
  },

  caseNumber: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground3,
    fontWeight: '500',
  },

  description: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground2,
    lineHeight: '18px',
  },

  durationSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    flexShrink: 0,
  },

  duration: {
    fontSize: '20px',
    fontWeight: '700',
    color: tokens.colorBrandForeground1,
    lineHeight: '26px',
  },

  durationUnit: {
    fontSize: '13px',
    fontWeight: '500',
    color: tokens.colorNeutralForeground3,
  },

  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  actionButtons: {
    display: 'flex',
    ...shorthands.gap('8px'),
  },

  confirmedMessage: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('6px'),
  },

  dismissedMessage: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('6px'),
  },

  editFields: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('10px'),
    ...shorthands.padding('4px', '0'),
  },

  editRow: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('4px'),
  },

  editLabel: {
    fontSize: '12px',
    fontWeight: '500',
    color: tokens.colorNeutralForeground3,
  },

  suggestedSection: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('16px'),
  },

  suggestedHeader: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('6px'),
  },

  suggestedTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
    lineHeight: '22px',
  },

  suggestedSubtitle: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground3,
    lineHeight: '18px',
    maxWidth: '600px',
  },

  suggestedList: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('12px'),
  },
});

// ============================================
// SuggestedTimeEntryCard Component
// ============================================

type SuggestedCardState = 'suggested' | 'confirmed' | 'dismissed';

const SuggestedTimeEntryCard: React.FC<{ entry: SuggestedTimeEntry }> = ({ entry }) => {
  const styles = useSuggestedCardStyles();
  const [cardState, setCardState] = useState<SuggestedCardState>('suggested');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    duration: entry.duration.toString(),
    taskType: entry.taskType,
    description: entry.description,
  });

  const handleConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCardState('confirmed');
    setIsEditing(false);
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCardState('dismissed');
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(false);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditData({
      duration: entry.duration.toString(),
      taskType: entry.taskType,
      description: entry.description,
    });
    setIsEditing(false);
  };

  const getBadgeConfig = () => {
    switch (cardState) {
      case 'suggested':
        return { label: 'Suggested', color: '#005A9E', bg: 'rgba(0, 90, 158, 0.1)' };
      case 'confirmed':
        return { label: 'Confirmed', color: '#0E7C0E', bg: 'rgba(14, 124, 14, 0.1)' };
      case 'dismissed':
        return { label: 'Dismissed', color: '#6B7280', bg: 'rgba(107, 114, 128, 0.1)' };
    }
  };

  const badge = getBadgeConfig();
  const displayDuration = parseFloat(editData.duration) || 0;

  const cardClassName = [
    styles.card,
    cardState === 'dismissed' ? styles.cardDismissed : '',
  ].filter(Boolean).join(' ');

  return (
    <Card className={cardClassName}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.leftHeader}>
            {/* Badge and Task Type */}
            <div className={styles.badgeRow}>
              <Badge
                className={styles.badge}
                style={{ color: badge.color, backgroundColor: badge.bg }}
              >
                {badge.label}
              </Badge>
              {!isEditing && (
                <Text className={styles.taskType}>{editData.taskType}</Text>
              )}
            </div>

            {/* Case name */}
            <div className={styles.caseRow}>
              <BriefcaseRegular className={styles.caseIcon} />
              <Text className={styles.caseName}>{entry.caseName}</Text>
              <Text className={styles.caseNumber}>• {entry.caseNumber}</Text>
            </div>

            {/* Description or edit fields */}
            {isEditing ? (
              <div className={styles.editFields}>
                <div className={styles.editRow}>
                  <label className={styles.editLabel}>Task Type</label>
                  <Input
                    value={editData.taskType}
                    onChange={(_e, data) => setEditData(prev => ({ ...prev, taskType: data.value }))}
                    size="small"
                  />
                </div>
                <div className={styles.editRow}>
                  <label className={styles.editLabel}>Duration (hrs)</label>
                  <Input
                    value={editData.duration}
                    onChange={(_e, data) => setEditData(prev => ({ ...prev, duration: data.value }))}
                    size="small"
                    type="number"
                    step={0.1}
                    min={0}
                  />
                </div>
                <div className={styles.editRow}>
                  <label className={styles.editLabel}>Description</label>
                  <Input
                    value={editData.description}
                    onChange={(_e, data) => setEditData(prev => ({ ...prev, description: data.value }))}
                    size="small"
                  />
                </div>
              </div>
            ) : (
              <Text className={styles.description}>{editData.description}</Text>
            )}
          </div>

          {/* Duration display */}
          {!isEditing && (
            <div className={styles.durationSection}>
              <Text className={styles.duration}>
                {displayDuration.toFixed(1)}{' '}
                <span className={styles.durationUnit}>hrs</span>
              </Text>
            </div>
          )}
        </div>

        {/* Actions footer */}
        <div className={styles.footer}>
          {cardState === 'suggested' && (
            <div className={styles.actionButtons}>
              {isEditing ? (
                <>
                  <Button
                    appearance="primary"
                    size="small"
                    icon={<CheckmarkRegular />}
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                  <Button
                    appearance="subtle"
                    size="small"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    appearance="primary"
                    size="small"
                    icon={<CheckmarkRegular />}
                    onClick={handleConfirm}
                  >
                    Confirm
                  </Button>
                  <Button
                    appearance="subtle"
                    size="small"
                    icon={<EditRegular />}
                    onClick={handleEdit}
                  >
                    Edit
                  </Button>
                  <Button
                    appearance="subtle"
                    size="small"
                    icon={<DismissRegular />}
                    onClick={handleDismiss}
                  >
                    Dismiss
                  </Button>
                </>
              )}
            </div>
          )}

          {cardState === 'confirmed' && (
            <div className={styles.confirmedMessage}>
              <CheckmarkCircleFilled style={{ color: '#0E7C0E', fontSize: '16px' }} />
              <Text style={{ color: '#0E7C0E', fontSize: '13px', fontWeight: '500' }}>
                Entry confirmed
              </Text>
            </div>
          )}

          {cardState === 'dismissed' && (
            <div className={styles.dismissedMessage}>
              <Text style={{ color: '#6B7280', fontSize: '13px', fontWeight: '500' }}>
                Entry dismissed
              </Text>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

// ============================================
// SuggestedEntriesSection Component
// ============================================

const SuggestedEntriesSection: React.FC = () => {
  const styles = useSuggestedCardStyles();

  return (
    <div className={styles.suggestedSection}>
      <div className={styles.suggestedHeader}>
        <Text className={styles.suggestedTitle}>Suggested Time Entries</Text>
        <Text className={styles.suggestedSubtitle}>
          Based on your recent activity, the following time entries may be relevant.
          Review and confirm to add them to your records.
        </Text>
      </div>
      <div className={styles.suggestedList}>
        {suggestedTimeEntries.map((entry) => (
          <SuggestedTimeEntryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
};

// ============================================
// SummaryStatsBar Component
// ============================================

interface SummaryStatsBarProps {
  stats: SummaryStats;
}

const SummaryStatsBar: React.FC<SummaryStatsBarProps> = ({ stats }) => {
  const styles = useStyles();

  return (
    <div className={styles.summaryBar}>
      <div className={styles.summaryCard}>
        <Text className={styles.summaryLabel}>Total Time Today</Text>
        <Text className={styles.summaryValue}>{formatDuration(stats.totalTimeToday)}</Text>
        <Text className={styles.summarySubtext}>Across all entries</Text>
      </div>

      <div className={styles.summaryCard}>
        <Text className={styles.summaryLabel}>Pending Entries</Text>
        <Text className={styles.summaryValue}>{stats.pendingCount}</Text>
        <Text className={styles.summarySubtext}>Awaiting confirmation</Text>
      </div>

      <div className={styles.summaryCard}>
        <Text className={styles.summaryLabel}>Synced Entries</Text>
        <Text className={styles.summaryValue}>{stats.syncedCount}</Text>
        <Text className={styles.summarySubtext}>Successfully synced</Text>
      </div>
    </div>
  );
};

// ============================================
// BulkActionToolbar Component
// ============================================

interface BulkActionToolbarProps {
  selectedCount: number;
  onConfirmAll?: () => void;
  onDeleteAll?: () => void;
  onClearSelection?: () => void;
}

const BulkActionToolbar: React.FC<BulkActionToolbarProps> = ({
  selectedCount,
  onConfirmAll,
  onDeleteAll,
  onClearSelection,
}) => {
  const styles = useStyles();

  return (
    <div className={styles.bulkToolbar}>
      <Text className={styles.bulkToolbarText}>
        {selectedCount} {selectedCount === 1 ? 'entry' : 'entries'} selected
      </Text>
      <Toolbar>
        <ToolbarButton
          appearance="subtle"
          icon={<CheckmarkCircleFilled />}
          onClick={onConfirmAll}
        >
          Confirm Selected
        </ToolbarButton>
        <ToolbarDivider />
        <ToolbarButton
          appearance="subtle"
          icon={<EditFilled />}
        >
          Edit Selected
        </ToolbarButton>
        <ToolbarDivider />
        <ToolbarButton
          appearance="subtle"
          icon={<DeleteDismissFilled />}
          onClick={onDeleteAll}
        >
          Delete Selected
        </ToolbarButton>
        <ToolbarDivider />
        <ToolbarButton
          appearance="subtle"
          onClick={onClearSelection}
        >
          Clear Selection
        </ToolbarButton>
      </Toolbar>
    </div>
  );
};

// ============================================
// TimeEntriesView Component
// ============================================

const TimeEntriesView: React.FC<TimeEntriesViewProps> = ({
  timeEntries = [],
  onConfirm,
  onEdit,
  onDelete,
  onBulkConfirm,
  onBulkDelete,
}) => {
  const styles = useStyles();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    return calculateSummaryStats(timeEntries);
  }, [timeEntries]);

  // Group entries by date
  const groupedEntries = useMemo(() => {
    const groups: Map<DateGroup, TimeEntry[]> = new Map();

    // Sort entries by date (most recent first)
    const sortedEntries = [...timeEntries].sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );

    sortedEntries.forEach((entry) => {
      const group = getDateGroup(entry.date);
      if (!groups.has(group)) {
        groups.set(group, []);
      }
      groups.get(group)!.push(entry);
    });

    // Sort entries within each group by start time (most recent first)
    groups.forEach((entries) => {
      entries.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
    });

    return groups;
  }, [timeEntries]);

  // Handle selection
  const handleSelect = (id: string, selected: boolean) => {
    const newSelectedIds = new Set(selectedIds);
    if (selected) {
      newSelectedIds.add(id);
    } else {
      newSelectedIds.delete(id);
    }
    setSelectedIds(newSelectedIds);
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleBulkConfirm = () => {
    const selectedEntries = timeEntries.filter(entry => selectedIds.has(entry.id));
    onBulkConfirm?.(selectedEntries);
    setSelectedIds(new Set());
  };

  const handleBulkDelete = () => {
    const selectedEntries = timeEntries.filter(entry => selectedIds.has(entry.id));
    onBulkDelete?.(selectedEntries);
    setSelectedIds(new Set());
  };

  // Show suggested entries when no confirmed entries exist
  if (timeEntries.length === 0) {
    return (
      <div className={styles.container}>
        <SuggestedEntriesSection />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Summary Stats */}
      <SummaryStatsBar stats={summaryStats} />

      {/* Bulk Action Toolbar */}
      {selectedIds.size > 0 && (
        <BulkActionToolbar
          selectedCount={selectedIds.size}
          onConfirmAll={handleBulkConfirm}
          onDeleteAll={handleBulkDelete}
          onClearSelection={handleClearSelection}
        />
      )}

      {/* Grouped Time Entries */}
      {Array.from(groupedEntries.entries()).map(([dateGroup, entries]) => (
        <div key={dateGroup} className={styles.sectionGroup}>
          <Text className={styles.sectionHeader}>{dateGroup}</Text>
          <div className={styles.entriesList}>
            {entries.map((entry) => (
              <TimeEntryCard
                key={entry.id}
                entry={entry}
                isSelected={selectedIds.has(entry.id)}
                onSelect={handleSelect}
                onConfirm={onConfirm}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimeEntriesView;
