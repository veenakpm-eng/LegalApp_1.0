import React from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Text,
} from '@fluentui/react-components';
import {
  MailRegular,
  DocumentTextRegular,
  CallRegular,
} from '@fluentui/react-icons';

/**
 * ActivityView Component
 *
 * Displays a vertical daily activity timeline grouped by day.
 * Each activity block shows:
 * - App/activity type with icon and color accent
 * - Duration
 * - Time range (e.g., 2:10–2:28 PM)
 *
 * Uses mock data only. No charts, analytics, or metrics.
 */

// ============================================
// Types
// ============================================

type ActivityType = 'email' | 'document' | 'phone';

interface ActivityEvent {
  id: string;
  type: ActivityType;
  label: string;
  description: string;
  startTime: Date;
  endTime: Date;
}

// ============================================
// Activity Type Configuration
// ============================================

interface ActivityTypeConfig {
  icon: React.ReactElement;
  displayName: string;
  accentColor: string;
  accentBg: string;
}

const getActivityTypeConfig = (type: ActivityType): ActivityTypeConfig => {
  switch (type) {
    case 'email':
      return {
        icon: <MailRegular />,
        displayName: 'Outlook Email',
        accentColor: '#0078D4',
        accentBg: 'rgba(0, 120, 212, 0.08)',
      };
    case 'document':
      return {
        icon: <DocumentTextRegular />,
        displayName: 'Word Document',
        accentColor: '#2B579A',
        accentBg: 'rgba(43, 87, 154, 0.08)',
      };
    case 'phone':
      return {
        icon: <CallRegular />,
        displayName: 'Phone Call',
        accentColor: '#107C10',
        accentBg: 'rgba(16, 124, 16, 0.08)',
      };
  }
};

// ============================================
// Time Formatting Utilities
// ============================================

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const formatTimeRange = (start: Date, end: Date): string => {
  const startStr = formatTime(start);
  const endStr = formatTime(end);
  // Remove duplicate AM/PM if both are the same period
  const startPeriod = start.getHours() < 12 ? 'AM' : 'PM';
  const endPeriod = end.getHours() < 12 ? 'AM' : 'PM';
  if (startPeriod === endPeriod) {
    return `${startStr.replace(` ${startPeriod}`, '')}\u2013${endStr}`;
  }
  return `${startStr}\u2013${endStr}`;
};

const formatDuration = (startTime: Date, endTime: Date): string => {
  const diffMs = endTime.getTime() - startTime.getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
};

// ============================================
// Mock Data
// ============================================

const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

const makeTime = (base: Date, hours: number, minutes: number): Date => {
  const d = new Date(base);
  d.setHours(hours, minutes, 0, 0);
  return d;
};

const mockActivities: ActivityEvent[] = [
  // Today
  {
    id: 't1',
    type: 'email',
    label: 'Client correspondence',
    description: 'Reply to Johnson v. Tech Corp discovery deadline thread',
    startTime: makeTime(today, 14, 10),
    endTime: makeTime(today, 14, 28),
  },
  {
    id: 't2',
    type: 'document',
    label: 'Motion to Compel Discovery',
    description: 'Drafting sections 3–5 of discovery motion',
    startTime: makeTime(today, 13, 30),
    endTime: makeTime(today, 14, 5),
  },
  {
    id: 't3',
    type: 'phone',
    label: 'Conference call with co-counsel',
    description: 'Strategy discussion for upcoming deposition',
    startTime: makeTime(today, 12, 15),
    endTime: makeTime(today, 12, 45),
  },
  {
    id: 't4',
    type: 'document',
    label: 'Settlement Agreement Review',
    description: 'Reviewing Wilson Estate settlement terms and redlines',
    startTime: makeTime(today, 10, 0),
    endTime: makeTime(today, 11, 15),
  },
  {
    id: 't5',
    type: 'email',
    label: 'Morning email review',
    description: 'Responding to client inquiries and court notifications',
    startTime: makeTime(today, 9, 15),
    endTime: makeTime(today, 9, 50),
  },
  {
    id: 't6',
    type: 'phone',
    label: 'Client intake call',
    description: 'Initial consultation with prospective client — contract dispute',
    startTime: makeTime(today, 8, 45),
    endTime: makeTime(today, 9, 10),
  },
  // Yesterday
  {
    id: 'y1',
    type: 'email',
    label: 'Filing deadline correspondence',
    description: 'Confirming filing dates with clerk and opposing counsel',
    startTime: makeTime(yesterday, 16, 0),
    endTime: makeTime(yesterday, 16, 30),
  },
  {
    id: 'y2',
    type: 'document',
    label: 'Legal Brief — Summary Judgment',
    description: 'Drafting argument section for Anderson v. State motion',
    startTime: makeTime(yesterday, 14, 30),
    endTime: makeTime(yesterday, 15, 45),
  },
  {
    id: 'y3',
    type: 'phone',
    label: 'Mediation preparation call',
    description: 'Pre-mediation strategy session with client and mediator',
    startTime: makeTime(yesterday, 13, 15),
    endTime: makeTime(yesterday, 14, 15),
  },
  {
    id: 'y4',
    type: 'document',
    label: 'Contract Review — ABC Corp',
    description: 'Reviewing amended terms in corporate acquisition agreement',
    startTime: makeTime(yesterday, 10, 30),
    endTime: makeTime(yesterday, 12, 0),
  },
  {
    id: 'y5',
    type: 'email',
    label: 'Opposing counsel correspondence',
    description: 'Exchange of proposed stipulations and scheduling order',
    startTime: makeTime(yesterday, 9, 0),
    endTime: makeTime(yesterday, 10, 15),
  },
];

// ============================================
// Group by Day
// ============================================

type DayGroup = 'Today' | 'Yesterday';

interface ActivityGroup {
  label: DayGroup;
  events: ActivityEvent[];
}

const groupByDay = (events: ActivityEvent[]): ActivityGroup[] => {
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  const todayEvents: ActivityEvent[] = [];
  const yesterdayEvents: ActivityEvent[] = [];

  events.forEach((event) => {
    const eventDate = new Date(
      event.startTime.getFullYear(),
      event.startTime.getMonth(),
      event.startTime.getDate()
    );
    if (eventDate.getTime() === todayStart.getTime()) {
      todayEvents.push(event);
    } else if (eventDate.getTime() === yesterdayStart.getTime()) {
      yesterdayEvents.push(event);
    }
  });

  // Sort each group by start time descending (most recent first)
  todayEvents.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  yesterdayEvents.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());

  const groups: ActivityGroup[] = [];
  if (todayEvents.length > 0) {
    groups.push({ label: 'Today', events: todayEvents });
  }
  if (yesterdayEvents.length > 0) {
    groups.push({ label: 'Yesterday', events: yesterdayEvents });
  }
  return groups;
};

// ============================================
// Styles
// ============================================

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('28px'),
    width: '100%',
    maxWidth: '720px',
  },

  headerSection: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('4px'),
  },

  headerTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
    lineHeight: '28px',
  },

  headerSubtitle: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground3,
    lineHeight: '18px',
  },

  dayGroup: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('0px'),
  },

  dayLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '12px',
  },

  timeline: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    paddingLeft: '28px',
  },

  // The vertical line running down the left side
  timelineLine: {
    position: 'absolute',
    left: '7px',
    top: '8px',
    bottom: '8px',
    width: '2px',
    backgroundColor: tokens.colorNeutralStroke2,
    ...shorthands.borderRadius('1px'),
  },

  timelineItem: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    ...shorthands.padding('0', '0', '20px', '0'),

    ':last-child': {
      paddingBottom: '0',
    },
  },

  // The dot on the timeline
  timelineDot: {
    position: 'absolute',
    left: '-28px',
    top: '8px',
    width: '16px',
    height: '16px',
    ...shorthands.borderRadius('50%'),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    flexShrink: 0,
  },

  timelineDotInner: {
    width: '8px',
    height: '8px',
    ...shorthands.borderRadius('50%'),
  },

  card: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
    ...shorthands.padding('14px', '16px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius('var(--radius-medium)'),
    boxShadow: 'var(--shadow-card)',
    borderLeftWidth: '3px',
    borderLeftStyle: 'solid',
    transitionProperty: 'box-shadow, transform',
    transitionDuration: tokens.durationNormal,
    transitionTimingFunction: tokens.curveEasyEase,

    ':hover': {
      boxShadow: 'var(--shadow-card-hover)',
      transform: 'translateY(-1px)',
    },
  },

  cardTopRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.gap('12px'),
  },

  cardTypeInfo: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    flex: 1,
    minWidth: 0,
  },

  cardIcon: {
    fontSize: '16px',
    flexShrink: 0,
  },

  cardTypeName: {
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },

  cardTimeMeta: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('10px'),
    flexShrink: 0,
  },

  cardDuration: {
    fontSize: '14px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
  },

  cardTimeRange: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    fontWeight: '500',
  },

  cardLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
    lineHeight: '20px',
  },

  cardDescription: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground3,
    lineHeight: '18px',
  },
});

// ============================================
// ActivityView Component
// ============================================

const ActivityView: React.FC = () => {
  const styles = useStyles();
  const groups = groupByDay(mockActivities);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.headerSection}>
        <Text className={styles.headerTitle}>Activity</Text>
        <Text className={styles.headerSubtitle}>
          Your recent work activity across applications.
        </Text>
      </div>

      {/* Day Groups */}
      {groups.map((group) => (
        <div key={group.label} className={styles.dayGroup}>
          <Text className={styles.dayLabel}>{group.label}</Text>
          <div className={styles.timeline}>
            {/* Vertical timeline line */}
            <div className={styles.timelineLine} />

            {group.events.map((event) => {
              const config = getActivityTypeConfig(event.type);

              return (
                <div
                  key={event.id}
                  className={styles.timelineItem}
                  role="article"
                  aria-label={`${config.displayName}: ${event.label}, ${formatDuration(event.startTime, event.endTime)}, ${formatTimeRange(event.startTime, event.endTime)}`}
                >
                  {/* Timeline dot */}
                  <div
                    className={styles.timelineDot}
                    style={{ backgroundColor: config.accentBg }}
                  >
                    <div
                      className={styles.timelineDotInner}
                      style={{ backgroundColor: config.accentColor }}
                    />
                  </div>

                  {/* Activity card */}
                  <div
                    className={styles.card}
                    style={{ borderLeftColor: config.accentColor }}
                  >
                    {/* Top row: type badge + time meta */}
                    <div className={styles.cardTopRow}>
                      <div className={styles.cardTypeInfo}>
                        <span
                          className={styles.cardIcon}
                          style={{ color: config.accentColor }}
                        >
                          {config.icon}
                        </span>
                        <Text
                          className={styles.cardTypeName}
                          style={{ color: config.accentColor }}
                        >
                          {config.displayName}
                        </Text>
                      </div>

                      <div className={styles.cardTimeMeta}>
                        <Text className={styles.cardDuration}>
                          {formatDuration(event.startTime, event.endTime)}
                        </Text>
                        <Text className={styles.cardTimeRange}>
                          {formatTimeRange(event.startTime, event.endTime)}
                        </Text>
                      </div>
                    </div>

                    {/* Activity details */}
                    <Text className={styles.cardLabel}>{event.label}</Text>
                    <Text className={styles.cardDescription}>
                      {event.description}
                    </Text>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityView;
