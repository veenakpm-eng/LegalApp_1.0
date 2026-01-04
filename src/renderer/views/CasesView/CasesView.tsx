import React, { useMemo, useState } from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  Text,
  Badge,
  Button,
} from '@fluentui/react-components';
import {
  BriefcaseRegular,
  CalendarRegular,
  DocumentBulletListRegular,
  ClockRegular,
  PersonRegular,
} from '@fluentui/react-icons';

/**
 * CasesView Component
 *
 * Enhanced case list view with:
 * - Semantic status color coding
 * - Case cards with hover states
 * - Quick action menu on hover
 * - Filtering by case status
 * - Keyboard navigation support
 * - Case count display
 * - Next hearing/deadline tracking
 */

// ============================================
// Types
// ============================================

export type CaseStatus = 'In Progress' | 'Discovery' | 'Settlement Review' | 'Closed';

export interface Case {
  id: string;
  caseNumber: string;
  status: CaseStatus;
  clientName?: string;
  nextHearingDate?: Date;
  deadlineDate?: Date;
  description?: string;
  createdDate: Date;
}

export interface CasesViewProps {
  /** List of cases to display */
  cases?: Case[];
  /** Callback when a case is clicked */
  onCaseClick?: (caseItem: Case) => void;
  /** Callback when "View Details" is clicked */
  onViewDetails?: (caseItem: Case) => void;
  /** Callback when "Add Time Entry" is clicked */
  onAddTimeEntry?: (caseItem: Case) => void;
  /** Callback when "View Documents" is clicked */
  onViewDocuments?: (caseItem: Case) => void;
}

// ============================================
// Filter Types
// ============================================

type FilterType = 'All Cases' | 'Active' | 'Pending Action' | 'Closed';

const getFilteredCases = (cases: Case[], filter: FilterType): Case[] => {
  switch (filter) {
    case 'All Cases':
      return cases;
    case 'Active':
      return cases.filter(c => c.status === 'In Progress' || c.status === 'Discovery');
    case 'Pending Action':
      return cases.filter(c => c.status === 'Settlement Review');
    case 'Closed':
      return cases.filter(c => c.status === 'Closed');
    default:
      return cases;
  }
};

// ============================================
// Status Badge Configuration
// ============================================

interface StatusConfig {
  color: string;
  backgroundColor: string;
}

const getStatusConfig = (status: CaseStatus): StatusConfig => {
  switch (status) {
    case 'In Progress':
      return {
        color: '#2E75B6',
        backgroundColor: 'rgba(46, 117, 182, 0.1)',
      };
    case 'Discovery':
      return {
        color: '#7B68EE',
        backgroundColor: 'rgba(123, 104, 238, 0.1)',
      };
    case 'Settlement Review':
      return {
        color: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
      };
    case 'Closed':
      return {
        color: '#6B7280',
        backgroundColor: 'rgba(107, 114, 128, 0.1)',
      };
  }
};

// ============================================
// Date Formatting Utilities
// ============================================

const formatDate = (date: Date): string => {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays < 0 && diffDays >= -1) return 'Yesterday';
  if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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

  filterBar: {
    display: 'flex',
    ...shorthands.gap('12px'),
    flexWrap: 'wrap',
  },

  filterButton: {
    minWidth: '100px',
  },

  sectionHeader: {
    fontSize: '12px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '12px',
  },

  casesList: {
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

const useCaseCardStyles = makeStyles({
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

  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('12px'),
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.gap('16px'),
    flexWrap: 'wrap',
  },

  caseNumberRow: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
  },

  caseIcon: {
    fontSize: '20px',
    color: tokens.colorBrandForeground1,
  },

  caseNumber: {
    fontFamily: 'Segoe UI Variable, Segoe UI, sans-serif',
    fontSize: '16px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
    lineHeight: '22px',
  },

  statusBadge: {
    fontSize: '12px',
    fontWeight: '600',
    ...shorthands.padding('4px', '12px'),
    ...shorthands.borderRadius('12px'),
  },

  infoRow: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('24px'),
    flexWrap: 'wrap',
  },

  infoItem: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('6px'),
  },

  infoIcon: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground3,
  },

  infoText: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground2,
    lineHeight: '18px',
  },

  clientName: {
    fontWeight: '500',
  },

  deadlineText: {
    fontWeight: '500',
  },

  quickActions: {
    display: 'flex',
    ...shorthands.gap('8px'),
    ...shorthands.padding('12px', '0', '0', '0'),
    ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke2),
    marginTop: '4px',
    opacity: 0,
    maxHeight: 0,
    overflow: 'hidden',
    transitionProperty: 'opacity, max-height, padding',
    transitionDuration: tokens.durationNormal,
    transitionTimingFunction: tokens.curveEasyEase,
  },

  quickActionsVisible: {
    opacity: 1,
    maxHeight: '60px',
  },

  actionButton: {
    fontSize: '12px',
  },
});

// ============================================
// CaseCard Component
// ============================================

interface CaseCardProps {
  caseItem: Case;
  onClick?: (caseItem: Case) => void;
  onViewDetails?: (caseItem: Case) => void;
  onAddTimeEntry?: (caseItem: Case) => void;
  onViewDocuments?: (caseItem: Case) => void;
}

const CaseCard: React.FC<CaseCardProps> = ({
  caseItem,
  onClick,
  onViewDetails,
  onAddTimeEntry,
  onViewDocuments,
}) => {
  const styles = useCaseCardStyles();
  const [isHovered, setIsHovered] = useState(false);
  const statusConfig = getStatusConfig(caseItem.status);

  const handleClick = (e: React.MouseEvent) => {
    // Don't trigger card click if clicking on action buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onClick?.(caseItem);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(caseItem);
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails?.(caseItem);
  };

  const handleAddTimeEntry = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddTimeEntry?.(caseItem);
  };

  const handleViewDocuments = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDocuments?.(caseItem);
  };

  const nextDate = caseItem.nextHearingDate || caseItem.deadlineDate;

  return (
    <Card
      className={styles.card}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={0}
      role="button"
      aria-label={`Case ${caseItem.caseNumber}, Status: ${caseItem.status}`}
    >
      <div className={styles.cardContent}>
        <div className={styles.header}>
          <div className={styles.caseNumberRow}>
            <BriefcaseRegular className={styles.caseIcon} />
            <Text className={styles.caseNumber}>
              {caseItem.caseNumber}
            </Text>
          </div>

          <Badge
            className={styles.statusBadge}
            style={{
              color: statusConfig.color,
              backgroundColor: statusConfig.backgroundColor,
            }}
          >
            {caseItem.status}
          </Badge>
        </div>

        <div className={styles.infoRow}>
          {caseItem.clientName && (
            <div className={styles.infoItem}>
              <PersonRegular className={styles.infoIcon} />
              <Text className={`${styles.infoText} ${styles.clientName}`}>
                {caseItem.clientName}
              </Text>
            </div>
          )}

          {nextDate && (
            <div className={styles.infoItem}>
              <CalendarRegular className={styles.infoIcon} />
              <Text className={`${styles.infoText} ${styles.deadlineText}`}>
                {caseItem.nextHearingDate ? 'Hearing: ' : 'Deadline: '}
                {formatDate(nextDate)}
              </Text>
            </div>
          )}
        </div>

        {caseItem.description && (
          <Text className={styles.infoText}>
            {caseItem.description}
          </Text>
        )}

        <div className={`${styles.quickActions} ${isHovered ? styles.quickActionsVisible : ''}`}>
          <Button
            appearance="subtle"
            size="small"
            className={styles.actionButton}
            onClick={handleViewDetails}
            icon={<DocumentBulletListRegular />}
          >
            View Details
          </Button>
          <Button
            appearance="subtle"
            size="small"
            className={styles.actionButton}
            onClick={handleAddTimeEntry}
            icon={<ClockRegular />}
          >
            Add Time Entry
          </Button>
          <Button
            appearance="subtle"
            size="small"
            className={styles.actionButton}
            onClick={handleViewDocuments}
            icon={<DocumentBulletListRegular />}
          >
            View Documents
          </Button>
        </div>
      </div>
    </Card>
  );
};

// ============================================
// CasesView Component
// ============================================

const CasesView: React.FC<CasesViewProps> = ({
  cases = [],
  onCaseClick,
  onViewDetails,
  onAddTimeEntry,
  onViewDocuments,
}) => {
  const styles = useStyles();
  const [activeFilter, setActiveFilter] = useState<FilterType>('All Cases');

  const filteredCases = useMemo(() => {
    return getFilteredCases(cases, activeFilter);
  }, [cases, activeFilter]);

  const filters: FilterType[] = ['All Cases', 'Active', 'Pending Action', 'Closed'];

  // Show empty state if no cases
  if (cases.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateIcon}>
          <BriefcaseRegular />
        </div>
        <Text className={styles.emptyStateTitle}>No cases yet</Text>
        <Text className={styles.emptyStateDescription}>
          Cases you create will appear here. Get started by creating your first case.
        </Text>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Filter Bar */}
      <div className={styles.filterBar}>
        {filters.map((filter) => (
          <Button
            key={filter}
            appearance={activeFilter === filter ? 'primary' : 'subtle'}
            size="small"
            className={styles.filterButton}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </Button>
        ))}
      </div>

      {/* Cases List */}
      <div>
        <Text className={styles.sectionHeader}>
          {activeFilter} ({filteredCases.length})
        </Text>

        {filteredCases.length === 0 ? (
          <div className={styles.emptyState}>
            <Text className={styles.emptyStateDescription}>
              No cases match the current filter.
            </Text>
          </div>
        ) : (
          <div className={styles.casesList}>
            {filteredCases.map((caseItem) => (
              <CaseCard
                key={caseItem.id}
                caseItem={caseItem}
                onClick={onCaseClick}
                onViewDetails={onViewDetails}
                onAddTimeEntry={onAddTimeEntry}
                onViewDocuments={onViewDocuments}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CasesView;
