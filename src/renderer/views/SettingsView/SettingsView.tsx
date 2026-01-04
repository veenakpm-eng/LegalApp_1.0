import React from 'react';
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
} from '@fluentui/react-components';
import { useTheme } from '../../contexts/ThemeContext';
import {
  WeatherMoonRegular,
  WeatherSunnyRegular,
  DesktopRegular,
} from '@fluentui/react-icons';

/**
 * SettingsView Component
 *
 * Displays application settings including theme controls
 * Features:
 * - Theme mode selection (Light/Dark/Auto)
 * - Visual theme preview
 * - Mica material integration
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
});

const SettingsView: React.FC = () => {
  const styles = useStyles();
  const { mode, setMode, resolvedTheme } = useTheme();

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
    </div>
  );
};

export default SettingsView;
