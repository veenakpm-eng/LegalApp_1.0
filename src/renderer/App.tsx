import React, { useState } from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  SearchBox,
  Button,
  Text,
} from '@fluentui/react-components';
import {
  SettingsRegular,
} from '@fluentui/react-icons';
import Sidebar from './components/Sidebar/Sidebar';
import DocumentsView from './views/DocumentsView/DocumentsView';
import CasesView from './views/CasesView/CasesView';
import SettingsView from './views/SettingsView/SettingsView';
import SuggestionPopup from './components/SuggestionPopup';
import TrayDemo from './components/TrayDemo';
import MicaBackground from './components/MicaBackground';
import type { Document } from './views/DocumentsView/DocumentsView';
import type { Case } from './views/CasesView/CasesView';

/**
 * Main App Component
 *
 * Integrated layout with:
 * - New Sidebar component (220px width)
 * - Mica Alt background effects
 * - Custom title bar
 * - Search bar in header
 * - View routing system
 * - Smooth view transitions
 * - Settings gear icon
 */

// View type definition
type ViewType = 'documents' | 'cases' | 'activity' | 'timeEntries' | 'settings';

// Styles
const useStyles = makeStyles({
  app: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    // Background is now handled by MicaBackground component
  },

  titleBar: {
    height: '32px',
    backgroundColor: 'transparent', // Transparent to show Mica effect
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.padding('0', '12px'),
    WebkitAppRegion: 'drag' as any,
    flexShrink: 0,
  },

  titleBarText: {
    fontSize: '12px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground2,
    letterSpacing: '0.5px',
  },

  header: {
    height: '60px',
    backgroundColor: 'var(--mica-header)', // Dynamic background using CSS custom property
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.padding('0', '20px'),
    ...shorthands.gap('16px'),
    flexShrink: 0,
    backdropFilter: 'blur(10px)', // Additional blur for header
    WebkitBackdropFilter: 'blur(10px)', // Safari support
  },

  searchContainer: {
    flex: 1,
    maxWidth: '600px',
  },

  headerActions: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
  },

  mainLayout: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },

  contentArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    // Background is now handled by MicaBackground component
  },

  viewContainer: {
    flex: 1,
    ...shorthands.padding('24px', '32px'),
    overflowY: 'auto',
    overflowX: 'hidden',
    position: 'relative',
  },

  viewContent: {
    opacity: 1,
    transform: 'translateY(0)',
    transition: 'opacity 300ms ease-in-out, transform 300ms ease-in-out',
  },

  viewContentEntering: {
    opacity: 0,
    transform: 'translateY(10px)',
  },

  viewContentExiting: {
    opacity: 0,
    transform: 'translateY(-10px)',
  },

  placeholderView: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    ...shorthands.gap('16px'),
    textAlign: 'center',
  },

  placeholderIcon: {
    fontSize: '64px',
    color: tokens.colorNeutralForeground4,
  },

  placeholderTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground2,
  },

  placeholderDescription: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground3,
    maxWidth: '500px',
  },
});

// Sample data for DocumentsView
const sampleDocuments: Document[] = [
  {
    id: '1',
    title: 'Motion to Compel Discovery - Johnson v. Tech Corp.docx',
    fileType: 'word',
    modifiedDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    caseName: 'Johnson v. Tech Corp',
    caseNumber: '2024-CV-1234',
  },
  {
    id: '2',
    title: 'Contract Agreement - Client A.pdf',
    fileType: 'pdf',
    modifiedDate: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    caseName: 'ABC Corp Matter',
    caseNumber: '2024-CV-9999',
  },
  {
    id: '3',
    title: 'Settlement Negotiations - Wilson Case.docx',
    fileType: 'word',
    modifiedDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    caseName: 'Wilson Settlement',
    caseNumber: '2024-CV-5678',
  },
  {
    id: '4',
    title: 'Deposition Transcript - Smith.pdf',
    fileType: 'pdf',
    modifiedDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    caseName: 'Smith Deposition',
    caseNumber: '2024-CV-3456',
  },
  {
    id: '5',
    title: 'Legal Brief - Summary Judgment Motion.docx',
    fileType: 'word',
    modifiedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    caseName: 'Anderson v. State',
    caseNumber: '2024-CR-7890',
  },
  {
    id: '6',
    title: 'Trust Amendment Documents.pdf',
    fileType: 'pdf',
    modifiedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    caseName: 'Estate of Thompson',
    caseNumber: '2024-PR-2345',
  },
];

// Sample data for CasesView
const sampleCases: Case[] = [
  {
    id: '1',
    caseNumber: '2024-CV-1234',
    status: 'In Progress',
    clientName: 'Johnson Tech Corp',
    nextHearingDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    description: 'Employment law case involving discovery motion requirements',
    createdDate: new Date('2024-01-15'),
  },
  {
    id: '2',
    caseNumber: '2024-CV-9999',
    status: 'Discovery',
    clientName: 'ABC Corporation',
    deadlineDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    description: 'Corporate transaction and compliance matter',
    createdDate: new Date('2024-02-01'),
  },
  {
    id: '3',
    caseNumber: '2024-CV-5678',
    status: 'Settlement Review',
    clientName: 'Wilson Estate',
    description: 'Settlement negotiations pending client approval',
    createdDate: new Date('2024-03-10'),
  },
  {
    id: '4',
    caseNumber: '2024-CV-3456',
    status: 'In Progress',
    clientName: 'Smith Family',
    nextHearingDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    description: 'Deposition review and preparation',
    createdDate: new Date('2023-11-20'),
  },
  {
    id: '5',
    caseNumber: '2024-CR-7890',
    status: 'In Progress',
    clientName: 'Anderson',
    deadlineDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    description: 'Criminal defense - summary judgment motion',
    createdDate: new Date('2024-01-05'),
  },
  {
    id: '6',
    caseNumber: '2024-PR-2345',
    status: 'Closed',
    clientName: 'Estate of Thompson',
    description: 'Probate and trust administration completed',
    createdDate: new Date('2023-09-15'),
  },
];

const App: React.FC = () => {
  const styles = useStyles();
  const [currentView, setCurrentView] = useState<ViewType>('documents');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [suggestionPopupMode, setSuggestionPopupMode] = useState<'hidden' | 'high' | 'low'>('hidden');

  // Handle view navigation with smooth transitions
  const handleNavigationChange = (viewId: string) => {
    if (viewId === currentView) return;

    setIsTransitioning(true);

    // Wait for fade out, then change view
    setTimeout(() => {
      setCurrentView(viewId as ViewType);
      setIsTransitioning(false);
    }, 150);
  };

  // Handle search
  const handleSearchChange = (_event: any, data: any) => {
    setSearchQuery(data.value || '');
  };

  // Document click handler
  const handleDocumentClick = (document: Document) => {
    console.log('Document clicked:', document);
    alert(`Opening document: ${document.title}`);
  };

  // Case click handlers
  const handleCaseClick = (caseItem: Case) => {
    console.log('Case clicked:', caseItem);
    alert(`Opening case: ${caseItem.caseNumber}`);
  };

  const handleViewDetails = (caseItem: Case) => {
    console.log('View details:', caseItem);
    alert(`View details for case: ${caseItem.caseNumber}`);
  };

  const handleAddTimeEntry = (caseItem: Case) => {
    console.log('Add time entry:', caseItem);
    alert(`Add time entry for case: ${caseItem.caseNumber}`);
  };

  const handleViewDocuments = (caseItem: Case) => {
    console.log('View documents:', caseItem);
    alert(`View documents for case: ${caseItem.caseNumber}`);
  };

  // Render current view content
  const renderViewContent = () => {
    const contentClass = `${styles.viewContent} ${isTransitioning ? styles.viewContentExiting : ''}`;

    switch (currentView) {
      case 'documents':
        return (
          <div className={contentClass}>
            <DocumentsView
              documents={sampleDocuments}
              onDocumentClick={handleDocumentClick}
            />
          </div>
        );

      case 'cases':
        return (
          <div className={contentClass}>
            <CasesView
              cases={sampleCases}
              onCaseClick={handleCaseClick}
              onViewDetails={handleViewDetails}
              onAddTimeEntry={handleAddTimeEntry}
              onViewDocuments={handleViewDocuments}
            />
          </div>
        );

      case 'activity':
        return (
          <div className={contentClass}>
            <div className={styles.placeholderView}>
              <div className={styles.placeholderIcon}>📊</div>
              <Text className={styles.placeholderTitle}>Activity View</Text>
              <Text className={styles.placeholderDescription}>
                Track your daily work activities and time spent across different applications and documents.
                This view will show your activity timeline, app usage, and work patterns.
              </Text>
            </div>
          </div>
        );

      case 'timeEntries':
        return (
          <div className={contentClass}>
            <div className={styles.placeholderView}>
              <div className={styles.placeholderIcon}>⏱️</div>
              <Text className={styles.placeholderTitle}>Time Entries View</Text>
              <Text className={styles.placeholderDescription}>
                Review and manage your time entries before syncing to Clio. Confirm auto-captured entries,
                edit details, and ensure accurate billing records for all your work.
              </Text>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className={contentClass}>
            <SettingsView />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <MicaBackground variant="auto">
      <div className={styles.app}>
        {/* Custom Title Bar */}
        <div className={styles.titleBar}>
          <Text className={styles.titleBarText}>LegalApp</Text>
        </div>

        {/* Header with Search and Settings */}
        <div className={styles.header}>
          <div className={styles.searchContainer}>
            <SearchBox
              placeholder="Search documents, cases, contacts..."
              value={searchQuery}
              onChange={handleSearchChange}
              size="medium"
            />
          </div>

          <div className={styles.headerActions}>
            <Button
              appearance="subtle"
              icon={<SettingsRegular />}
              onClick={() => handleNavigationChange('settings')}
              aria-label="Settings"
            >
              Settings
            </Button>
          </div>
        </div>

        {/* Main Layout */}
        <div className={styles.mainLayout}>
          {/* Sidebar - 220px width */}
          <Sidebar
            activeItem={currentView}
            onNavigationChange={handleNavigationChange}
            items={[
              {
                id: 'documents',
                label: 'Documents',
                icon: <span>📄</span>,
                ariaLabel: 'Navigate to Documents',
              },
              {
                id: 'cases',
                label: 'Cases',
                icon: <span>💼</span>,
                ariaLabel: 'Navigate to Cases',
              },
              {
                id: 'activity',
                label: 'Activity',
                icon: <span>🕐</span>,
                ariaLabel: 'Navigate to Activity',
              },
              {
                id: 'timeEntries',
                label: 'Time Entries',
                icon: <span>📋</span>,
                ariaLabel: 'Navigate to Time Entries',
              },
              {
                id: 'settings',
                label: 'Settings',
                icon: <SettingsRegular />,
                ariaLabel: 'Navigate to Settings',
              },
            ]}
          />

          {/* Main Content Area with Mica Background */}
          <div className={styles.contentArea}>
            <div className={styles.viewContainer}>
              {renderViewContent()}
            </div>
          </div>
        </div>

        {/* Suggestion Popup */}
        <SuggestionPopup
          visible={suggestionPopupMode !== 'hidden'}
          onClose={() => setSuggestionPopupMode('hidden')}
          confidenceLevel={suggestionPopupMode === 'low' ? 'low' : 'high'}
        />

        {/* Tray Demo Panel */}
        <TrayDemo onNavigateToActivity={() => handleNavigationChange('activity')} />
      </div>
    </MicaBackground>
  );
};

export default App;
