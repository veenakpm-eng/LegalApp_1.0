import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Text,
  Button,
  Tooltip,
  Dropdown,
  Option,
  Divider,
  Input,
} from '@fluentui/react-components';
import {
  PlayRegular,
  PauseRegular,
  StopRegular,
  ArrowDownloadRegular,
  SearchRegular,
  RecordRegular,
  DesktopRegular,
  MailRegular,
  DocumentTextRegular,
  GlobeRegular,
  CallRegular,
  InfoRegular,
  ShieldCheckmarkRegular,
  CheckmarkCircleRegular,
  DismissCircleRegular,
} from '@fluentui/react-icons';

/**
 * ActivityLoggerView Component
 *
 * Desktop Activity Logger UI prototype interface.
 * Displays real-time session monitoring, session history, summary statistics,
 * and controls for the background activity tracking service.
 *
 * Features:
 * - Live session indicator showing the currently active application
 * - Session history log with app, window title, duration, and timestamps
 * - Summary statistics: total time, session count, top applications
 * - Start/pause/stop controls for the logger service
 * - Filter and search sessions by application or window title
 * - Export session data (JSON, CSV)
 * - Privacy-first design with metadata-only tracking
 */

// ============================================
// Types
// ============================================

type LoggerStatus = 'running' | 'paused' | 'stopped';

interface AppSession {
  id: string;
  app: string;
  windowTitle: string;
  startTime: Date;
  endTime: Date | null;
  durationMinutes: number;
}

interface AppSummary {
  app: string;
  totalMinutes: number;
  sessionCount: number;
  color: string;
  icon: React.ReactElement;
}

// ============================================
// App Configuration
// ============================================

interface AppConfig {
  displayName: string;
  color: string;
  bgColor: string;
  icon: React.ReactElement;
}

const appConfigs: Record<string, AppConfig> = {
  'Outlook': {
    displayName: 'Outlook',
    color: '#0078D4',
    bgColor: 'rgba(0, 120, 212, 0.08)',
    icon: <MailRegular />,
  },
  'Adobe Acrobat': {
    displayName: 'Adobe Acrobat',
    color: '#E3383B',
    bgColor: 'rgba(227, 56, 59, 0.08)',
    icon: <DocumentTextRegular />,
  },
  'Microsoft Word': {
    displayName: 'Microsoft Word',
    color: '#2B579A',
    bgColor: 'rgba(43, 87, 154, 0.08)',
    icon: <DocumentTextRegular />,
  },
  'Google Chrome': {
    displayName: 'Google Chrome',
    color: '#4285F4',
    bgColor: 'rgba(66, 133, 244, 0.08)',
    icon: <GlobeRegular />,
  },
  'Microsoft Excel': {
    displayName: 'Microsoft Excel',
    color: '#217346',
    bgColor: 'rgba(33, 115, 70, 0.08)',
    icon: <DocumentTextRegular />,
  },
  'RingCentral': {
    displayName: 'RingCentral',
    color: '#FF6A00',
    bgColor: 'rgba(255, 106, 0, 0.08)',
    icon: <CallRegular />,
  },
  'Microsoft Teams': {
    displayName: 'Microsoft Teams',
    color: '#6264A7',
    bgColor: 'rgba(98, 100, 167, 0.08)',
    icon: <CallRegular />,
  },
  'File Explorer': {
    displayName: 'File Explorer',
    color: '#8C6C00',
    bgColor: 'rgba(140, 108, 0, 0.08)',
    icon: <DesktopRegular />,
  },
};

const getAppConfig = (appName: string): AppConfig => {
  return appConfigs[appName] || {
    displayName: appName,
    color: '#666666',
    bgColor: 'rgba(102, 102, 102, 0.08)',
    icon: <DesktopRegular />,
  };
};

// ============================================
// Time Formatting Utilities
// ============================================

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};

const formatTimeShort = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const formatDuration = (minutes: number): string => {
  if (minutes < 1) {
    const seconds = Math.round(minutes * 60);
    return `${seconds}s`;
  }
  if (minutes < 60) {
    return `${Math.round(minutes * 10) / 10} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

const formatDurationCompact = (minutes: number): string => {
  if (minutes < 60) return `${Math.round(minutes)}m`;
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return mins === 0 ? `${hours}h` : `${hours}h${mins}m`;
};

// ============================================
// Mock Data
// ============================================

const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

const makeTime = (base: Date, hours: number, minutes: number, seconds = 0): Date => {
  const d = new Date(base);
  d.setHours(hours, minutes, seconds, 0);
  return d;
};

const mockSessions: AppSession[] = [
  {
    id: 's1',
    app: 'Outlook',
    windowTitle: 'RE: Discovery Deadline \u2013 Johnson v. Tech Corp',
    startTime: makeTime(today, 14, 10, 23),
    endTime: makeTime(today, 14, 28, 45),
    durationMinutes: 18.4,
  },
  {
    id: 's2',
    app: 'Adobe Acrobat',
    windowTitle: 'Contract_Amendment_v3.pdf',
    startTime: makeTime(today, 14, 29, 12),
    endTime: makeTime(today, 14, 49, 33),
    durationMinutes: 20.4,
  },
  {
    id: 's3',
    app: 'Microsoft Word',
    windowTitle: 'Motion to Compel Discovery - Johnson v. Tech Corp.docx',
    startTime: makeTime(today, 13, 30, 0),
    endTime: makeTime(today, 14, 5, 0),
    durationMinutes: 35.0,
  },
  {
    id: 's4',
    app: 'Google Chrome',
    windowTitle: 'Westlaw \u2013 Case Research: Johnson v. Tech Corp',
    startTime: makeTime(today, 12, 45, 0),
    endTime: makeTime(today, 13, 25, 0),
    durationMinutes: 40.0,
  },
  {
    id: 's5',
    app: 'RingCentral',
    windowTitle: 'Conference Call \u2013 Co-Counsel Strategy (3 participants)',
    startTime: makeTime(today, 12, 15, 0),
    endTime: makeTime(today, 12, 45, 0),
    durationMinutes: 30.0,
  },
  {
    id: 's6',
    app: 'Outlook',
    windowTitle: 'FW: Settlement Offer \u2013 Wilson Estate Matter',
    startTime: makeTime(today, 11, 30, 0),
    endTime: makeTime(today, 11, 52, 0),
    durationMinutes: 22.0,
  },
  {
    id: 's7',
    app: 'Microsoft Word',
    windowTitle: 'Settlement Agreement \u2013 Wilson Estate (Draft 4).docx',
    startTime: makeTime(today, 10, 0, 0),
    endTime: makeTime(today, 11, 15, 0),
    durationMinutes: 75.0,
  },
  {
    id: 's8',
    app: 'Outlook',
    windowTitle: 'RE: Deposition Schedule \u2013 Smith v. Allied Insurance',
    startTime: makeTime(today, 9, 15, 0),
    endTime: makeTime(today, 9, 50, 0),
    durationMinutes: 35.0,
  },
  {
    id: 's9',
    app: 'Microsoft Excel',
    windowTitle: 'Billing_Summary_January_2026.xlsx',
    startTime: makeTime(today, 9, 0, 0),
    endTime: makeTime(today, 9, 12, 0),
    durationMinutes: 12.0,
  },
  {
    id: 's10',
    app: 'Microsoft Teams',
    windowTitle: 'Morning Standup \u2013 Litigation Team',
    startTime: makeTime(today, 8, 45, 0),
    endTime: makeTime(today, 9, 0, 0),
    durationMinutes: 15.0,
  },
];

// The currently active session (live)
const mockCurrentSession: AppSession = {
  id: 'live',
  app: 'Adobe Acrobat',
  windowTitle: 'Deposition_Transcript_Smith_v_Allied.pdf',
  startTime: makeTime(today, 14, 52, 10),
  endTime: null,
  durationMinutes: 0,
};

// ============================================
// Compute Summaries
// ============================================

const computeAppSummaries = (sessions: AppSession[]): AppSummary[] => {
  const map: Record<string, { totalMinutes: number; sessionCount: number }> = {};
  sessions.forEach((s) => {
    if (!map[s.app]) {
      map[s.app] = { totalMinutes: 0, sessionCount: 0 };
    }
    map[s.app].totalMinutes += s.durationMinutes;
    map[s.app].sessionCount += 1;
  });

  return Object.entries(map)
    .map(([app, data]) => {
      const config = getAppConfig(app);
      return {
        app,
        totalMinutes: Math.round(data.totalMinutes * 10) / 10,
        sessionCount: data.sessionCount,
        color: config.color,
        icon: config.icon,
      };
    })
    .sort((a, b) => b.totalMinutes - a.totalMinutes);
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
    maxWidth: '960px',
  },

  // Header Section
  headerSection: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('4px'),
  },

  headerRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    ...shorthands.gap('16px'),
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

  // Status & Controls Bar
  controlsBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.gap('12px'),
    ...shorthands.padding('12px', '16px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius('var(--radius-medium)'),
    boxShadow: 'var(--shadow-card)',
  },

  controlsLeft: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
  },

  controlsRight: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },

  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },

  statusDot: {
    width: '10px',
    height: '10px',
    ...shorthands.borderRadius('50%'),
    flexShrink: 0,
  },

  statusDotRunning: {
    backgroundColor: '#107C10',
    boxShadow: '0 0 6px rgba(16, 124, 16, 0.4)',
    animationName: {
      '0%': { opacity: 1 },
      '50%': { opacity: 0.5 },
      '100%': { opacity: 1 },
    },
    animationDuration: '2s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'ease-in-out',
  },

  statusDotPaused: {
    backgroundColor: '#CA5010',
  },

  statusDotStopped: {
    backgroundColor: '#A4262C',
  },

  statusText: {
    fontSize: '13px',
    fontWeight: '600',
  },

  pollingBadge: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
    ...shorthands.padding('2px', '8px'),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius('10px'),
  },

  // Live Session Card
  liveSessionCard: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('12px'),
    ...shorthands.padding('16px', '20px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius('var(--radius-medium)'),
    boxShadow: 'var(--shadow-card)',
    borderLeftWidth: '4px',
    borderLeftStyle: 'solid',
    position: 'relative',
    overflow: 'hidden',
  },

  liveSessionPulse: {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    height: '2px',
    backgroundColor: '#107C10',
    opacity: 0.6,
    animationName: {
      '0%': { transform: 'scaleX(0)', transformOrigin: 'left' },
      '50%': { transform: 'scaleX(1)', transformOrigin: 'left' },
      '51%': { transformOrigin: 'right' },
      '100%': { transform: 'scaleX(0)', transformOrigin: 'right' },
    },
    animationDuration: '3s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'ease-in-out',
  },

  liveSessionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  liveSessionLeft: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('10px'),
  },

  liveSessionIcon: {
    fontSize: '20px',
    flexShrink: 0,
  },

  liveSessionAppName: {
    fontSize: '14px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
  },

  liveSessionBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    ...shorthands.gap('4px'),
    fontSize: '11px',
    fontWeight: '600',
    color: '#107C10',
    backgroundColor: 'rgba(16, 124, 16, 0.08)',
    ...shorthands.padding('2px', '10px'),
    ...shorthands.borderRadius('12px'),
  },

  liveSessionTitle: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground2,
    lineHeight: '18px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  liveSessionMeta: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('16px'),
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
  },

  // Summary Cards
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    ...shorthands.gap('16px'),
  },

  summaryCard: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('6px'),
    ...shorthands.padding('16px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius('var(--radius-medium)'),
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
    fontWeight: '700',
    color: tokens.colorNeutralForeground1,
    lineHeight: '32px',
  },

  summarySubtext: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
  },

  // Top Applications Section
  topAppsSection: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('12px'),
  },

  topAppsSectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sectionTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
  },

  topAppsList: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
  },

  topAppRow: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
    ...shorthands.padding('10px', '14px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius('var(--radius-medium)'),
    boxShadow: 'var(--shadow-card)',
  },

  topAppIcon: {
    fontSize: '18px',
    flexShrink: 0,
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.borderRadius('6px'),
  },

  topAppInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('4px'),
    minWidth: 0,
  },

  topAppName: {
    fontSize: '13px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
  },

  topAppBar: {
    width: '100%',
    height: '4px',
    ...shorthands.borderRadius('2px'),
    backgroundColor: tokens.colorNeutralBackground3,
    overflow: 'hidden',
  },

  topAppBarFill: {
    height: '100%',
    ...shorthands.borderRadius('2px'),
    transitionProperty: 'width',
    transitionDuration: '300ms',
    transitionTimingFunction: 'ease',
  },

  topAppMeta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    ...shorthands.gap('2px'),
    flexShrink: 0,
  },

  topAppDuration: {
    fontSize: '13px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
  },

  topAppSessions: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
  },

  // Session Log Section
  sessionLogSection: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('12px'),
  },

  sessionLogHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.gap('12px'),
  },

  sessionLogFilters: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },

  searchInput: {
    minWidth: '200px',
  },

  sessionList: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('6px'),
  },

  sessionRow: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
    ...shorthands.padding('12px', '16px'),
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

  sessionAppIcon: {
    fontSize: '18px',
    flexShrink: 0,
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.borderRadius('8px'),
  },

  sessionInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('2px'),
    minWidth: 0,
  },

  sessionAppName: {
    fontSize: '13px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
  },

  sessionWindowTitle: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  sessionTimeMeta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    ...shorthands.gap('2px'),
    flexShrink: 0,
  },

  sessionDuration: {
    fontSize: '14px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
  },

  sessionTimeRange: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
  },

  // Privacy Footer
  privacyFooter: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    ...shorthands.padding('12px', '16px'),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius('var(--radius-medium)'),
  },

  privacyFooterIcon: {
    fontSize: '16px',
    color: tokens.colorBrandForeground1,
    flexShrink: 0,
  },

  privacyFooterText: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    lineHeight: '16px',
  },

  // Detail Panel
  detailPanel: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('16px'),
    ...shorthands.padding('20px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius('var(--radius-medium)'),
    boxShadow: 'var(--shadow-card)',
    borderLeftWidth: '4px',
    borderLeftStyle: 'solid',
  },

  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    ...shorthands.gap('16px'),
  },

  detailLabel: {
    fontSize: '12px',
    fontWeight: '500',
    color: tokens.colorNeutralForeground3,
    flexShrink: 0,
    minWidth: '100px',
  },

  detailValue: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground1,
    textAlign: 'right',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  detailActions: {
    display: 'flex',
    ...shorthands.gap('8px'),
    marginTop: '4px',
  },

  // Expand/Collapse
  expandToggle: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('4px'),
    cursor: 'pointer',
    fontSize: '12px',
    color: tokens.colorBrandForeground1,
    background: 'none',
    ...shorthands.border('0'),
    ...shorthands.padding('4px', '0'),

    ':hover': {
      textDecorationLine: 'underline',
    },

    ':focus-visible': {
      ...shorthands.outline('2px', 'solid', tokens.colorBrandStroke1),
      outlineOffset: '2px',
      ...shorthands.borderRadius('2px'),
    },
  },

  // What's tracked info bar
  infoBar: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
    ...shorthands.padding('14px', '16px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius('var(--radius-medium)'),
    boxShadow: 'var(--shadow-card)',
  },

  infoBarHeader: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },

  infoBarIcon: {
    fontSize: '16px',
    color: tokens.colorBrandForeground1,
    flexShrink: 0,
  },

  infoBarTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
  },

  infoBarColumns: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    ...shorthands.gap('12px'),
    paddingLeft: '24px',
  },

  infoBarColumn: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('4px'),
  },

  infoBarColumnTitle: {
    fontSize: '11px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
    marginBottom: '2px',
  },

  infoBarItem: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground2,
    lineHeight: '16px',
  },

  infoBarItemTracked: {
    color: '#107C10',
  },

  infoBarItemNotTracked: {
    color: tokens.colorNeutralForeground3,
  },

  checkIcon: {
    fontSize: '12px',
    marginRight: '4px',
    verticalAlign: 'middle',
  },

  dismissIcon: {
    fontSize: '12px',
    marginRight: '4px',
    verticalAlign: 'middle',
    color: tokens.colorNeutralForeground3,
  },
});

// ============================================
// ActivityLoggerView Component
// ============================================

const ActivityLoggerView: React.FC = () => {
  const styles = useStyles();
  const [loggerStatus, setLoggerStatus] = useState<LoggerStatus>('running');
  const [sessions] = useState<AppSession[]>(mockSessions);
  const [currentSession] = useState<AppSession>(mockCurrentSession);
  const [searchQuery, setSearchQuery] = useState('');
  const [appFilter, setAppFilter] = useState<string>('all');
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [showInfoBar, setShowInfoBar] = useState(false);
  const [liveDuration, setLiveDuration] = useState('0s');

  // Compute live duration timer
  useEffect(() => {
    if (loggerStatus !== 'running') return;

    const interval = setInterval(() => {
      const elapsed = (Date.now() - currentSession.startTime.getTime()) / 60000;
      setLiveDuration(formatDuration(elapsed));
    }, 1000);

    // Initial calculation
    const elapsed = (Date.now() - currentSession.startTime.getTime()) / 60000;
    setLiveDuration(formatDuration(elapsed));

    return () => clearInterval(interval);
  }, [loggerStatus, currentSession.startTime]);

  // Computed values
  const totalMinutes = sessions.reduce((sum: number, s: AppSession) => sum + s.durationMinutes, 0);
  const appSummaries = computeAppSummaries(sessions);
  const maxAppMinutes = appSummaries.length > 0 ? appSummaries[0].totalMinutes : 1;

  // Unique apps for filter dropdown
  const uniqueApps = Array.from(new Set(sessions.map((s: AppSession) => s.app))).sort();

  // Filter sessions
  const filteredSessions = sessions.filter((s: AppSession) => {
    const matchesApp = appFilter === 'all' || s.app === appFilter;
    const matchesSearch =
      searchQuery === '' ||
      s.app.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.windowTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesApp && matchesSearch;
  });

  // Selected session detail
  const selectedSession = selectedSessionId
    ? sessions.find((s: AppSession) => s.id === selectedSessionId) || null
    : null;

  // Status display
  const getStatusColor = (): string => {
    switch (loggerStatus) {
      case 'running': return '#107C10';
      case 'paused': return '#CA5010';
      case 'stopped': return '#A4262C';
      default: return '#666666';
    }
  };

  const getStatusLabel = (): string => {
    switch (loggerStatus) {
      case 'running': return 'Recording';
      case 'paused': return 'Paused';
      case 'stopped': return 'Stopped';
      default: return 'Unknown';
    }
  };

  const getStatusDotClass = (): string => {
    switch (loggerStatus) {
      case 'running': return `${styles.statusDot} ${styles.statusDotRunning}`;
      case 'paused': return `${styles.statusDot} ${styles.statusDotPaused}`;
      case 'stopped': return `${styles.statusDot} ${styles.statusDotStopped}`;
      default: return styles.statusDot;
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.headerSection}>
        <div className={styles.headerRow}>
          <div>
            <Text className={styles.headerTitle}>Activity Logger</Text>
            <Text className={styles.headerSubtitle}>
              Automatic desktop activity tracking. Observes active applications and window titles to reconstruct your workday.
            </Text>
          </div>
        </div>
      </div>

      {/* Status & Controls Bar */}
      <div className={styles.controlsBar}>
        <div className={styles.controlsLeft}>
          <div className={styles.statusIndicator}>
            <div className={getStatusDotClass()} />
            <Text className={styles.statusText} style={{ color: getStatusColor() }}>
              {getStatusLabel()}
            </Text>
          </div>
          <Text className={styles.pollingBadge}>Polling every 1.5s</Text>
        </div>

        <div className={styles.controlsRight}>
          {loggerStatus === 'stopped' && (
            <Button
              appearance="primary"
              icon={<PlayRegular />}
              size="small"
              onClick={() => setLoggerStatus('running')}
            >
              Start
            </Button>
          )}
          {loggerStatus === 'running' && (
            <>
              <Button
                appearance="subtle"
                icon={<PauseRegular />}
                size="small"
                onClick={() => setLoggerStatus('paused')}
              >
                Pause
              </Button>
              <Button
                appearance="subtle"
                icon={<StopRegular />}
                size="small"
                onClick={() => setLoggerStatus('stopped')}
              >
                Stop
              </Button>
            </>
          )}
          {loggerStatus === 'paused' && (
            <>
              <Button
                appearance="primary"
                icon={<PlayRegular />}
                size="small"
                onClick={() => setLoggerStatus('running')}
              >
                Resume
              </Button>
              <Button
                appearance="subtle"
                icon={<StopRegular />}
                size="small"
                onClick={() => setLoggerStatus('stopped')}
              >
                Stop
              </Button>
            </>
          )}
          <Divider vertical style={{ height: '24px' }} />
          <Tooltip content="Export session data" relationship="label">
            <Button
              appearance="subtle"
              icon={<ArrowDownloadRegular />}
              size="small"
            >
              Export
            </Button>
          </Tooltip>
          <Tooltip content="What does the logger track?" relationship="label">
            <Button
              appearance="subtle"
              icon={<InfoRegular />}
              size="small"
              onClick={() => setShowInfoBar(!showInfoBar)}
            />
          </Tooltip>
        </div>
      </div>

      {/* Info Bar: What the logger tracks */}
      {showInfoBar && (
        <div className={styles.infoBar}>
          <div className={styles.infoBarHeader}>
            <ShieldCheckmarkRegular className={styles.infoBarIcon} />
            <Text className={styles.infoBarTitle}>Privacy-First Activity Tracking</Text>
          </div>
          <div className={styles.infoBarColumns}>
            <div className={styles.infoBarColumn}>
              <Text className={styles.infoBarColumnTitle}>Observed (Metadata Only)</Text>
              <Text className={`${styles.infoBarItem} ${styles.infoBarItemTracked}`}>
                <CheckmarkCircleRegular className={styles.checkIcon} />
                Active application name
              </Text>
              <Text className={`${styles.infoBarItem} ${styles.infoBarItemTracked}`}>
                <CheckmarkCircleRegular className={styles.checkIcon} />
                Window title text
              </Text>
              <Text className={`${styles.infoBarItem} ${styles.infoBarItemTracked}`}>
                <CheckmarkCircleRegular className={styles.checkIcon} />
                Session start/end timestamps
              </Text>
              <Text className={`${styles.infoBarItem} ${styles.infoBarItemTracked}`}>
                <CheckmarkCircleRegular className={styles.checkIcon} />
                Foreground session duration
              </Text>
            </div>
            <div className={styles.infoBarColumn}>
              <Text className={styles.infoBarColumnTitle}>Never Collected</Text>
              <Text className={`${styles.infoBarItem} ${styles.infoBarItemNotTracked}`}>
                <DismissCircleRegular className={styles.dismissIcon} />
                Content (email body, doc text)
              </Text>
              <Text className={`${styles.infoBarItem} ${styles.infoBarItemNotTracked}`}>
                <DismissCircleRegular className={styles.dismissIcon} />
                Keystrokes or mouse input
              </Text>
              <Text className={`${styles.infoBarItem} ${styles.infoBarItemNotTracked}`}>
                <DismissCircleRegular className={styles.dismissIcon} />
                Screenshots or recordings
              </Text>
              <Text className={`${styles.infoBarItem} ${styles.infoBarItemNotTracked}`}>
                <DismissCircleRegular className={styles.dismissIcon} />
                Background processes
              </Text>
            </div>
          </div>
        </div>
      )}

      {/* Live Session Card */}
      {loggerStatus === 'running' && (
        <div
          className={styles.liveSessionCard}
          style={{ borderLeftColor: getAppConfig(currentSession.app).color }}
          role="status"
          aria-label={`Currently tracking: ${currentSession.app} - ${currentSession.windowTitle}`}
        >
          <div className={styles.liveSessionPulse} />
          <div className={styles.liveSessionHeader}>
            <div className={styles.liveSessionLeft}>
              <span
                className={styles.liveSessionIcon}
                style={{ color: getAppConfig(currentSession.app).color }}
              >
                {getAppConfig(currentSession.app).icon}
              </span>
              <Text className={styles.liveSessionAppName}>{currentSession.app}</Text>
            </div>
            <div className={styles.liveSessionBadge}>
              <RecordRegular style={{ fontSize: '10px' }} />
              LIVE
            </div>
          </div>
          <Text className={styles.liveSessionTitle}>
            {currentSession.windowTitle}
          </Text>
          <div className={styles.liveSessionMeta}>
            <span>Started {formatTime(currentSession.startTime)}</span>
            <span>Duration: {liveDuration}</span>
          </div>
        </div>
      )}

      {/* Summary Statistics */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <Text className={styles.summaryLabel}>Total Time</Text>
          <Text className={styles.summaryValue}>{formatDuration(totalMinutes)}</Text>
          <Text className={styles.summarySubtext}>across all sessions today</Text>
        </div>
        <div className={styles.summaryCard}>
          <Text className={styles.summaryLabel}>Sessions</Text>
          <Text className={styles.summaryValue}>{sessions.length}</Text>
          <Text className={styles.summarySubtext}>completed sessions</Text>
        </div>
        <div className={styles.summaryCard}>
          <Text className={styles.summaryLabel}>Applications</Text>
          <Text className={styles.summaryValue}>{appSummaries.length}</Text>
          <Text className={styles.summarySubtext}>unique apps tracked</Text>
        </div>
      </div>

      {/* Top Applications */}
      <div className={styles.topAppsSection}>
        <div className={styles.topAppsSectionHeader}>
          <Text className={styles.sectionTitle}>Time by Application</Text>
        </div>
        <div className={styles.topAppsList}>
          {appSummaries.map((summary) => {
            const config = getAppConfig(summary.app);
            const widthPct = (summary.totalMinutes / maxAppMinutes) * 100;

            return (
              <div key={summary.app} className={styles.topAppRow}>
                <div
                  className={styles.topAppIcon}
                  style={{ backgroundColor: config.bgColor, color: config.color }}
                >
                  {config.icon}
                </div>
                <div className={styles.topAppInfo}>
                  <Text className={styles.topAppName}>{config.displayName}</Text>
                  <div className={styles.topAppBar}>
                    <div
                      className={styles.topAppBarFill}
                      style={{
                        width: `${widthPct}%`,
                        backgroundColor: config.color,
                      }}
                    />
                  </div>
                </div>
                <div className={styles.topAppMeta}>
                  <Text className={styles.topAppDuration}>
                    {formatDurationCompact(summary.totalMinutes)}
                  </Text>
                  <Text className={styles.topAppSessions}>
                    {summary.sessionCount} session{summary.sessionCount !== 1 ? 's' : ''}
                  </Text>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Session Log */}
      <div className={styles.sessionLogSection}>
        <div className={styles.sessionLogHeader}>
          <Text className={styles.sectionTitle}>
            Session Log ({filteredSessions.length})
          </Text>
          <div className={styles.sessionLogFilters}>
            <Input
              className={styles.searchInput}
              placeholder="Search sessions..."
              contentBefore={<SearchRegular />}
              size="small"
              value={searchQuery}
              onChange={(_e: any, data: any) => setSearchQuery(data.value)}
            />
            <Dropdown
              placeholder="All Apps"
              size="small"
              value={appFilter === 'all' ? 'All Apps' : appFilter}
              onOptionSelect={(_e: any, data: any) =>
                setAppFilter(data.optionValue === 'all' ? 'all' : data.optionValue || 'all')
              }
            >
              <Option value="all">All Apps</Option>
              {uniqueApps.map((app) => (
                <Option key={app} value={app}>
                  {app}
                </Option>
              ))}
            </Dropdown>
          </div>
        </div>

        <div className={styles.sessionList}>
          {filteredSessions.map((session: AppSession) => {
            const config = getAppConfig(session.app);
            const isSelected = selectedSessionId === session.id;

            return (
              <React.Fragment key={session.id}>
                <div
                  className={styles.sessionRow}
                  style={{
                    borderLeftColor: config.color,
                    cursor: 'pointer',
                    ...(isSelected
                      ? { boxShadow: `0 0 0 1px ${config.color}, var(--shadow-card)` }
                      : {}),
                  }}
                  onClick={() =>
                    setSelectedSessionId(isSelected ? null : session.id)
                  }
                  role="button"
                  tabIndex={0}
                  aria-expanded={isSelected}
                  aria-label={`${session.app}: ${session.windowTitle}, ${formatDuration(session.durationMinutes)}`}
                  onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedSessionId(isSelected ? null : session.id);
                    }
                  }}
                >
                  <div
                    className={styles.sessionAppIcon}
                    style={{
                      backgroundColor: config.bgColor,
                      color: config.color,
                    }}
                  >
                    {config.icon}
                  </div>
                  <div className={styles.sessionInfo}>
                    <Text className={styles.sessionAppName}>
                      {config.displayName}
                    </Text>
                    <Text className={styles.sessionWindowTitle}>
                      {session.windowTitle}
                    </Text>
                  </div>
                  <div className={styles.sessionTimeMeta}>
                    <Text className={styles.sessionDuration}>
                      {formatDuration(session.durationMinutes)}
                    </Text>
                    <Text className={styles.sessionTimeRange}>
                      {formatTimeShort(session.startTime)}
                      {session.endTime ? `\u2013${formatTimeShort(session.endTime)}` : ''}
                    </Text>
                  </div>
                </div>

                {/* Expanded Detail Panel */}
                {isSelected && session.endTime && (
                  <div
                    className={styles.detailPanel}
                    style={{ borderLeftColor: config.color }}
                  >
                    <div className={styles.detailRow}>
                      <Text className={styles.detailLabel}>Application</Text>
                      <Text className={styles.detailValue}>{config.displayName}</Text>
                    </div>
                    <div className={styles.detailRow}>
                      <Text className={styles.detailLabel}>Window Title</Text>
                      <Text className={styles.detailValue}>{session.windowTitle}</Text>
                    </div>
                    <div className={styles.detailRow}>
                      <Text className={styles.detailLabel}>Start Time</Text>
                      <Text className={styles.detailValue}>{formatTime(session.startTime)}</Text>
                    </div>
                    <div className={styles.detailRow}>
                      <Text className={styles.detailLabel}>End Time</Text>
                      <Text className={styles.detailValue}>{formatTime(session.endTime)}</Text>
                    </div>
                    <div className={styles.detailRow}>
                      <Text className={styles.detailLabel}>Duration</Text>
                      <Text className={styles.detailValue}>
                        {formatDuration(session.durationMinutes)} ({session.durationMinutes} min)
                      </Text>
                    </div>
                    <Divider />
                    <div className={styles.detailRow}>
                      <Text className={styles.detailLabel}>Session ID</Text>
                      <Text className={styles.detailValue} style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                        {session.id}
                      </Text>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Privacy Footer */}
      <div className={styles.privacyFooter}>
        <ShieldCheckmarkRegular className={styles.privacyFooterIcon} />
        <Text className={styles.privacyFooterText}>
          All session data is stored locally on this device. The logger captures metadata only (app names, window titles, timestamps)
          &mdash; never content, keystrokes, or screenshots. No data is transmitted externally.
        </Text>
      </div>
    </div>
  );
};

export default ActivityLoggerView;
