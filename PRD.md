# Product Requirements Document (PRD)

## LegalApp Desktop — Intelligent Time Tracking for Legal Professionals

| Field             | Value                                      |
|-------------------|--------------------------------------------|
| **Product Name**  | LegalApp Desktop                           |
| **Version**       | 1.0.0 (Prototype)                          |
| **Platform**      | Windows Desktop (Electron)                 |
| **Status**        | UI/UX Prototype — Frontend Only            |
| **Last Updated**  | 2026-01-27                                 |

---

## 1. Executive Summary

LegalApp Desktop is a Windows-native desktop application designed to automate and simplify time tracking for legal professionals. Built on Electron with React, TypeScript, and Microsoft Fluent UI, the application provides an always-on system tray experience that passively captures billable work, manages cases and documents, and synchronizes time entries with Clio — the industry-leading legal practice management platform.

The current release is a **UI/UX prototype** that implements the complete frontend experience with mock data. No backend services, API integrations, or persistent storage are connected yet.

---

## 2. Problem Statement

Legal professionals lose significant revenue due to inefficient time tracking:

- **Manual entry friction** — Lawyers must remember and reconstruct activities at the end of the day, leading to forgotten billable time.
- **Context switching** — Switching between work applications and a separate time tracking tool interrupts workflow.
- **Inaccurate records** — Retrospective time entry produces inaccurate durations and descriptions.
- **Sync overhead** — Manually entering time into practice management systems (e.g., Clio) doubles the data-entry burden.

LegalApp solves these problems by running silently in the system tray, automatically capturing work activity, suggesting time entries with AI-powered descriptions, and syncing directly to Clio.

---

## 3. Target Users

### 3.1 Primary Persona — Solo/Small-Firm Attorney
- Practices across 10–50 active cases simultaneously
- Bills hourly and needs accurate time capture
- Uses Clio for practice management
- Works primarily on a Windows desktop
- Wants minimal disruption to their workflow

### 3.2 Secondary Persona — Legal Staff / Paralegal
- Supports attorneys across multiple cases
- Tracks time for document preparation, research, and communication
- Needs to categorize time entries by case and task type

### 3.3 Tertiary Persona — Firm Administrator
- Reviews and approves time entries before syncing to billing
- Needs visibility into pending vs. synced entries
- Manages firm-wide Clio integration settings

---

## 4. Product Vision & Goals

### 4.1 Vision
An invisible, intelligent assistant that ensures every billable minute is captured, categorized, and synced — without the lawyer lifting a finger.

### 4.2 Goals

| # | Goal                                              | Success Metric                              |
|---|---------------------------------------------------|---------------------------------------------|
| 1 | Eliminate forgotten billable time                  | 95%+ of work hours captured automatically   |
| 2 | Reduce time-entry effort to near-zero              | < 30 seconds to confirm a suggested entry   |
| 3 | Ensure accurate, descriptive time entries           | < 5% of entries require manual edits        |
| 4 | Seamless Clio synchronization                       | One-click bulk sync with zero data loss     |
| 5 | Windows-native experience                           | Indistinguishable from a native Win11 app   |

---

## 5. Feature Requirements

### 5.1 System Tray Integration (Implemented)

**Description:** The application lives primarily in the Windows system tray, providing an always-on background experience without occupying taskbar space.

**Requirements:**

| ID    | Requirement                                                     | Priority | Status       |
|-------|-----------------------------------------------------------------|----------|--------------|
| ST-01 | Display tray icon with active/idle state indicators             | P0       | Implemented  |
| ST-02 | Context menu with Pause/Resume, Open Activity, Sync, Exit      | P0       | Implemented  |
| ST-03 | Tooltip showing current tracking duration                       | P0       | Implemented  |
| ST-04 | Flyout popup (280x400) positioned relative to tray icon         | P0       | Implemented  |
| ST-05 | Flyout displays current tracking status, today's time, activity | P0       | Implemented  |
| ST-06 | Play/Pause toggle in flyout                                     | P0       | Implemented  |
| ST-07 | "Open App" action from flyout to launch main window             | P0       | Implemented  |
| ST-08 | App hides to tray on close (does not exit)                      | P0       | Implemented  |
| ST-09 | Acrylic material effect on flyout                               | P1       | Implemented  |

---

### 5.2 Time Entries Management (Implemented — UI Only)

**Description:** Core feature for reviewing, editing, confirming, and managing auto-captured and manually-created time entries before syncing to Clio.

**Requirements:**

| ID    | Requirement                                                           | Priority | Status       |
|-------|-----------------------------------------------------------------------|----------|--------------|
| TE-01 | Display time entry cards with case, task, duration, and time range    | P0       | Implemented  |
| TE-02 | Status badges: Pending, Confirmed, Synced, Failed                     | P0       | Implemented  |
| TE-03 | Auto-captured vs. Manual source indicator                             | P0       | Implemented  |
| TE-04 | Date-based grouping (Today, Yesterday, Earlier)                       | P0       | Implemented  |
| TE-05 | Summary statistics bar (total time, pending count, synced count)      | P0       | Implemented  |
| TE-06 | Bulk selection with Select All checkbox                               | P0       | Implemented  |
| TE-07 | Bulk action toolbar (Confirm, Edit, Delete)                           | P0       | Implemented  |
| TE-08 | Individual entry actions (Confirm, Edit, Delete)                      | P0       | Implemented  |
| TE-09 | Filter by status (All, Pending, Confirmed, Synced)                    | P1       | Not started  |
| TE-10 | Inline editing of time entry description and duration                 | P1       | Not started  |
| TE-11 | Manual time entry creation form                                       | P1       | Not started  |
| TE-12 | Clio sync action (individual and bulk)                                | P0       | Not started  |
| TE-13 | Conflict resolution UI for failed syncs                               | P1       | Not started  |

---

### 5.3 Case Management (Implemented — UI Only)

**Description:** View and manage legal cases with status tracking, filtering, and quick actions.

**Requirements:**

| ID    | Requirement                                                         | Priority | Status       |
|-------|---------------------------------------------------------------------|----------|--------------|
| CM-01 | Case cards with number, title, status, client, dates                | P0       | Implemented  |
| CM-02 | Color-coded status badges (In Progress, Discovery, Settlement, etc.)| P0       | Implemented  |
| CM-03 | Filter tabs: All Cases, Active, Pending Action, Closed              | P0       | Implemented  |
| CM-04 | Case count per filter                                               | P0       | Implemented  |
| CM-05 | Quick actions on hover: View Details, Add Time Entry, View Documents| P0       | Implemented  |
| CM-06 | Case detail view with full information                              | P1       | Not started  |
| CM-07 | Case search by name, number, or client                              | P1       | Not started  |
| CM-08 | Case creation and editing                                           | P2       | Not started  |
| CM-09 | Case-level time summary and billing reports                         | P2       | Not started  |

---

### 5.4 Document Management (Implemented — UI Only)

**Description:** Browse and organize legal documents associated with cases, with time-based grouping and file type indicators.

**Requirements:**

| ID    | Requirement                                                        | Priority | Status       |
|-------|--------------------------------------------------------------------|----------|--------------|
| DM-01 | Document list with file type icons (Word, PDF, Excel, etc.)        | P0       | Implemented  |
| DM-02 | Time-based grouping (Today, Yesterday, This Week, Earlier)         | P0       | Implemented  |
| DM-03 | Case association badges on documents                               | P0       | Implemented  |
| DM-04 | Relative time display ("2 hours ago")                              | P0       | Implemented  |
| DM-05 | Empty state messaging when no documents exist                      | P0       | Implemented  |
| DM-06 | Document open/launch action                                        | P1       | Not started  |
| DM-07 | Document search and filtering                                      | P1       | Not started  |
| DM-08 | File upload and case attachment                                    | P2       | Not started  |

---

### 5.5 AI-Powered Suggestion Popup (Implemented — UI Only)

**Description:** Intelligent time entry suggestions based on detected work activity, with confidence-based UX treatment.

**Requirements:**

| ID    | Requirement                                                         | Priority | Status       |
|-------|---------------------------------------------------------------------|----------|--------------|
| AI-01 | Suggestion popup with case, description, duration, source info      | P0       | Implemented  |
| AI-02 | Confidence level display (High/Low)                                 | P0       | Implemented  |
| AI-03 | High-confidence: Auto-dismiss after 30 seconds if unactioned        | P0       | Implemented  |
| AI-04 | Low-confidence: Edit as primary action                              | P0       | Implemented  |
| AI-05 | Confirm, Edit, Dismiss actions                                      | P0       | Implemented  |
| AI-06 | Source attribution (which applications contributed to suggestion)    | P1       | Implemented  |
| AI-07 | ML model for activity classification and description generation     | P0       | Not started  |
| AI-08 | Learning from user corrections to improve suggestions               | P1       | Not started  |
| AI-09 | Configurable suggestion frequency and sensitivity                   | P2       | Not started  |

---

### 5.6 Activity Tracking Engine (Not Started)

**Description:** Background service that monitors work activity across applications to automatically capture billable time.

**Requirements:**

| ID    | Requirement                                                         | Priority | Status      |
|-------|---------------------------------------------------------------------|----------|-------------|
| AT-01 | Background process monitoring active application windows            | P0       | Not started |
| AT-02 | Document editing detection (Word, PDF, Excel)                       | P0       | Not started |
| AT-03 | Browser activity tracking (legal research sites)                    | P1       | Not started |
| AT-04 | Email/communication time tracking                                   | P1       | Not started |
| AT-05 | Activity timeline visualization                                     | P0       | Not started |
| AT-06 | Idle detection and automatic pause                                  | P0       | Not started |
| AT-07 | Privacy controls — exclude specific applications or time periods    | P0       | Not started |
| AT-08 | Activity data stored locally with encryption                        | P0       | Not started |

---

### 5.7 Clio Integration (Not Started)

**Description:** Bidirectional synchronization with Clio practice management software.

**Requirements:**

| ID    | Requirement                                                        | Priority | Status      |
|-------|--------------------------------------------------------------------|----------|-------------|
| CL-01 | OAuth 2.0 authentication with Clio                                 | P0       | Not started |
| CL-02 | Pull matters/cases from Clio                                       | P0       | Not started |
| CL-03 | Push confirmed time entries to Clio                                 | P0       | Not started |
| CL-04 | Bulk sync with progress indicator                                  | P0       | Not started |
| CL-05 | Sync status tracking per entry (Pending, Synced, Failed)           | P0       | Not started |
| CL-06 | Conflict detection and resolution                                  | P1       | Not started |
| CL-07 | Automatic background sync on configurable schedule                 | P2       | Not started |
| CL-08 | Token refresh and session management                               | P0       | Not started |

---

### 5.8 Settings & Preferences (Partially Implemented)

**Description:** User-configurable application settings.

**Requirements:**

| ID    | Requirement                                                         | Priority | Status       |
|-------|---------------------------------------------------------------------|----------|--------------|
| SE-01 | Theme selection: Light, Dark, Auto (follow system)                  | P1       | Implemented  |
| SE-02 | Real-time theme switching                                           | P1       | Implemented  |
| SE-03 | Current system theme display                                        | P2       | Implemented  |
| SE-04 | Clio account connection settings                                    | P0       | Not started  |
| SE-05 | Activity tracking preferences (which apps to monitor)               | P1       | Not started  |
| SE-06 | Notification preferences                                            | P1       | Not started  |
| SE-07 | Default billing rate configuration                                  | P2       | Not started  |
| SE-08 | Data export settings                                                | P2       | Not started  |
| SE-09 | Persist user preferences across sessions                            | P0       | Not started  |

---

### 5.9 Windows-Native Experience (Implemented)

**Description:** The application should feel indistinguishable from a native Windows 11 application.

**Requirements:**

| ID    | Requirement                                                         | Priority | Status       |
|-------|---------------------------------------------------------------------|----------|--------------|
| WN-01 | Microsoft Fluent UI design system throughout                        | P0       | Implemented  |
| WN-02 | Mica material background effect                                     | P1       | Implemented  |
| WN-03 | Acrylic material for flyouts and popups                             | P1       | Implemented  |
| WN-04 | Frameless window with custom title bar                              | P0       | Implemented  |
| WN-05 | Smooth view transitions (fade + translateY)                         | P1       | Implemented  |
| WN-06 | Card elevation and hover effects                                    | P1       | Implemented  |
| WN-07 | Brand color palette (#1F4E79 professional blue)                     | P0       | Implemented  |
| WN-08 | Consistent spacing scale (4/8/16/24/32px)                           | P0       | Implemented  |

---

### 5.10 Accessibility — WCAG 2.2 Level AA (Implemented)

**Description:** Full accessibility compliance ensuring the application is usable by people with disabilities.

**Requirements:**

| ID    | Requirement                                                         | Priority | Status       |
|-------|---------------------------------------------------------------------|----------|--------------|
| A11Y-01 | Color contrast ratio minimum 4.5:1 (AA)                          | P0       | Implemented  |
| A11Y-02 | Visible focus indicators (2px solid, 2px offset)                  | P0       | Implemented  |
| A11Y-03 | Full keyboard navigation (Tab, Arrow, Home, End, Enter, Space)    | P0       | Implemented  |
| A11Y-04 | Screen reader support with ARIA labels and live regions            | P0       | Implemented  |
| A11Y-05 | Touch targets minimum 24x24px                                      | P0       | Implemented  |
| A11Y-06 | High contrast mode support                                         | P1       | Implemented  |
| A11Y-07 | Reduced motion preference support                                  | P1       | Implemented  |
| A11Y-08 | Semantic HTML throughout                                           | P0       | Implemented  |
| A11Y-09 | Skip navigation link                                               | P1       | Partial      |
| A11Y-10 | Focus trap for modal dialogs                                       | P0       | Hook exists, not used |
| A11Y-11 | Roving tabindex for toolbar navigation                             | P1       | Implemented  |

---

## 6. Architecture & Technical Design

### 6.1 Technology Stack

| Layer              | Technology                       | Version    |
|--------------------|----------------------------------|------------|
| Desktop Runtime    | Electron                         | 28.1.3     |
| UI Framework       | React                            | 18.2.0     |
| Language           | TypeScript (strict mode)         | 5.3.3      |
| Design System      | Microsoft Fluent UI v9           | 9.47.2     |
| Icons              | Fluent UI React Icons            | 2.0.228    |
| Build Tool         | Webpack 5                        | 5.89.0     |
| State Management   | React Context API + Hooks        | —          |
| Styling            | Fluent UI makeStyles (CSS-in-JS) | —          |

### 6.2 Application Architecture

```
┌─────────────────────────────────────────────────┐
│                  Electron Shell                  │
│  ┌─────────────────────┐  ┌──────────────────┐  │
│  │    Main Process      │  │  System Tray     │  │
│  │  (main.ts)           │  │  + Context Menu  │  │
│  │  - Window lifecycle  │  │  + Flyout Window │  │
│  │  - IPC handlers      │  └──────────────────┘  │
│  │  - Tray management   │                        │
│  └──────────┬──────────┘                         │
│             │ IPC (context-isolated)              │
│  ┌──────────▼──────────┐                         │
│  │   Preload Script     │                        │
│  │  (preload.ts)        │                        │
│  │  - Channel whitelist │                        │
│  │  - Secure bridge     │                        │
│  └──────────┬──────────┘                         │
│             │ contextBridge                       │
│  ┌──────────▼──────────────────────────────────┐ │
│  │          Renderer Process (React)           │ │
│  │  ┌─────────────────────────────────────┐    │ │
│  │  │  ThemeProvider (Context API)         │    │ │
│  │  │  ┌────────────────────────────────┐  │    │ │
│  │  │  │  App Layout                    │  │    │ │
│  │  │  │  ├── Title Bar (32px)          │  │    │ │
│  │  │  │  ├── Header (60px + Search)    │  │    │ │
│  │  │  │  └── Main Content              │  │    │ │
│  │  │  │      ├── Sidebar (220px)       │  │    │ │
│  │  │  │      └── View Container        │  │    │ │
│  │  │  │          ├── DocumentsView     │  │    │ │
│  │  │  │          ├── CasesView         │  │    │ │
│  │  │  │          ├── TimeEntriesView   │  │    │ │
│  │  │  │          ├── ActivityView      │  │    │ │
│  │  │  │          └── SettingsView      │  │    │ │
│  │  │  └────────────────────────────────┘  │    │ │
│  │  └─────────────────────────────────────┘    │ │
│  └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### 6.3 Data Models

```typescript
// Document
interface Document {
  id: string;
  title: string;
  fileType: 'word' | 'pdf' | 'excel' | 'text' | 'image' | 'other';
  modifiedDate: Date;
  caseName?: string;
  caseNumber?: string;
  filePath?: string;
}

// Case
interface Case {
  id: string;
  caseNumber: string;
  title: string;
  status: 'In Progress' | 'Discovery' | 'Settlement Review' | 'Closed';
  clientName?: string;
  nextHearingDate?: Date;
  deadlineDate?: Date;
  description?: string;
  createdDate: Date;
}

// Time Entry
interface TimeEntry {
  id: string;
  caseName: string;
  caseNumber: string;
  taskDescription: string;
  duration: number;        // minutes
  startTime: Date;
  endTime: Date;
  status: 'Pending' | 'Confirmed' | 'Synced' | 'Failed';
  source: 'Auto-captured' | 'Manual';
  date: Date;
}
```

### 6.4 Navigation Architecture

The application uses hash-based pseudo-routing (no React Router):

| Route           | View               | Description                     |
|-----------------|--------------------|---------------------------------|
| `/`             | Main Window        | Default app with sidebar + view |
| `#/flyout`      | Tray Flyout        | Compact tray popup              |

**Sidebar Navigation Items:**

| View         | Icon      | Description                    |
|--------------|-----------|--------------------------------|
| Documents    | Document  | Legal document browser         |
| Cases        | Briefcase | Case management with filtering |
| Activity     | Clock     | Activity timeline (placeholder)|
| Time Entries | Clipboard | Time entry review and sync     |
| Settings     | Gear      | App preferences and themes     |

### 6.5 IPC Communication Channels

| Channel                    | Direction       | Purpose                           |
|----------------------------|-----------------|-----------------------------------|
| `tracking-state-changed`   | Main → Renderer | Notify tracking state change      |
| `navigate-to`             | Main → Renderer | Navigate to a specific view       |
| `trigger-sync`            | Main → Renderer | Trigger Clio sync from tray       |
| `action:toggle-tracking`  | Renderer → Main | Toggle time tracking on/off       |
| `tray:set-state`          | Renderer → Main | Update tray icon state            |
| `tray:update-tooltip`     | Renderer → Main | Update tray tooltip text          |

### 6.6 Security Model

- **Context Isolation:** Renderer process has no direct access to Node.js APIs
- **Channel Whitelist:** Only explicitly listed IPC channels are permitted
- **No Node Integration:** `nodeIntegration: false` in BrowserWindow
- **Preload Bridge:** `contextBridge.exposeInMainWorld()` for safe API exposure

---

## 7. Code Review Summary

### 7.1 Scorecard

| Category                     | Score   | Assessment          |
|------------------------------|---------|---------------------|
| Code Quality & Organization  | 8/10    | Good                |
| Component Architecture       | 7/10    | Good                |
| State Management             | 6/10    | Adequate            |
| Error Handling               | 2/10    | Critical gap        |
| TypeScript Type Safety       | 7.5/10  | Good                |
| CSS / Styling                | 7/10    | Good                |
| Performance                  | 7/10    | Good                |
| Security                     | 7/10    | Good                |
| Testing Coverage             | 0/10    | Not implemented     |
| Accessibility                | 8.5/10  | Excellent           |
| Dependencies                 | 6/10    | Adequate            |
| **Overall**                  | **6.4/10** | **Good foundation** |

### 7.2 Strengths

1. **Excellent accessibility compliance** — WCAG 2.2 Level AA with keyboard navigation hooks, ARIA support, high-contrast mode, and reduced-motion preferences. A dedicated `useAccessibility.ts` hook provides `useFocusTrap`, `useKeyboardNavigation`, `useAnnouncer`, and `useRovingTabIndex`.

2. **Strong design system implementation** — Consistent use of Fluent UI v9 `makeStyles`, design tokens, and Windows 11 material effects (Mica and Acrylic). Color palette meets AA contrast ratios.

3. **Clean separation of concerns** — Electron main/preload/renderer properly isolated. React code organized into views, components, hooks, contexts, themes, and styles.

4. **Full TypeScript strict mode** — All components have typed props interfaces. Union types for statuses and view identifiers.

5. **Secure Electron configuration** — Context isolation, channel whitelisting, and disabled Node integration follow Electron security best practices.

### 7.3 Critical Issues

1. **No error handling** — No React Error Boundaries, no try-catch blocks around IPC calls, no data validation. A single component error crashes the entire application.

2. **No test coverage** — Zero test files. No unit tests, integration tests, or end-to-end tests. No testing libraries in devDependencies.

3. **No linting or formatting tools** — ESLint and Prettier are not configured, meaning code style consistency relies entirely on developer discipline.

4. **Sample data mixed with component logic** — Hardcoded mock data in `App.tsx` (lines 162–267) makes the application untestable with different data sets and will need complete restructuring when a backend is connected.

### 7.4 Recommended Improvements

| Priority   | Improvement                                          | Effort |
|------------|------------------------------------------------------|--------|
| Critical   | Add React Error Boundaries                           | Small  |
| Critical   | Implement test suite (Jest + React Testing Library)  | Medium |
| Critical   | Add IPC input validation in main process             | Small  |
| High       | Extract sample data to `/src/data/` module           | Small  |
| High       | Add ESLint + Prettier configuration                  | Small  |
| High       | Create data-fetching custom hooks                    | Medium |
| High       | Persist theme preference (localStorage/Electron store)| Small  |
| Medium     | Extract shared utilities (status colors, grouping)   | Small  |
| Medium     | Replace `alert()` calls with toast notifications     | Small  |
| Medium     | Add lazy loading for views (React.lazy + Suspense)   | Small  |
| Low        | Remove unused dependency (`react-data-grid-react-window`) | Trivial |
| Low        | Add `any` type elimination throughout                | Small  |

---

## 8. User Experience

### 8.1 Layout

```
┌──────────────────────────────────────────────────┐
│  [≡]  LegalApp                    🔍 Search  ⚙️  │  ← Title Bar (32px) + Header (60px)
├──────────┬───────────────────────────────────────┤
│          │                                       │
│ Documents│    View Content Area                   │
│ Cases    │    (documents, cases, time entries,    │
│ Activity │     activity, or settings)             │
│ Time     │                                       │
│ Settings │                                       │
│          │                                       │
│ (220px)  │                                       │
└──────────┴───────────────────────────────────────┘
```

### 8.2 Interaction Model

- **Primary interface:** System tray (always on, background process)
- **Secondary interface:** Main window (opened on demand from tray)
- **Notifications:** Suggestion popups for auto-captured time entries
- **Transitions:** Smooth fade + vertical translation (300ms)
- **Cards:** Elevation lift on hover with quick action buttons
- **Filtering:** Toggle button groups for list views
- **Bulk operations:** Checkbox selection with contextual toolbar

### 8.3 Theme Support

| Mode   | Behavior                                              |
|--------|-------------------------------------------------------|
| Light  | Light backgrounds, dark text, standard Fluent tokens  |
| Dark   | Dark backgrounds, light text, dark Fluent tokens      |
| Auto   | Follows `prefers-color-scheme` system setting          |

---

## 9. Non-Functional Requirements

### 9.1 Performance

| Metric                     | Target              |
|----------------------------|---------------------|
| Application startup        | < 3 seconds         |
| View transition            | < 300ms             |
| Tray flyout open           | < 200ms             |
| Memory usage (idle)        | < 150 MB            |
| CPU usage (background)     | < 2%                |

### 9.2 Compatibility

| Requirement                | Specification       |
|----------------------------|---------------------|
| Operating System           | Windows 10/11       |
| Display scaling            | 100%–200% DPI      |
| Minimum resolution         | 1280x720            |
| Recommended resolution     | 1920x1080+          |

### 9.3 Security

| Requirement                            | Implementation                  |
|----------------------------------------|---------------------------------|
| Electron context isolation             | Enabled                         |
| Node.js integration in renderer        | Disabled                        |
| IPC channel whitelisting               | Implemented                     |
| Activity data encryption (at rest)     | Not started — required for v1   |
| OAuth token storage                    | Not started — required for v1   |
| HTTPS-only API communication           | Not started — required for v1   |

### 9.4 Accessibility

| Standard | Level | Status       |
|----------|-------|--------------|
| WCAG 2.2 | AA   | Implemented  |

---

## 10. Milestones & Roadmap

### Phase 1 — UI/UX Prototype (Current)
- [x] System tray with flyout
- [x] Documents view with grouping
- [x] Cases view with filtering
- [x] Time entries view with bulk actions
- [x] AI suggestion popup UI
- [x] Settings with theme switching
- [x] Mica/Acrylic material effects
- [x] WCAG 2.2 AA accessibility
- [x] Dark/Light/Auto theme support

### Phase 2 — Foundation
- [ ] Error boundaries and error handling
- [ ] Test suite (unit + integration)
- [ ] ESLint + Prettier setup
- [ ] Data layer abstraction (custom hooks)
- [ ] Local storage for preferences
- [ ] Extract sample data to data module

### Phase 3 — Activity Engine
- [ ] Background activity monitoring service
- [ ] Application window tracking
- [ ] Document editing detection
- [ ] Idle detection and auto-pause
- [ ] Activity timeline view
- [ ] Privacy controls and exclusion rules
- [ ] Local encrypted storage for activity data

### Phase 4 — Clio Integration
- [ ] OAuth 2.0 authentication flow
- [ ] Matter/case sync from Clio
- [ ] Time entry push to Clio
- [ ] Bulk sync with progress tracking
- [ ] Conflict detection and resolution
- [ ] Token refresh and session management

### Phase 5 — AI & Intelligence
- [ ] ML model for activity classification
- [ ] Auto-generated time entry descriptions
- [ ] Confidence scoring for suggestions
- [ ] Learning from user corrections
- [ ] Configurable suggestion sensitivity

### Phase 6 — Polish & Release
- [ ] End-to-end testing (Playwright)
- [ ] Performance optimization and profiling
- [ ] Windows installer (NSIS) finalization
- [ ] Auto-update mechanism
- [ ] Telemetry and crash reporting
- [ ] User onboarding flow
- [ ] Documentation and help system

---

## 11. Risks & Mitigations

| Risk                                      | Impact | Likelihood | Mitigation                                           |
|-------------------------------------------|--------|------------|------------------------------------------------------|
| Activity monitoring perceived as invasive | High   | Medium     | Transparent privacy controls, local-only data storage |
| Clio API rate limits or changes           | High   | Low        | Batch requests, cache responses, version pinning      |
| Electron memory/CPU overhead              | Medium | Medium     | Lazy loading, process optimization, monitoring        |
| No test coverage leads to regressions     | High   | High       | Implement test suite in Phase 2 before feature work   |
| Windows Defender flags Electron app       | Medium | Low        | Code signing certificate, Microsoft Store submission  |
| Accessibility regressions as features grow| Medium | Medium     | Automated axe-core testing in CI pipeline             |

---

## 12. Open Questions

1. **Data persistence** — What local database will be used? (SQLite, LevelDB, Electron Store?)
2. **Multi-user support** — Will the app support multiple user profiles on one machine?
3. **Offline mode** — How should the app behave when Clio is unreachable?
4. **Activity monitoring scope** — Which applications should be tracked by default?
5. **Billing rate integration** — Should the app calculate dollar amounts or just track time?
6. **Firm vs. individual licensing** — What is the distribution and licensing model?
7. **Auto-update mechanism** — Electron auto-updater or manual updates?
8. **Telemetry** — What usage analytics should be collected (opt-in)?

---

## 13. Appendix

### A. File Structure

```
LegalApp_1.0/
├── src/
│   ├── main/
│   │   ├── main.ts                         # Electron lifecycle, window/tray management
│   │   ├── preload.ts                      # Secure IPC bridge
│   │   └── electron-positioner.d.ts        # Type definitions
│   └── renderer/
│       ├── index.tsx                       # Entry point with ThemeProvider
│       ├── App.tsx                         # Main layout, navigation, view routing
│       ├── index.html                      # HTML template
│       ├── electron.d.ts                   # Electron API types for renderer
│       ├── components/
│       │   ├── Sidebar/Sidebar.tsx         # Navigation sidebar
│       │   ├── MicaBackground/MicaBackground.tsx  # Mica material effect
│       │   ├── TrayFlyout/TrayFlyout.tsx   # System tray flyout popup
│       │   ├── SuggestionPopup.tsx         # AI time entry suggestions
│       │   └── TrayDemo.tsx               # Tray demo panel
│       ├── views/
│       │   ├── DocumentsView/DocumentsView.tsx    # Document list
│       │   ├── CasesView/CasesView.tsx            # Case management
│       │   ├── TimeEntriesView/TimeEntriesView.tsx # Time entries
│       │   └── SettingsView/SettingsView.tsx       # App settings
│       ├── contexts/
│       │   └── ThemeContext.tsx             # Dark/Light/Auto theme provider
│       ├── hooks/
│       │   └── useAccessibility.ts         # WCAG 2.2 accessibility hooks
│       ├── theme/
│       │   └── legalAppTheme.ts            # Theme tokens and colors
│       └── styles/
│           ├── global.css                  # Design system foundation
│           ├── accessibility.css           # WCAG 2.2 compliance styles
│           └── MicaBackground.module.css   # Mica effect styles
├── package.json
├── tsconfig.json
├── webpack.main.config.js
├── webpack.renderer.config.js
├── ACCESSIBILITY.md
├── MICA_IMPLEMENTATION.md
└── README.md
```

### B. Dependencies

**Production:**
- `react` ^18.2.0, `react-dom` ^18.2.0
- `@fluentui/react-components` ^9.47.2
- `@fluentui/react-icons` ^2.0.228
- `@fluentui/react` ^8.118.2
- `electron-positioner` ^4.1.0

**Development:**
- `electron` ^28.1.3, `electron-builder` ^24.9.1
- `typescript` ^5.3.3
- `webpack` ^5.89.0, `webpack-cli`, `webpack-dev-server`
- `ts-loader`, `css-loader`, `style-loader`
- `html-webpack-plugin`, `concurrently`, `wait-on`
