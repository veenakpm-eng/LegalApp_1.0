import React, { useState } from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Button,
  Tab,
  TabList,
  Card,
  Text,
  Body1,
  Body1Strong,
  Caption1,
  Subtitle2,
  Dropdown,
  Option,
  Badge,
  Divider,
  Tooltip,
  Spinner
} from '@fluentui/react-components';
import {
  DocumentRegular,
  FolderRegular,
  ClockRegular,
  SettingsRegular,
  SearchRegular,
  ClipboardTaskRegular,
  CheckmarkCircleRegular,
  EditRegular,
  DeleteRegular,
  CloudCheckmarkRegular,
  ArrowSyncRegular,
  PlugDisconnectedRegular,
  CheckmarkCircleFilled
} from '@fluentui/react-icons';
import SuggestionPopup from './components/SuggestionPopup';
import TrayDemo from './components/TrayDemo';

type TimeEntryStatus = 'pending' | 'confirmed' | 'synced';

interface TimeEntry {
  id: string;
  status: TimeEntryStatus;
  caseName: string;
  caseNumber: string;
  taskType: string;
  duration: string;
  date: string;
  dateGroup: 'Today' | 'Yesterday' | 'Earlier This Week';
  description: string;
  source: 'Auto-captured' | 'Manual entry';
}

const useStyles = makeStyles({
  app: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  titleBar: {
    height: '32px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    alignItems: 'center',
    ...shorthands.padding('0', '12px'),
    WebkitAppRegion: 'drag',
  },
  titleBarText: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground2,
  },
  navbar: {
    height: '48px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    alignItems: 'center',
    ...shorthands.padding('0', '16px'),
    ...shorthands.gap('12px'),
  },
  sidebar: {
    width: '220px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.padding('12px'),
  },
  content: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  mainContent: {
    flex: 1,
    ...shorthands.padding('24px'),
    overflowY: 'auto',
  },
  sidebarButton: {
    justifyContent: 'flex-start',
    marginBottom: '4px',
  },
  card: {
    marginBottom: '16px',
    ...shorthands.padding('16px'),
  },
  cardHeader: {
    marginBottom: '12px',
  },
  section: {
    marginBottom: '32px',
  },
  searchBar: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.padding('6px', '12px'),
    ...shorthands.gap('8px'),
  },
  searchInput: {
    ...shorthands.border('none'),
    backgroundColor: 'transparent',
    outline: 'none',
    flex: 1,
    fontSize: '13px',
    color: tokens.colorNeutralForeground1,
    fontFamily: 'Segoe UI, sans-serif',
    '::placeholder': {
      color: tokens.colorNeutralForeground4,
    },
  },
  activityHeader: {
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'baseline',
    ...shorthands.gap('12px'),
  },
  totalTime: {
    color: tokens.colorBrandForeground1,
    fontSize: '14px',
    fontWeight: '600',
  },
  timeBlock: {
    marginBottom: '32px',
  },
  timeBlockHeader: {
    marginBottom: '16px',
    color: tokens.colorNeutralForeground2,
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  activityItem: {
    marginBottom: '12px',
    ...shorthands.padding('16px'),
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('16px'),
  },
  appIcon: {
    width: '40px',
    height: '40px',
    ...shorthands.borderRadius('50%'),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: '#fff',
  },
  activityDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('4px'),
  },
  activityMeta: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    color: tokens.colorNeutralForeground3,
    fontSize: '12px',
  },
  activityDuration: {
    fontSize: '13px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground2,
  },
  activityTime: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
  },
  timeEntriesHeader: {
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeEntriesHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('16px'),
  },
  dateGroup: {
    marginBottom: '32px',
  },
  dateGroupHeader: {
    marginBottom: '16px',
    color: tokens.colorNeutralForeground2,
    fontSize: '13px',
    fontWeight: '600',
  },
  timeEntryCard: {
    marginBottom: '12px',
    ...shorthands.padding('16px'),
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('12px'),
  },
  timeEntryHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    ...shorthands.gap('12px'),
  },
  timeEntryContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('6px'),
  },
  timeEntryMeta: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
    flexWrap: 'wrap',
  },
  timeEntryMetaItem: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('4px'),
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
  },
  timeEntryDescription: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground2,
    lineHeight: '1.5',
  },
  timeEntryActions: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },
  timeEntrySource: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground4,
    fontStyle: 'italic',
  },
  timeEntrySyncStatus: {
    fontSize: '12px',
    color: tokens.colorBrandForeground1,
    fontWeight: '500',
  },
  syncStatusIndicator: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('6px'),
    ...shorthands.padding('6px', '12px'),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: tokens.colorNeutralBackground3,
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground3Hover,
    },
  },
  syncStatusIcon: {
    color: tokens.colorPaletteGreenForeground1,
  },
  settingsSection: {
    marginBottom: '32px',
  },
  settingsSectionHeader: {
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },
  settingsCard: {
    ...shorthands.padding('20px'),
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('16px'),
  },
  connectionStatus: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    marginBottom: '8px',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    ...shorthands.borderRadius('50%'),
    backgroundColor: tokens.colorPaletteGreenForeground1,
  },
  settingsRow: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('4px'),
  },
  settingsLabel: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    fontWeight: '600',
  },
  settingsValue: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground1,
  },
  settingsActions: {
    display: 'flex',
    ...shorthands.gap('8px'),
    marginTop: '8px',
  },
  toast: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    minWidth: '320px',
    ...shorthands.padding('16px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    boxShadow: tokens.shadow16,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
    zIndex: 1000,
  },
  toastIcon: {
    color: tokens.colorPaletteGreenForeground1,
    fontSize: '20px',
  },
  toastContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('4px'),
  },
});

const App: React.FC = () => {
  const styles = useStyles();
  const [selectedTab, setSelectedTab] = useState('documents');
  const [showSuggestionPopup, setShowSuggestionPopup] = useState(false);
  const [filterStatus, setFilterStatus] = useState('Pending Review');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('2 minutes ago');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([
    {
      id: '1',
      status: 'pending',
      caseName: 'Johnson v. Tech Corp',
      caseNumber: '2024-CV-1234',
      taskType: 'Legal Research',
      duration: '1h 15m',
      date: 'Jan 3, 2026',
      dateGroup: 'Today',
      description: 'Research on employment law precedents and discovery motion requirements for ongoing litigation.',
      source: 'Auto-captured'
    },
    {
      id: '2',
      status: 'pending',
      caseName: 'Wilson Settlement Case',
      caseNumber: '2024-CV-5678',
      taskType: 'Client Communication',
      duration: '22m',
      date: 'Jan 3, 2026',
      dateGroup: 'Today',
      description: 'Email correspondence regarding settlement negotiations and client approval process.',
      source: 'Auto-captured'
    },
    {
      id: '3',
      status: 'confirmed',
      caseName: 'Acme Inc. Contract Review',
      caseNumber: '2024-TX-9012',
      taskType: 'Document Drafting',
      duration: '52m',
      date: 'Jan 2, 2026',
      dateGroup: 'Yesterday',
      description: 'Reviewed and revised client services agreement, focusing on liability limitations and termination clauses.',
      source: 'Manual entry'
    },
    {
      id: '4',
      status: 'synced',
      caseName: 'Smith Deposition Review',
      caseNumber: '2024-CV-3456',
      taskType: 'Document Review',
      duration: '1h 8m',
      date: 'Jan 2, 2026',
      dateGroup: 'Yesterday',
      description: 'Comprehensive review of deposition transcript, highlighting key testimony and inconsistencies.',
      source: 'Auto-captured'
    },
    {
      id: '5',
      status: 'pending',
      caseName: 'Anderson v. State',
      caseNumber: '2024-CR-7890',
      taskType: 'Legal Research',
      duration: '57m',
      date: 'Dec 30, 2025',
      dateGroup: 'Earlier This Week',
      description: 'Research on summary judgment standards and applicable case law for motion preparation.',
      source: 'Auto-captured'
    },
    {
      id: '6',
      status: 'confirmed',
      caseName: 'Estate of Thompson',
      caseNumber: '2024-PR-2345',
      taskType: 'Document Drafting',
      duration: '2h 15m',
      date: 'Dec 30, 2025',
      dateGroup: 'Earlier This Week',
      description: 'Drafted trust amendment documents and prepared supporting memorandum for client review.',
      source: 'Manual entry'
    }
  ]);

  // Helper functions for time entry interactions
  const handleConfirm = (id: string) => {
    setTimeEntries(entries =>
      entries.map(entry =>
        entry.id === id ? { ...entry, status: 'confirmed' as TimeEntryStatus } : entry
      )
    );
  };

  const handleEdit = (id: string) => {
    alert(`Edit functionality for time entry ${id} - Not implemented in this demo`);
  };

  const handleDelete = (id: string) => {
    setTimeEntries(entries => entries.filter(entry => entry.id !== id));
  };

  const handleSyncAll = () => {
    setIsSyncing(true);

    // Count how many entries will be synced
    const confirmedCount = timeEntries.filter(entry => entry.status === 'confirmed').length;

    // Simulate network delay
    setTimeout(() => {
      setTimeEntries(entries =>
        entries.map(entry =>
          entry.status === 'confirmed' ? { ...entry, status: 'synced' as TimeEntryStatus } : entry
        )
      );
      setIsSyncing(false);
      setLastSyncTime('Just now');

      // Show success toast
      setToastMessage(`${confirmedCount} ${confirmedCount === 1 ? 'entry' : 'entries'} synced to Clio`);
      setShowToast(true);

      // Hide toast after 4 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 4000);
    }, 2000);
  };

  const handleManualSync = () => {
    setIsSyncing(true);

    // Simulate network delay
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime('Just now');

      // Show success toast
      setToastMessage('Synced with Clio');
      setShowToast(true);

      // Hide toast after 4 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 4000);
    }, 2000);
  };

  // Group time entries by date
  const groupedEntries = timeEntries.reduce((groups, entry) => {
    const group = entry.dateGroup;
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(entry);
    return groups;
  }, {} as Record<string, TimeEntry[]>);

  // Check if there are any confirmed entries to sync
  const hasConfirmedEntries = timeEntries.some(entry => entry.status === 'confirmed');

  return (
    <div className={styles.app}>
      {/* Custom Title Bar (optional - can use native) */}
      <div className={styles.titleBar}>
        <Text className={styles.titleBarText}>LegalApp</Text>
      </div>

      {/* Navigation Bar */}
      <div className={styles.navbar}>
        <div className={styles.searchBar}>
          <SearchRegular fontSize={16} />
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search documents, cases, contacts..."
          />
        </div>

        {/* Clio Sync Status Indicator */}
        <Tooltip
          content={`Clio: Connected · Last sync ${lastSyncTime}`}
          relationship="label"
        >
          <div className={styles.syncStatusIndicator} onClick={() => setSelectedTab('settings')}>
            <CloudCheckmarkRegular fontSize={16} className={styles.syncStatusIcon} />
          </div>
        </Tooltip>

        <Button
          appearance="subtle"
          icon={<SettingsRegular />}
          onClick={() => setSelectedTab('settings')}
        >
          Settings
        </Button>
      </div>

      {/* Main Content Area */}
      <div className={styles.content}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <Button
            appearance={selectedTab === 'documents' ? 'primary' : 'subtle'}
            icon={<DocumentRegular />}
            className={styles.sidebarButton}
            onClick={() => setSelectedTab('documents')}
          >
            Documents
          </Button>
          <Button
            appearance={selectedTab === 'activity' ? 'primary' : 'subtle'}
            icon={<ClockRegular />}
            className={styles.sidebarButton}
            onClick={() => setSelectedTab('activity')}
          >
            Activity
          </Button>
          <Button
            appearance={selectedTab === 'timeEntries' ? 'primary' : 'subtle'}
            icon={<ClipboardTaskRegular />}
            className={styles.sidebarButton}
            onClick={() => setSelectedTab('timeEntries')}
          >
            Time Entries
          </Button>
          <Button
            appearance={selectedTab === 'cases' ? 'primary' : 'subtle'}
            icon={<FolderRegular />}
            className={styles.sidebarButton}
            onClick={() => setSelectedTab('cases')}
          >
            Cases
          </Button>
          <Button
            appearance={selectedTab === 'settings' ? 'primary' : 'subtle'}
            icon={<SettingsRegular />}
            className={styles.sidebarButton}
            onClick={() => setSelectedTab('settings')}
          >
            Settings
          </Button>
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {selectedTab === 'documents' && (
            <div className={styles.section}>
              <Subtitle2 className={styles.cardHeader}>Recent Documents</Subtitle2>

              <Card className={styles.card}>
                <Body1Strong>Contract Agreement - Client A</Body1Strong>
                <Caption1>Modified 2 hours ago</Caption1>
              </Card>

              <Card className={styles.card}>
                <Body1Strong>Legal Brief - Case #2024-001</Body1Strong>
                <Caption1>Modified yesterday</Caption1>
              </Card>

              <Card className={styles.card}>
                <Body1Strong>Motion to Dismiss - Smith v. Jones</Body1Strong>
                <Caption1>Modified 3 days ago</Caption1>
              </Card>
            </div>
          )}

          {selectedTab === 'activity' && (
            <div className={styles.section}>
              {/* Activity Header */}
              <div className={styles.activityHeader}>
                <Subtitle2>Today's Activity</Subtitle2>
                <Text className={styles.totalTime}>5h 32m tracked</Text>
                <Button
                  appearance="subtle"
                  size="small"
                  onClick={() => setShowSuggestionPopup(!showSuggestionPopup)}
                >
                  Demo Suggestion
                </Button>
              </div>

              {/* Morning Time Block */}
              <div className={styles.timeBlock}>
                <div className={styles.timeBlockHeader}>Morning</div>

                <Card className={styles.activityItem}>
                  <div className={styles.appIcon} style={{ backgroundColor: '#0078D4' }}>
                    W
                  </div>
                  <div className={styles.activityDetails}>
                    <Body1Strong>Microsoft Word</Body1Strong>
                    <Body1>Motion to Compel Discovery - Johnson v. Tech Corp.docx</Body1>
                    <div className={styles.activityMeta}>
                      <span className={styles.activityDuration}>1h 15m</span>
                      <span>•</span>
                      <span className={styles.activityTime}>8:30 AM - 9:45 AM</span>
                    </div>
                  </div>
                </Card>

                <Card className={styles.activityItem}>
                  <div className={styles.appIcon} style={{ backgroundColor: '#0072C6' }}>
                    O
                  </div>
                  <div className={styles.activityDetails}>
                    <Body1Strong>Outlook</Body1Strong>
                    <Body1>Email: Re: Settlement Negotiations - Wilson Case</Body1>
                    <div className={styles.activityMeta}>
                      <span className={styles.activityDuration}>22m</span>
                      <span>•</span>
                      <span className={styles.activityTime}>9:45 AM - 10:07 AM</span>
                    </div>
                  </div>
                </Card>

                <Card className={styles.activityItem}>
                  <div className={styles.appIcon} style={{ backgroundColor: '#EA4335' }}>
                    C
                  </div>
                  <div className={styles.activityDetails}>
                    <Body1Strong>Chrome</Body1Strong>
                    <Body1>Legal Research - westlaw.com - Employment Law Precedents</Body1>
                    <div className={styles.activityMeta}>
                      <span className={styles.activityDuration}>45m</span>
                      <span>•</span>
                      <span className={styles.activityTime}>10:15 AM - 11:00 AM</span>
                    </div>
                  </div>
                </Card>

                <Card className={styles.activityItem}>
                  <div className={styles.appIcon} style={{ backgroundColor: '#0078D4' }}>
                    W
                  </div>
                  <div className={styles.activityDetails}>
                    <Body1Strong>Microsoft Word</Body1Strong>
                    <Body1>Contract Review - Client Services Agreement - Acme Inc.docx</Body1>
                    <div className={styles.activityMeta}>
                      <span className={styles.activityDuration}>52m</span>
                      <span>•</span>
                      <span className={styles.activityTime}>11:10 AM - 12:02 PM</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Afternoon Time Block */}
              <div className={styles.timeBlock}>
                <div className={styles.timeBlockHeader}>Afternoon</div>

                <Card className={styles.activityItem}>
                  <div className={styles.appIcon} style={{ backgroundColor: '#DC3E15' }}>
                    A
                  </div>
                  <div className={styles.activityDetails}>
                    <Body1Strong>Adobe Acrobat</Body1Strong>
                    <Body1>Reviewing Deposition Transcript - Smith Deposition.pdf</Body1>
                    <div className={styles.activityMeta}>
                      <span className={styles.activityDuration}>1h 8m</span>
                      <span>•</span>
                      <span className={styles.activityTime}>1:15 PM - 2:23 PM</span>
                    </div>
                  </div>
                </Card>

                <Card className={styles.activityItem}>
                  <div className={styles.appIcon} style={{ backgroundColor: '#EA4335' }}>
                    C
                  </div>
                  <div className={styles.activityDetails}>
                    <Body1Strong>Chrome</Body1Strong>
                    <Body1>Case Management - clio.com - Time Entry & Billing</Body1>
                    <div className={styles.activityMeta}>
                      <span className={styles.activityDuration}>18m</span>
                      <span>•</span>
                      <span className={styles.activityTime}>2:30 PM - 2:48 PM</span>
                    </div>
                  </div>
                </Card>

                <Card className={styles.activityItem}>
                  <div className={styles.appIcon} style={{ backgroundColor: '#0072C6' }}>
                    O
                  </div>
                  <div className={styles.activityDetails}>
                    <Body1Strong>Outlook</Body1Strong>
                    <Body1>Email: Client Communication - Case Status Update</Body1>
                    <div className={styles.activityMeta}>
                      <span className={styles.activityDuration}>15m</span>
                      <span>•</span>
                      <span className={styles.activityTime}>3:00 PM - 3:15 PM</span>
                    </div>
                  </div>
                </Card>

                <Card className={styles.activityItem}>
                  <div className={styles.appIcon} style={{ backgroundColor: '#0078D4' }}>
                    W
                  </div>
                  <div className={styles.activityDetails}>
                    <Body1Strong>Microsoft Word</Body1Strong>
                    <Body1>Legal Brief - Summary Judgment Motion - Anderson v. State.docx</Body1>
                    <div className={styles.activityMeta}>
                      <span className={styles.activityDuration}>57m</span>
                      <span>•</span>
                      <span className={styles.activityTime}>3:30 PM - 4:27 PM</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {selectedTab === 'cases' && (
            <div className={styles.section}>
              <Subtitle2 className={styles.cardHeader}>Active Cases</Subtitle2>

              <Card className={styles.card}>
                <Body1Strong>Case #2024-001</Body1Strong>
                <Caption1>Status: In Progress • Next hearing: Jan 15, 2026</Caption1>
              </Card>

              <Card className={styles.card}>
                <Body1Strong>Case #2024-002</Body1Strong>
                <Caption1>Status: Discovery • Next deadline: Jan 20, 2026</Caption1>
              </Card>

              <Card className={styles.card}>
                <Body1Strong>Case #2023-045</Body1Strong>
                <Caption1>Status: Settlement Review • Pending client approval</Caption1>
              </Card>
            </div>
          )}

          {selectedTab === 'timeEntries' && (
            <div className={styles.section}>
              {/* Time Entries Header */}
              <div className={styles.timeEntriesHeader}>
                <div className={styles.timeEntriesHeaderLeft}>
                  <Subtitle2>Time Entries</Subtitle2>
                  <Dropdown
                    value={filterStatus}
                    onOptionSelect={(_, data) => setFilterStatus(data.optionValue || 'Pending Review')}
                    size="small"
                  >
                    <Option value="Pending Review">Pending Review</Option>
                    <Option value="Confirmed">Confirmed</Option>
                    <Option value="All Entries">All Entries</Option>
                  </Dropdown>
                </div>
                <Button
                  appearance="primary"
                  size="small"
                  disabled={!hasConfirmedEntries || isSyncing}
                  onClick={handleSyncAll}
                  icon={isSyncing ? <Spinner size="tiny" /> : undefined}
                >
                  {isSyncing ? 'Syncing...' : 'Sync All Confirmed'}
                </Button>
              </div>

              {/* Time Entry Groups */}
              {['Today', 'Yesterday', 'Earlier This Week'].map((dateGroup) => {
                const entries = groupedEntries[dateGroup] || [];
                if (entries.length === 0) return null;

                return (
                  <div key={dateGroup} className={styles.dateGroup}>
                    <div className={styles.dateGroupHeader}>{dateGroup}</div>

                    {entries.map((entry) => {
                      const statusBadge = entry.status === 'pending'
                        ? { color: 'warning' as const, text: 'Pending' }
                        : entry.status === 'confirmed'
                        ? { color: 'success' as const, text: 'Confirmed' }
                        : { color: 'informative' as const, text: 'Synced' };

                      return (
                        <Card key={entry.id} className={styles.timeEntryCard}>
                          <div className={styles.timeEntryHeader}>
                            <div className={styles.timeEntryContent}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <Badge appearance="filled" color={statusBadge.color} size="small">
                                  {statusBadge.text}
                                </Badge>
                                {entry.status === 'synced' && (
                                  <CheckmarkCircleRegular fontSize={14} style={{ color: tokens.colorPaletteGreenForeground1 }} />
                                )}
                              </div>

                              <Body1Strong>{entry.caseName}</Body1Strong>
                              <Caption1 style={{ color: tokens.colorNeutralForeground3 }}>
                                {entry.caseNumber}
                              </Caption1>

                              <div className={styles.timeEntryMeta}>
                                <span className={styles.timeEntryMetaItem}>
                                  <strong>{entry.taskType}</strong>
                                </span>
                                <span>•</span>
                                <span className={styles.timeEntryMetaItem}>
                                  {entry.duration}
                                </span>
                                <span>•</span>
                                <span className={styles.timeEntryMetaItem}>
                                  {entry.date}
                                </span>
                              </div>

                              <Text className={styles.timeEntryDescription}>
                                {entry.description}
                              </Text>

                              <Caption1 className={styles.timeEntrySource}>
                                {entry.source}
                              </Caption1>
                            </div>
                          </div>

                          {/* Action Buttons or Status */}
                          <div className={styles.timeEntryActions}>
                            {entry.status === 'pending' && (
                              <>
                                <Button
                                  appearance="primary"
                                  size="small"
                                  onClick={() => handleConfirm(entry.id)}
                                >
                                  Confirm
                                </Button>
                                <Button
                                  appearance="subtle"
                                  size="small"
                                  icon={<EditRegular />}
                                  onClick={() => handleEdit(entry.id)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  appearance="subtle"
                                  size="small"
                                  icon={<DeleteRegular />}
                                  onClick={() => handleDelete(entry.id)}
                                >
                                  Delete
                                </Button>
                              </>
                            )}
                            {entry.status === 'confirmed' && (
                              <Text className={styles.timeEntrySyncStatus}>
                                ✓ Ready to sync
                              </Text>
                            )}
                            {entry.status === 'synced' && (
                              <Text style={{ fontSize: '12px', color: tokens.colorPaletteGreenForeground1, fontWeight: '500' }}>
                                ✓ Synced
                              </Text>
                            )}
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}

          {selectedTab === 'settings' && (
            <div className={styles.section}>
              <Subtitle2 style={{ marginBottom: '24px' }}>Settings</Subtitle2>

              {/* Clio Integration Section */}
              <div className={styles.settingsSection}>
                <div className={styles.settingsSectionHeader}>
                  <CloudCheckmarkRegular fontSize={20} />
                  <Body1Strong>Clio Integration</Body1Strong>
                </div>

                <Card className={styles.settingsCard}>
                  {/* Connection Status */}
                  <div className={styles.connectionStatus}>
                    <div className={styles.statusDot}></div>
                    <Body1Strong style={{ color: tokens.colorPaletteGreenForeground1 }}>
                      Connected to Clio
                    </Body1Strong>
                  </div>

                  <Divider />

                  {/* Account Info */}
                  <div className={styles.settingsRow}>
                    <Text className={styles.settingsLabel}>ACCOUNT</Text>
                    <Text className={styles.settingsValue}>Kenneth's Law Practice</Text>
                  </div>

                  {/* Last Sync */}
                  <div className={styles.settingsRow}>
                    <Text className={styles.settingsLabel}>LAST SYNC</Text>
                    <Text className={styles.settingsValue}>
                      {lastSyncTime === 'Just now' ? 'Last synced: Just now' : `Last synced: ${lastSyncTime}`}
                    </Text>
                  </div>

                  <Divider />

                  {/* Action Buttons */}
                  <div className={styles.settingsActions}>
                    <Button
                      appearance="primary"
                      icon={isSyncing ? <Spinner size="tiny" /> : <ArrowSyncRegular />}
                      disabled={isSyncing}
                      onClick={handleManualSync}
                    >
                      {isSyncing ? 'Syncing...' : 'Sync Now'}
                    </Button>
                    <Button
                      appearance="subtle"
                      icon={<PlugDisconnectedRegular />}
                    >
                      Disconnect
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className={styles.toast}>
          <CheckmarkCircleFilled className={styles.toastIcon} />
          <div className={styles.toastContent}>
            <Body1Strong>{toastMessage}</Body1Strong>
            <Caption1 style={{ color: tokens.colorNeutralForeground3 }}>
              Clio sync completed successfully
            </Caption1>
          </div>
        </div>
      )}

      {/* Suggestion Popup */}
      <SuggestionPopup
        visible={showSuggestionPopup}
        onClose={() => setShowSuggestionPopup(false)}
      />

      {/* Tray Demo Panel */}
      <TrayDemo onNavigateToActivity={() => setSelectedTab('activity')} />
    </div>
  );
};

export default App;
