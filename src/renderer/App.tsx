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
  Spinner,
  Radio,
  RadioGroup,
  Slider,
  Switch,
  Input,
  Checkbox,
  Label,
  Textarea,
  Link
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
  CheckmarkCircleFilled,
  AlertRegular,
  PlayRegular,
  PauseRegular,
  BriefcaseRegular,
  AddRegular,
  ReOrderDotsVerticalRegular,
  DismissRegular,
  HistoryRegular
} from '@fluentui/react-icons';
import SuggestionPopup from './components/SuggestionPopup';
import TrayDemo from './components/TrayDemo';

type TimeEntryStatus = 'pending' | 'confirmed' | 'synced' | 'failed';

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
  error?: string;
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
    alignItems: 'flex-start',
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
    textAlign: 'left',
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
  settingsTabList: {
    marginBottom: '24px',
  },
  helperText: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    marginTop: '8px',
    lineHeight: '1.4',
  },
  confidenceTable: {
    width: '100%',
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    marginBottom: '16px',
    overflow: 'hidden',
  },
  confidenceRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 2fr',
    ...shorthands.padding('12px', '16px'),
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke2),
    '&:last-child': {
      ...shorthands.border('none'),
    },
  },
  confidenceHeader: {
    backgroundColor: tokens.colorNeutralBackground3,
    fontWeight: '600',
    fontSize: '12px',
    textTransform: 'uppercase',
  },
  sliderContainer: {
    marginBottom: '20px',
  },
  sliderLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    fontSize: '13px',
  },
  timePickerRow: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    marginTop: '12px',
    marginBottom: '12px',
  },
  dayCheckboxes: {
    display: 'flex',
    ...shorthands.gap('16px'),
    marginTop: '12px',
  },
  pauseStatusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    ...shorthands.gap('6px'),
    marginBottom: '12px',
  },
  buttonRow: {
    display: 'flex',
    ...shorthands.gap('8px'),
  },
  formField: {
    marginBottom: '24px',
  },
  fieldLabel: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    fontSize: '14px',
  },
  textarea: {
    width: '100%',
    fontFamily: 'Segoe UI, sans-serif',
  },
  characterCount: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
    marginTop: '4px',
    textAlign: 'right',
  },
  versionInfo: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
    marginTop: '8px',
    marginBottom: '12px',
  },
  categoryList: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
    marginBottom: '12px',
  },
  categoryItem: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    ...shorthands.padding('8px', '12px'),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    cursor: 'move',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground3Hover,
    },
  },
  dragHandle: {
    color: tokens.colorNeutralForeground4,
    cursor: 'grab',
    ':active': {
      cursor: 'grabbing',
    },
  },
  categoryName: {
    flex: 1,
    fontSize: '14px',
  },
  deleteButton: {
    minWidth: 'auto',
    ...shorthands.padding('4px'),
  },
  checkboxList: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('12px'),
  },
  settingsFooter: {
    marginTop: '24px',
    ...shorthands.padding('16px', '0'),
    ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saveIndicator: {
    fontSize: '12px',
    color: tokens.colorPaletteGreenForeground1,
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('6px'),
  },
  fieldMappingTable: {
    width: '100%',
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    marginTop: '12px',
    marginBottom: '12px',
    overflow: 'hidden',
  },
  fieldMappingRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    ...shorthands.padding('10px', '16px'),
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke2),
    '&:last-child': {
      ...shorthands.border('none'),
    },
  },
  fieldMappingHeader: {
    backgroundColor: tokens.colorNeutralBackground3,
    fontWeight: '600',
    fontSize: '12px',
  },
  mappingHelperText: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('6px'),
    fontSize: '12px',
    color: tokens.colorPaletteGreenForeground1,
    marginBottom: '8px',
  },
  syncHistorySection: {
    marginTop: '20px',
    marginBottom: '20px',
  },
  syncHistoryHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    marginBottom: '12px',
    ':hover': {
      opacity: 0.8,
    },
  },
  syncHistoryList: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
  },
  syncHistoryItem: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    ...shorthands.padding('10px', '12px'),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    fontSize: '13px',
  },
  syncHistoryItemClickable: {
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground3Hover,
    },
  },
  syncPreferencesSection: {
    marginTop: '20px',
  },
});

const App: React.FC = () => {
  const styles = useStyles();
  const [selectedTab, setSelectedTab] = useState('documents');
  const [suggestionPopupMode, setSuggestionPopupMode] = useState<'hidden' | 'high' | 'low'>('hidden');
  const [filterStatus, setFilterStatus] = useState('Pending Review');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('2 minutes ago');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Settings tab state
  const [settingsTab, setSettingsTab] = useState('interruptions');

  // Firm Settings state
  const [defaultEntryPrefix, setDefaultEntryPrefix] = useState('Review and analysis of...');
  const [customAIInstructions, setCustomAIInstructions] = useState(`- Always categorize Westlaw/LexisNexis as Legal Research
- Minimum billing increment: 6 minutes (0.1 hours)
- Round up to nearest increment
- Combine consecutive same-matter activities under 5 min gap`);
  const [taskCategories, setTaskCategories] = useState([
    { id: '1', name: 'Document Review' },
    { id: '2', name: 'Legal Research' },
    { id: '3', name: 'Client Communication' },
    { id: '4', name: 'Court Appearance' },
    { id: '5', name: 'Drafting' },
    { id: '6', name: 'Administrative' }
  ]);
  const [requiredDescription, setRequiredDescription] = useState(true);
  const [requiredTaskCategory, setRequiredTaskCategory] = useState(false);
  const [requiredBillingCode, setRequiredBillingCode] = useState(false);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  // Clio Integration state
  const [syncHistoryExpanded, setSyncHistoryExpanded] = useState(true);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [manualSyncOnly, setManualSyncOnly] = useState(false);
  const [showSyncFailureNotifications, setShowSyncFailureNotifications] = useState(true);

  // Interruptions settings state
  const [suggestionFrequency, setSuggestionFrequency] = useState('after-work-block');
  const [highConfidenceThreshold, setHighConfidenceThreshold] = useState(80);
  const [lowConfidenceThreshold, setLowConfidenceThreshold] = useState(50);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
  const [quietHoursFrom, setQuietHoursFrom] = useState('18:00');
  const [quietHoursTo, setQuietHoursTo] = useState('08:00');
  const [quietHoursWeekdays, setQuietHoursWeekdays] = useState(true);
  const [quietHoursWeekends, setQuietHoursWeekends] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [pausedUntil, setPausedUntil] = useState<string | null>(null);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([
    {
      id: '1',
      status: 'failed',
      caseName: 'ABC Corp Matter',
      caseNumber: '2024-CV-9999',
      taskType: 'Document Review',
      duration: '45m',
      date: 'Jan 3, 2026',
      dateGroup: 'Today',
      description: 'Reviewed corporate documents and compliance materials for ABC Corp transaction.',
      source: 'Auto-captured',
      error: "Clio error: Matter not found"
    },
    {
      id: '2',
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
      id: '3',
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
      id: '4',
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
      id: '5',
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
      id: '6',
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
      id: '7',
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

  // Helper function to cycle through suggestion popup modes
  const cycleSuggestionPopup = () => {
    setSuggestionPopupMode(current => {
      if (current === 'hidden') return 'high';
      if (current === 'high') return 'low';
      return 'hidden';
    });
  };

  const handleRetry = (id: string) => {
    // Simulate retry logic - set status to pending
    setTimeEntries(entries =>
      entries.map(entry =>
        entry.id === id ? { ...entry, status: 'pending' as TimeEntryStatus, error: undefined } : entry
      )
    );
    setToastMessage('Entry queued for retry');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
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

  // Interruptions pause handlers
  const handlePauseFor1Hour = () => {
    const now = new Date();
    const pauseUntil = new Date(now.getTime() + 60 * 60 * 1000);
    setIsPaused(true);
    setPausedUntil(pauseUntil.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));

    // Show toast
    setToastMessage('Suggestions paused for 1 hour');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handlePauseUntilTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(8, 0, 0, 0);
    setIsPaused(true);
    setPausedUntil('tomorrow 8:00 AM');

    // Show toast
    setToastMessage('Suggestions paused until tomorrow');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleResume = () => {
    setIsPaused(false);
    setPausedUntil(null);

    // Show toast
    setToastMessage('Suggestions resumed');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  // Firm Settings handlers
  const handleSaveAIInstructions = () => {
    setToastMessage('AI Instructions saved successfully');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleViewHistory = () => {
    alert('Version history coming soon');
  };

  const handleAddCategory = () => {
    const newCategory = {
      id: String(Date.now()),
      name: ''
    };
    setTaskCategories([...taskCategories, newCategory]);
  };

  const handleDeleteCategory = (id: string) => {
    setTaskCategories(taskCategories.filter(cat => cat.id !== id));
  };

  const handleCategoryNameChange = (id: string, newName: string) => {
    setTaskCategories(taskCategories.map(cat =>
      cat.id === id ? { ...cat, name: newName } : cat
    ));
  };

  const handleDragStart = (id: string) => {
    setDraggedItemId(id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItemId || draggedItemId === targetId) return;

    const draggedIndex = taskCategories.findIndex(cat => cat.id === draggedItemId);
    const targetIndex = taskCategories.findIndex(cat => cat.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newCategories = [...taskCategories];
    const [draggedItem] = newCategories.splice(draggedIndex, 1);
    newCategories.splice(targetIndex, 0, draggedItem);

    setTaskCategories(newCategories);
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
  };

  const handleResetToDefaults = () => {
    if (confirm('Are you sure you want to reset all firm settings to defaults? This action cannot be undone.')) {
      setDefaultEntryPrefix('Review and analysis of...');
      setCustomAIInstructions(`- Always categorize Westlaw/LexisNexis as Legal Research
- Minimum billing increment: 6 minutes (0.1 hours)
- Round up to nearest increment
- Combine consecutive same-matter activities under 5 min gap`);
      setTaskCategories([
        { id: '1', name: 'Document Review' },
        { id: '2', name: 'Legal Research' },
        { id: '3', name: 'Client Communication' },
        { id: '4', name: 'Court Appearance' },
        { id: '5', name: 'Drafting' },
        { id: '6', name: 'Administrative' }
      ]);
      setRequiredDescription(true);
      setRequiredTaskCategory(false);
      setRequiredBillingCode(false);

      setToastMessage('Settings reset to defaults');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }
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
                  onClick={cycleSuggestionPopup}
                >
                  Demo Suggestion {suggestionPopupMode !== 'hidden' && `(${suggestionPopupMode === 'high' ? 'High' : 'Low'})`}
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
                        : entry.status === 'failed'
                        ? { color: 'danger' as const, text: 'Failed' }
                        : { color: 'informative' as const, text: 'Synced' };

                      return (
                        <Card key={entry.id} className={styles.timeEntryCard}>
                          <div className={styles.timeEntryHeader}>
                            <div className={styles.timeEntryContent}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                {entry.status === 'failed' ? (
                                  <Tooltip content={entry.error || 'Sync failed'} relationship="label">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                      <Badge appearance="filled" color={statusBadge.color} size="small">
                                        {statusBadge.text}
                                      </Badge>
                                      <AlertRegular fontSize={14} style={{ color: tokens.colorPaletteRedForeground1 }} />
                                    </div>
                                  </Tooltip>
                                ) : (
                                  <>
                                    <Badge appearance="filled" color={statusBadge.color} size="small">
                                      {statusBadge.text}
                                    </Badge>
                                    {entry.status === 'synced' && (
                                      <CheckmarkCircleRegular fontSize={14} style={{ color: tokens.colorPaletteGreenForeground1 }} />
                                    )}
                                  </>
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
                            {entry.status === 'failed' && (
                              <>
                                <Button
                                  appearance="primary"
                                  size="small"
                                  onClick={() => handleRetry(entry.id)}
                                >
                                  Retry
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

              {/* Settings Tabs */}
              <TabList
                selectedValue={settingsTab}
                onTabSelect={(_, data) => setSettingsTab(data.value as string)}
                className={styles.settingsTabList}
              >
                <Tab value="general">General</Tab>
                <Tab value="firm">Firm Settings</Tab>
                <Tab value="interruptions">Interruptions</Tab>
                <Tab value="clio">Clio Integration</Tab>
              </TabList>

              {/* General Settings Tab */}
              {settingsTab === 'general' && (
                <div className={styles.settingsSection}>
                  <div className={styles.settingsSectionHeader}>
                    <SettingsRegular fontSize={20} />
                    <Body1Strong>General</Body1Strong>
                  </div>

                  <Card className={styles.settingsCard}>
                    <div className={styles.formField}>
                      <Label className={styles.fieldLabel}>Application Preferences</Label>
                      <div className={styles.checkboxList}>
                        <Checkbox
                          label="Launch at startup"
                          defaultChecked
                        />
                        <Checkbox
                          label="Show notifications"
                          defaultChecked
                        />
                        <Checkbox
                          label="Minimize to system tray on close"
                        />
                      </div>
                    </div>

                    <Divider />

                    <div className={styles.formField}>
                      <Label className={styles.fieldLabel}>Theme</Label>
                      <RadioGroup defaultValue="light">
                        <Radio value="light" label="Light" />
                        <Radio value="dark" label="Dark" />
                        <Radio value="system" label="Use system preference" />
                      </RadioGroup>
                    </div>
                  </Card>
                </div>
              )}

              {/* Firm Settings Tab */}
              {settingsTab === 'firm' && (
                <div className={styles.settingsSection}>
                  <div className={styles.settingsSectionHeader}>
                    <BriefcaseRegular fontSize={20} />
                    <Body1Strong>Firm Settings</Body1Strong>
                  </div>

                  <Card className={styles.settingsCard}>
                    {/* 1. Billing Language Preferences */}
                    <div className={styles.formField}>
                      <Label className={styles.fieldLabel}>Default Entry Prefix</Label>
                      <Textarea
                        className={styles.textarea}
                        value={defaultEntryPrefix}
                        onChange={(_, data) => setDefaultEntryPrefix(data.value)}
                        rows={3}
                        placeholder="Review and analysis of..."
                        resize="vertical"
                      />
                      <Text className={styles.helperText}>
                        This language is prepended to auto-generated time entry descriptions
                      </Text>
                      <div className={styles.characterCount}>
                        {defaultEntryPrefix.length}/500 characters
                      </div>
                    </div>

                    <Divider />

                    {/* 2. AI Instructions */}
                    <div className={styles.formField}>
                      <Label className={styles.fieldLabel}>Custom AI Instructions</Label>
                      <Textarea
                        className={styles.textarea}
                        value={customAIInstructions}
                        onChange={(_, data) => setCustomAIInstructions(data.value)}
                        rows={5}
                        resize="vertical"
                      />
                      <div className={styles.versionInfo}>
                        v3 · Last updated Jan 2, 2026
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button
                          appearance="primary"
                          size="small"
                          onClick={handleSaveAIInstructions}
                        >
                          Save Changes
                        </Button>
                        <Link
                          onClick={handleViewHistory}
                          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                        >
                          <HistoryRegular fontSize={14} style={{ marginRight: '4px' }} />
                          View History
                        </Link>
                      </div>
                    </div>

                    <Divider />

                    {/* 3. Default Task Categories */}
                    <div className={styles.formField}>
                      <Label className={styles.fieldLabel}>Task Categories</Label>
                      <div className={styles.categoryList}>
                        {taskCategories.map((category) => (
                          <div
                            key={category.id}
                            className={styles.categoryItem}
                            draggable
                            onDragStart={() => handleDragStart(category.id)}
                            onDragOver={(e) => handleDragOver(e, category.id)}
                            onDragEnd={handleDragEnd}
                          >
                            <ReOrderDotsVerticalRegular
                              className={styles.dragHandle}
                              fontSize={16}
                            />
                            <Input
                              className={styles.categoryName}
                              value={category.name}
                              onChange={(_, data) => handleCategoryNameChange(category.id, data.value)}
                              placeholder="Category name"
                            />
                            <Button
                              appearance="subtle"
                              icon={<DismissRegular />}
                              size="small"
                              className={styles.deleteButton}
                              onClick={() => handleDeleteCategory(category.id)}
                            />
                          </div>
                        ))}
                      </div>
                      <Button
                        appearance="secondary"
                        icon={<AddRegular />}
                        size="small"
                        onClick={handleAddCategory}
                      >
                        Add Category
                      </Button>
                      <Text className={styles.helperText}>
                        These categories appear in time entry suggestions
                      </Text>
                    </div>

                    <Divider />

                    {/* 4. Required Fields */}
                    <div className={styles.formField}>
                      <Label className={styles.fieldLabel}>Required Fields for Sync</Label>
                      <div className={styles.checkboxList}>
                        <Checkbox
                          label="Matter"
                          checked={true}
                          disabled
                        />
                        <Checkbox
                          label="Description"
                          checked={requiredDescription}
                          onChange={(_, data) => setRequiredDescription(data.checked === true)}
                        />
                        <Checkbox
                          label="Task Category"
                          checked={requiredTaskCategory}
                          onChange={(_, data) => setRequiredTaskCategory(data.checked === true)}
                        />
                        <Checkbox
                          label="Billing Code"
                          checked={requiredBillingCode}
                          onChange={(_, data) => setRequiredBillingCode(data.checked === true)}
                        />
                      </div>
                      <Text className={styles.helperText}>
                        Entries missing required fields cannot sync to Clio
                      </Text>
                    </div>

                    {/* Footer */}
                    <div className={styles.settingsFooter}>
                      <Link onClick={handleResetToDefaults} style={{ cursor: 'pointer' }}>
                        Reset to Defaults
                      </Link>
                      <div className={styles.saveIndicator}>
                        <CheckmarkCircleRegular fontSize={14} />
                        All changes saved
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Interruptions Tab */}
              {settingsTab === 'interruptions' && (
                <div className={styles.settingsSection}>
                  <div className={styles.settingsSectionHeader}>
                    <AlertRegular fontSize={20} />
                    <Body1Strong>Interruptions</Body1Strong>
                  </div>

                  <Card className={styles.settingsCard}>
                    {/* 1. Suggestion Frequency */}
                    <div className={styles.formField}>
                      <Label className={styles.fieldLabel}>When to show suggestions</Label>
                      <RadioGroup
                        value={suggestionFrequency}
                        onChange={(_, data) => setSuggestionFrequency(data.value)}
                      >
                        <Radio value="after-work-block" label="After each work block ends" />
                        <Radio value="batch-hourly" label="Batch suggestions every hour" />
                        <Radio value="never" label="Never interrupt - Review Queue only" />
                      </RadioGroup>
                      <Text className={styles.helperText}>
                        Work blocks are detected when you switch contexts or take a break
                      </Text>
                    </div>

                    <Divider />

                    {/* 2. Confidence Behavior */}
                    <div className={styles.formField}>
                      <Label className={styles.fieldLabel}>How to handle suggestions by confidence</Label>

                      {/* Confidence Table */}
                      <div className={styles.confidenceTable}>
                        <div className={`${styles.confidenceRow} ${styles.confidenceHeader}`}>
                          <Text>Confidence</Text>
                          <Text>Threshold</Text>
                          <Text>Behavior</Text>
                        </div>
                        <div className={styles.confidenceRow}>
                          <Text>High</Text>
                          <Text>&gt;80%</Text>
                          <Text>Queue silently (no popup)</Text>
                        </div>
                        <div className={styles.confidenceRow}>
                          <Text>Medium</Text>
                          <Text>50-80%</Text>
                          <Text>Show popup suggestion</Text>
                        </div>
                        <div className={styles.confidenceRow}>
                          <Text>Low</Text>
                          <Text>&lt;50%</Text>
                          <Text>Skip - requires manual entry</Text>
                        </div>
                      </div>

                      {/* Threshold Sliders */}
                      <div className={styles.sliderContainer}>
                        <div className={styles.sliderLabel}>
                          <Text>High confidence threshold</Text>
                          <Text style={{ fontWeight: '600' }}>{highConfidenceThreshold}%</Text>
                        </div>
                        <Slider
                          min={60}
                          max={95}
                          value={highConfidenceThreshold}
                          onChange={(_, data) => setHighConfidenceThreshold(data.value)}
                        />
                      </div>

                      <div className={styles.sliderContainer}>
                        <div className={styles.sliderLabel}>
                          <Text>Low confidence threshold</Text>
                          <Text style={{ fontWeight: '600' }}>{lowConfidenceThreshold}%</Text>
                        </div>
                        <Slider
                          min={20}
                          max={70}
                          value={lowConfidenceThreshold}
                          onChange={(_, data) => setLowConfidenceThreshold(data.value)}
                        />
                      </div>

                      <Text className={styles.helperText}>
                        Higher thresholds = fewer automatic entries, more popups
                      </Text>
                    </div>

                    <Divider />

                    {/* 3. Quiet Hours */}
                    <div className={styles.formField}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <Switch
                          checked={quietHoursEnabled}
                          onChange={(_, data) => setQuietHoursEnabled(data.checked)}
                        />
                        <Label className={styles.fieldLabel} style={{ marginBottom: '0' }}>Enable Quiet Hours</Label>
                      </div>

                      {quietHoursEnabled && (
                        <>
                          <div className={styles.timePickerRow}>
                            <Text>From</Text>
                            <Input
                              type="time"
                              value={quietHoursFrom}
                              onChange={(_, data) => setQuietHoursFrom(data.value)}
                              style={{ width: '120px' }}
                            />
                            <Text>to</Text>
                            <Input
                              type="time"
                              value={quietHoursTo}
                              onChange={(_, data) => setQuietHoursTo(data.value)}
                              style={{ width: '120px' }}
                            />
                          </div>

                          <div className={styles.dayCheckboxes}>
                            <Checkbox
                              label="Weekdays"
                              checked={quietHoursWeekdays}
                              onChange={(_, data) => setQuietHoursWeekdays(data.checked === true)}
                            />
                            <Checkbox
                              label="Weekends"
                              checked={quietHoursWeekends}
                              onChange={(_, data) => setQuietHoursWeekends(data.checked === true)}
                            />
                          </div>
                        </>
                      )}

                      <Text className={styles.helperText}>
                        During quiet hours, all suggestions go to Review Queue silently
                      </Text>
                    </div>

                    <Divider />

                    {/* 4. Quick Pause Controls */}
                    <div className={styles.formField}>
                      <Label className={styles.fieldLabel}>Quick Actions</Label>

                      {/* Status Badge */}
                      <div className={styles.pauseStatusBadge}>
                        <Badge
                          appearance="filled"
                          color={isPaused ? 'warning' : 'success'}
                          size="medium"
                          icon={isPaused ? <PauseRegular /> : <PlayRegular />}
                        >
                          {isPaused ? `Paused until ${pausedUntil}` : 'Suggestions: Active'}
                        </Badge>
                      </div>

                      {/* Action Buttons */}
                      <div className={styles.buttonRow}>
                        {!isPaused ? (
                          <>
                            <Button
                              appearance="secondary"
                              onClick={handlePauseFor1Hour}
                            >
                              Pause for 1 hour
                            </Button>
                            <Button
                              appearance="secondary"
                              onClick={handlePauseUntilTomorrow}
                            >
                              Pause until tomorrow
                            </Button>
                          </>
                        ) : (
                          <Button
                            appearance="primary"
                            icon={<PlayRegular />}
                            onClick={handleResume}
                          >
                            Resume
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Clio Integration Tab */}
              {settingsTab === 'clio' && (
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

                    {/* Field Mapping */}
                    <div className={styles.settingsRow}>
                      <Text className={styles.settingsLabel}>FIELD MAPPING</Text>
                      <div className={styles.fieldMappingTable}>
                        <div className={`${styles.fieldMappingRow} ${styles.fieldMappingHeader}`}>
                          <Text>LegalApp Field</Text>
                          <Text>Clio Field</Text>
                        </div>
                        <div className={styles.fieldMappingRow}>
                          <Text>Matter</Text>
                          <Text>Matter</Text>
                        </div>
                        <div className={styles.fieldMappingRow}>
                          <Text>Duration</Text>
                          <Text>Time</Text>
                        </div>
                        <div className={styles.fieldMappingRow}>
                          <Text>Description</Text>
                          <Text>Note</Text>
                        </div>
                        <div className={styles.fieldMappingRow}>
                          <Text>Task Category</Text>
                          <Text>Activity Code</Text>
                        </div>
                        <div className={styles.fieldMappingRow}>
                          <Text>Date</Text>
                          <Text>Entry Date</Text>
                        </div>
                      </div>
                      <div className={styles.mappingHelperText}>
                        <CheckmarkCircleRegular fontSize={14} />
                        <Text>Mapping configured correctly</Text>
                      </div>
                      <Link
                        onClick={() => alert('Custom mapping coming soon')}
                        style={{ cursor: 'pointer', fontSize: '13px' }}
                      >
                        Edit Mapping
                      </Link>
                    </div>

                    <Divider />

                    {/* Sync History */}
                    <div className={styles.syncHistorySection}>
                      <div
                        className={styles.syncHistoryHeader}
                        onClick={() => setSyncHistoryExpanded(!syncHistoryExpanded)}
                      >
                        <Text className={styles.settingsLabel}>RECENT SYNC HISTORY</Text>
                        <Text style={{ fontSize: '12px', color: tokens.colorNeutralForeground3 }}>
                          {syncHistoryExpanded ? '▼' : '▶'}
                        </Text>
                      </div>
                      {syncHistoryExpanded && (
                        <>
                          <div className={styles.syncHistoryList}>
                            <div className={styles.syncHistoryItem}>
                              <Text>Today 3:42 PM · 3 entries · </Text>
                              <CheckmarkCircleRegular fontSize={14} style={{ color: tokens.colorPaletteGreenForeground1 }} />
                              <Text style={{ color: tokens.colorPaletteGreenForeground1 }}>Success</Text>
                            </div>
                            <div className={styles.syncHistoryItem}>
                              <Text>Today 11:15 AM · 2 entries · </Text>
                              <CheckmarkCircleRegular fontSize={14} style={{ color: tokens.colorPaletteGreenForeground1 }} />
                              <Text style={{ color: tokens.colorPaletteGreenForeground1 }}>Success</Text>
                            </div>
                            <div
                              className={`${styles.syncHistoryItem} ${styles.syncHistoryItemClickable}`}
                              onClick={() => alert("Clio error: Matter 'ABC Corp' not found in Clio")}
                            >
                              <Text>Yesterday 5:30 PM · 5 entries · </Text>
                              <AlertRegular fontSize={14} style={{ color: tokens.colorPaletteYellowForeground1 }} />
                              <Text style={{ color: tokens.colorPaletteYellowForeground1 }}>1 failed</Text>
                            </div>
                            <div className={styles.syncHistoryItem}>
                              <Text>Yesterday 12:00 PM · 4 entries · </Text>
                              <CheckmarkCircleRegular fontSize={14} style={{ color: tokens.colorPaletteGreenForeground1 }} />
                              <Text style={{ color: tokens.colorPaletteGreenForeground1 }}>Success</Text>
                            </div>
                            <div className={styles.syncHistoryItem}>
                              <Text>Dec 31 · 6 entries · </Text>
                              <CheckmarkCircleRegular fontSize={14} style={{ color: tokens.colorPaletteGreenForeground1 }} />
                              <Text style={{ color: tokens.colorPaletteGreenForeground1 }}>Success</Text>
                            </div>
                          </div>
                          <Link
                            onClick={() => alert('Full sync history coming soon')}
                            style={{ cursor: 'pointer', fontSize: '13px', marginTop: '12px', display: 'inline-block' }}
                          >
                            View Full History
                          </Link>
                        </>
                      )}
                    </div>

                    <Divider />

                    {/* Sync Preferences */}
                    <div className={styles.syncPreferencesSection}>
                      <Text className={styles.settingsLabel} style={{ marginBottom: '12px', display: 'block' }}>
                        SYNC PREFERENCES
                      </Text>
                      <div className={styles.checkboxList}>
                        <Checkbox
                          label="Auto-sync confirmed entries every hour"
                          checked={autoSyncEnabled}
                          onChange={(_, data) => {
                            setAutoSyncEnabled(data.checked === true);
                            if (data.checked) setManualSyncOnly(false);
                          }}
                        />
                        <Checkbox
                          label="Require manual sync only"
                          checked={manualSyncOnly}
                          onChange={(_, data) => {
                            setManualSyncOnly(data.checked === true);
                            if (data.checked) setAutoSyncEnabled(false);
                          }}
                        />
                        <Checkbox
                          label="Show notification on sync failure"
                          checked={showSyncFailureNotifications}
                          onChange={(_, data) => setShowSyncFailureNotifications(data.checked === true)}
                        />
                      </div>
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
              )}
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
        visible={suggestionPopupMode !== 'hidden'}
        onClose={() => setSuggestionPopupMode('hidden')}
        confidenceLevel={suggestionPopupMode === 'low' ? 'low' : 'high'}
      />

      {/* Tray Demo Panel */}
      <TrayDemo onNavigateToActivity={() => setSelectedTab('activity')} />
    </div>
  );
};

export default App;
