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
  Subtitle2
} from '@fluentui/react-components';
import {
  DocumentRegular,
  FolderRegular,
  ClockRegular,
  SettingsRegular,
  SearchRegular
} from '@fluentui/react-icons';
import SuggestionPopup from './components/SuggestionPopup';

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
});

const App: React.FC = () => {
  const styles = useStyles();
  const [selectedTab, setSelectedTab] = useState('documents');
  const [showSuggestionPopup, setShowSuggestionPopup] = useState(false);

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
        <Button appearance="subtle" icon={<SettingsRegular />}>
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
            appearance={selectedTab === 'cases' ? 'primary' : 'subtle'}
            icon={<FolderRegular />}
            className={styles.sidebarButton}
            onClick={() => setSelectedTab('cases')}
          >
            Cases
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
        </div>
      </div>

      {/* Suggestion Popup */}
      <SuggestionPopup
        visible={showSuggestionPopup}
        onClose={() => setShowSuggestionPopup(false)}
      />
    </div>
  );
};

export default App;
