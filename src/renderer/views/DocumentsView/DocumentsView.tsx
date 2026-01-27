import React, { useMemo } from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  Text,
  Badge,
} from '@fluentui/react-components';
import {
  DocumentRegular,
  DocumentPdfRegular,
  DocumentTextRegular,
  DocumentTableRegular,
  DocumentDataRegular,
  DocumentImageRegular,
  LinkRegular,
  PulseRegular,
} from '@fluentui/react-icons';

/**
 * DocumentsView Component
 *
 * Enhanced document list view with:
 * - Document type icons
 * - Visual hierarchy with card depth
 * - Time-based grouping (Today, Yesterday, This Week, Earlier)
 * - Hover states and transitions
 * - Proper Fluent UI typography
 * - Empty state
 */

// ============================================
// Types
// ============================================

export interface Document {
  id: string;
  title: string;
  fileType: 'word' | 'pdf' | 'excel' | 'text' | 'image' | 'other';
  modifiedDate: Date;
  caseName?: string;
  caseNumber?: string;
  filePath?: string;
  /** Whether this document is linked to a suggested time entry */
  linkedToSuggestion?: boolean;
  /** Whether this document has recent work activity detected */
  recentActivity?: boolean;
}

export interface DocumentsViewProps {
  /** List of documents to display */
  documents?: Document[];
  /** Callback when a document is clicked */
  onDocumentClick?: (document: Document) => void;
}

// ============================================
// Time Grouping Utilities
// ============================================

type TimeGroup = 'Today' | 'Yesterday' | 'This Week' | 'Earlier';

const getTimeGroup = (date: Date): TimeGroup => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - today.getDay()); // Start of week (Sunday)

  const docDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (docDate.getTime() === today.getTime()) {
    return 'Today';
  } else if (docDate.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  } else if (docDate >= weekStart && docDate < yesterday) {
    return 'This Week';
  } else {
    return 'Earlier';
  }
};

const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;

  // For older dates, show the actual date
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// ============================================
// Styles
// ============================================

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('32px'),
    width: '100%',
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

  documentsList: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
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

const useDocumentCardStyles = makeStyles({
  card: {
    ...shorthands.padding('16px'),
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: 'var(--shadow-card)',
    ...shorthands.borderRadius('var(--radius-medium)'),
    cursor: 'pointer',
    transitionProperty: 'box-shadow, transform',
    transitionDuration: tokens.durationNormal,
    transitionTimingFunction: tokens.curveEasyEase,
    display: 'flex',
    alignItems: 'flex-start',
    ...shorthands.gap('16px'),

    ':hover': {
      boxShadow: 'var(--shadow-card-hover)',
      transform: 'translateY(-1px)',
    },

    ':active': {
      transform: 'translateY(0)',
    },
  },

  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: tokens.colorNeutralBackground3,
    flexShrink: 0,
    fontSize: '20px',
    color: tokens.colorNeutralForeground2,
  },

  content: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('4px'),
    flex: 1,
    minWidth: 0, // Allow text truncation
  },

  titleRow: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    flexWrap: 'wrap',
  },

  title: {
    fontFamily: 'Segoe UI Variable, Segoe UI, sans-serif',
    fontSize: '14px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
    lineHeight: '20px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  metadata: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    lineHeight: '16px',
  },

  caseBadge: {
    fontSize: '11px',
  },

  indicatorsRow: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
    flexWrap: 'wrap',
    marginTop: '2px',
  },

  indicator: {
    display: 'inline-flex',
    alignItems: 'center',
    ...shorthands.gap('4px'),
    fontSize: '11px',
    lineHeight: '16px',
    color: tokens.colorNeutralForeground4,
    fontFamily: 'Segoe UI Variable, Segoe UI, sans-serif',
  },

  indicatorIcon: {
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },

  indicatorLinked: {
    color: tokens.colorBrandForeground2,
  },

  indicatorActivity: {
    color: tokens.colorNeutralForeground4,
  },

  indicatorDot: {
    width: '4px',
    height: '4px',
    ...shorthands.borderRadius('50%'),
    flexShrink: 0,
  },

  indicatorDotLinked: {
    backgroundColor: tokens.colorBrandForeground2,
  },

  indicatorDotActivity: {
    backgroundColor: tokens.colorNeutralForeground4,
  },
});

// ============================================
// DocumentCard Component
// ============================================

interface DocumentCardProps {
  document: Document;
  onClick?: (document: Document) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, onClick }) => {
  const styles = useDocumentCardStyles();

  // Get appropriate icon based on file type
  const getDocumentIcon = (fileType: Document['fileType']) => {
    switch (fileType) {
      case 'word':
        return <DocumentTextRegular />;
      case 'pdf':
        return <DocumentPdfRegular />;
      case 'excel':
        return <DocumentTableRegular />;
      case 'text':
        return <DocumentDataRegular />;
      case 'image':
        return <DocumentImageRegular />;
      default:
        return <DocumentRegular />;
    }
  };

  const hasIndicators = document.linkedToSuggestion || document.recentActivity;

  const handleClick = () => {
    onClick?.(document);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(document);
    }
  };

  return (
    <Card
      className={styles.card}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Open document ${document.title}`}
    >
      <div className={styles.iconContainer}>
        {getDocumentIcon(document.fileType)}
      </div>

      <div className={styles.content}>
        <div className={styles.titleRow}>
          <Text className={styles.title} title={document.title}>
            {document.title}
          </Text>
          {document.caseName && (
            <Badge
              appearance="tint"
              size="small"
              className={styles.caseBadge}
            >
              {document.caseName}
            </Badge>
          )}
        </div>

        <Text className={styles.metadata}>
          Modified {getRelativeTime(document.modifiedDate)}
        </Text>

        {document.caseNumber && (
          <Text className={styles.metadata}>
            Case: {document.caseNumber}
          </Text>
        )}

        {hasIndicators && (
          <div className={styles.indicatorsRow}>
            {document.linkedToSuggestion && (
              <span className={`${styles.indicator} ${styles.indicatorLinked}`}>
                <span className={`${styles.indicatorDot} ${styles.indicatorDotLinked}`} />
                <span className={styles.indicatorIcon}><LinkRegular /></span>
                Linked to suggested entry
              </span>
            )}
            {document.recentActivity && (
              <span className={`${styles.indicator} ${styles.indicatorActivity}`}>
                <span className={`${styles.indicatorDot} ${styles.indicatorDotActivity}`} />
                <span className={styles.indicatorIcon}><PulseRegular /></span>
                Recent work activity
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

// ============================================
// DocumentsView Component
// ============================================

const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents = [],
  onDocumentClick,
}) => {
  const styles = useStyles();

  // Group documents by time period
  const groupedDocuments = useMemo(() => {
    const groups: Record<TimeGroup, Document[]> = {
      Today: [],
      Yesterday: [],
      'This Week': [],
      Earlier: [],
    };

    documents.forEach((doc) => {
      const group = getTimeGroup(doc.modifiedDate);
      groups[group].push(doc);
    });

    // Sort documents within each group by modified date (newest first)
    Object.keys(groups).forEach((key) => {
      groups[key as TimeGroup].sort(
        (a, b) => b.modifiedDate.getTime() - a.modifiedDate.getTime()
      );
    });

    return groups;
  }, [documents]);

  // Show empty state if no documents
  if (documents.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateIcon}>
          <DocumentRegular />
        </div>
        <Text className={styles.emptyStateTitle}>No documents yet</Text>
        <Text className={styles.emptyStateDescription}>
          Documents you create or upload will appear here. Get started by creating your first document.
        </Text>
      </div>
    );
  }

  // Render document groups
  const timeGroups: TimeGroup[] = ['Today', 'Yesterday', 'This Week', 'Earlier'];

  return (
    <div className={styles.container}>
      {timeGroups.map((group) => {
        const docs = groupedDocuments[group];
        if (docs.length === 0) return null;

        return (
          <div key={group} className={styles.sectionGroup}>
            <Text className={styles.sectionHeader}>{group}</Text>
            <div className={styles.documentsList}>
              {docs.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  onClick={onDocumentClick}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DocumentsView;
