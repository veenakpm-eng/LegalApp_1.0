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
  SettingsRegular,
  SearchRegular
} from '@fluentui/react-icons';

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
});

const App: React.FC = () => {
  const styles = useStyles();
  const [selectedTab, setSelectedTab] = useState('documents');

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
    </div>
  );
};

export default App;
