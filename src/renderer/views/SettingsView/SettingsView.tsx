import React, { useState } from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Text,
  Card,
  CardHeader,
  Radio,
  RadioGroup,
  Label,
  Switch,
  Divider,
} from '@fluentui/react-components';
import { useTheme } from '../../contexts/ThemeContext';
import {
  WeatherMoonRegular,
  WeatherSunnyRegular,
  DesktopRegular,
  ShieldCheckmarkRegular,
  EyeOffRegular,
  PauseRegular,
  AppFolderRegular,
  ClockRegular,
} from '@fluentui/react-icons';

/**
 * SettingsView Component
 *
 * Displays application settings including theme controls and privacy preferences
 * Features:
 * - Theme mode selection (Light/Dark/Auto)
 * - Visual theme preview
 * - Mica material integration
 * - Privacy & Tracking disclosures and controls
 */

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('24px'),
    width: '100%',
    maxWidth: '800px',
  },

  header: {
    marginBottom: '8px',
  },

  title: {
    fontSize: tokens.fontSizeHero700,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    marginBottom: '8px',
  },

  subtitle: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground3,
  },

  card: {
    width: '100%',
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.padding('20px'),
  },

  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('16px'),
  },

  settingSection: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('12px'),
  },

  settingLabel: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },

  settingDescription: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    marginTop: '4px',
  },

  radioGroup: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('12px'),
    marginTop: '8px',
  },

  radioOption: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
  },

  radioIcon: {
    fontSize: '20px',
    color: tokens.colorNeutralForeground2,
  },

  radioLabel: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('4px'),
  },

  radioLabelText: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
  },

  radioLabelDescription: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },

  privacySectionIcon: {
    fontSize: '20px',
    color: tokens.colorBrandForeground1,
    flexShrink: 0,
  },

  privacySectionHeader: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    marginBottom: '4px',
  },

  privacySectionHeaderText: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },

  disclosureList: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('6px'),
    marginTop: '4px',
    paddingLeft: '28px',
  },

  disclosureItem: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase200,
  },

  disclosureBullet: {
    color: tokens.colorNeutralForeground3,
    marginRight: '8px',
  },

  toggleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.padding('12px', '0'),
  },

  toggleInfo: {
    display: 'flex',
    alignItems: 'flex-start',
    ...shorthands.gap('12px'),
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0,
  },

  toggleIcon: {
    fontSize: '20px',
    color: tokens.colorNeutralForeground2,
    marginTop: '2px',
    flexShrink: 0,
  },

  toggleText: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('2px'),
  },

  toggleLabel: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },

  toggleDescription: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    lineHeight: tokens.lineHeightBase200,
  },

  privacyNote: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    fontStyle: 'italic',
    marginTop: '4px',
    lineHeight: tokens.lineHeightBase300,
  },
});

const SettingsView: React.FC = () => {
  const styles = useStyles();
  const { mode, setMode, resolvedTheme } = useTheme();

  // Mock toggle states for Privacy & Tracking (UI only, no persistence)
  const [pauseTracking, setPauseTracking] = useState(false);
  const [excludeApps, setExcludeApps] = useState(false);
  const [quietHours, setQuietHours] = useState(false);

  const handleThemeChange = (_: any, data: any) => {
    setMode(data.value as 'light' | 'dark' | 'auto');
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Text className={styles.title}>Settings</Text>
        <Text className={styles.subtitle}>
          Customize your LegalApp experience
        </Text>
      </div>

      {/* Appearance Settings */}
      <Card className={styles.card}>
        <CardHeader
          header={
            <Text className={styles.settingLabel}>Appearance</Text>
          }
          description={
            <Text className={styles.settingDescription}>
              Choose how LegalApp looks with light mode, dark mode, or automatic theme switching based on your system preferences.
            </Text>
          }
        />

        <div className={styles.cardContent}>
          <div className={styles.settingSection}>
            <Label htmlFor="theme-selection">Theme Mode</Label>
            <RadioGroup
              id="theme-selection"
              value={mode}
              onChange={handleThemeChange}
              className={styles.radioGroup}
            >
              <div className={styles.radioOption}>
                <Radio
                  value="light"
                  label={
                    <div className={styles.radioLabel}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <WeatherSunnyRegular className={styles.radioIcon} />
                        <Text className={styles.radioLabelText}>Light</Text>
                      </div>
                      <Text className={styles.radioLabelDescription}>
                        Always use light theme with Mica material
                      </Text>
                    </div>
                  }
                />
              </div>

              <div className={styles.radioOption}>
                <Radio
                  value="dark"
                  label={
                    <div className={styles.radioLabel}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <WeatherMoonRegular className={styles.radioIcon} />
                        <Text className={styles.radioLabelText}>Dark</Text>
                      </div>
                      <Text className={styles.radioLabelDescription}>
                        Always use dark theme with Mica material
                      </Text>
                    </div>
                  }
                />
              </div>

              <div className={styles.radioOption}>
                <Radio
                  value="auto"
                  label={
                    <div className={styles.radioLabel}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <DesktopRegular className={styles.radioIcon} />
                        <Text className={styles.radioLabelText}>Auto (System)</Text>
                      </div>
                      <Text className={styles.radioLabelDescription}>
                        Automatically switch based on your system theme (currently: {resolvedTheme})
                      </Text>
                    </div>
                  }
                />
              </div>
            </RadioGroup>
          </div>
        </div>
      </Card>

      {/* Mica Material Info */}
      <Card className={styles.card}>
        <CardHeader
          header={
            <Text className={styles.settingLabel}>Mica Material System</Text>
          }
          description={
            <Text className={styles.settingDescription}>
              LegalApp uses the Mica material system from Fluent Design 2.0, providing a translucent backdrop effect that harmonizes with your desktop wallpaper. The effect automatically adjusts based on your chosen theme.
            </Text>
          }
        />
      </Card>

      {/* Privacy & Tracking */}
      <Card className={styles.card}>
        <CardHeader
          header={
            <Text className={styles.settingLabel}>Privacy &amp; Tracking</Text>
          }
          description={
            <Text className={styles.settingDescription}>
              LegalApp monitors your work activity to suggest accurate time entries.
              Below is a clear summary of what is and is not collected, along with
              controls to limit tracking when needed.
            </Text>
          }
        />

        <div className={styles.cardContent}>
          {/* What the app tracks */}
          <div className={styles.settingSection}>
            <div className={styles.privacySectionHeader}>
              <ShieldCheckmarkRegular className={styles.privacySectionIcon} />
              <Text className={styles.privacySectionHeaderText}>
                What LegalApp tracks
              </Text>
            </div>
            <div className={styles.disclosureList}>
              <Text className={styles.disclosureItem}>
                <span className={styles.disclosureBullet}>&bull;</span>
                Names of applications you open and the duration they remain in focus
              </Text>
              <Text className={styles.disclosureItem}>
                <span className={styles.disclosureBullet}>&bull;</span>
                Document file names and editing sessions within supported applications
              </Text>
              <Text className={styles.disclosureItem}>
                <span className={styles.disclosureBullet}>&bull;</span>
                Email send and receive events, including subject lines and recipient domains
              </Text>
              <Text className={styles.disclosureItem}>
                <span className={styles.disclosureBullet}>&bull;</span>
                Phone call start and end times as reported by your telephony client
              </Text>
              <Text className={styles.disclosureItem}>
                <span className={styles.disclosureBullet}>&bull;</span>
                Periods of keyboard and mouse inactivity to detect idle time
              </Text>
            </div>
          </div>

          <Divider />

          {/* What the app does NOT track */}
          <div className={styles.settingSection}>
            <div className={styles.privacySectionHeader}>
              <EyeOffRegular className={styles.privacySectionIcon} />
              <Text className={styles.privacySectionHeaderText}>
                What LegalApp does not track
              </Text>
            </div>
            <div className={styles.disclosureList}>
              <Text className={styles.disclosureItem}>
                <span className={styles.disclosureBullet}>&bull;</span>
                Keystrokes, passwords, or any text you type
              </Text>
              <Text className={styles.disclosureItem}>
                <span className={styles.disclosureBullet}>&bull;</span>
                Screen contents, screenshots, or screen recordings
              </Text>
              <Text className={styles.disclosureItem}>
                <span className={styles.disclosureBullet}>&bull;</span>
                The body or attachments of emails or messages
              </Text>
              <Text className={styles.disclosureItem}>
                <span className={styles.disclosureBullet}>&bull;</span>
                Browsing history, URLs visited, or web page content
              </Text>
              <Text className={styles.disclosureItem}>
                <span className={styles.disclosureBullet}>&bull;</span>
                Audio or video from calls, meetings, or your microphone
              </Text>
              <Text className={styles.disclosureItem}>
                <span className={styles.disclosureBullet}>&bull;</span>
                Personal files, photos, or data outside of work applications
              </Text>
            </div>
          </div>

          <Divider />

          {/* Tracking Controls */}
          <div className={styles.settingSection}>
            <Label>Tracking Controls</Label>

            {/* Pause Tracking toggle */}
            <div className={styles.toggleRow}>
              <div className={styles.toggleInfo}>
                <PauseRegular className={styles.toggleIcon} />
                <div className={styles.toggleText}>
                  <Text className={styles.toggleLabel}>Pause Tracking</Text>
                  <Text className={styles.toggleDescription}>
                    Temporarily stop all activity monitoring. No data is collected while tracking is paused.
                  </Text>
                </div>
              </div>
              <Switch
                checked={pauseTracking}
                onChange={(_e, data) => setPauseTracking(data.checked)}
              />
            </div>

            {/* Exclude Applications toggle */}
            <div className={styles.toggleRow}>
              <div className={styles.toggleInfo}>
                <AppFolderRegular className={styles.toggleIcon} />
                <div className={styles.toggleText}>
                  <Text className={styles.toggleLabel}>Exclude Applications</Text>
                  <Text className={styles.toggleDescription}>
                    When enabled, activity in excluded applications is never recorded or used for time entry suggestions.
                  </Text>
                </div>
              </div>
              <Switch
                checked={excludeApps}
                onChange={(_e, data) => setExcludeApps(data.checked)}
              />
            </div>

            {/* Quiet Hours toggle */}
            <div className={styles.toggleRow}>
              <div className={styles.toggleInfo}>
                <ClockRegular className={styles.toggleIcon} />
                <div className={styles.toggleText}>
                  <Text className={styles.toggleLabel}>Quiet Hours</Text>
                  <Text className={styles.toggleDescription}>
                    Automatically pause tracking outside of your configured working hours. No activity is recorded during quiet hours.
                  </Text>
                </div>
              </div>
              <Switch
                checked={quietHours}
                onChange={(_e, data) => setQuietHours(data.checked)}
              />
            </div>
          </div>

          <Divider />

          <Text className={styles.privacyNote}>
            All activity data is stored locally on this device. LegalApp does not
            transmit tracking data to external servers. You may pause or limit
            tracking at any time without affecting previously recorded entries.
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default SettingsView;
