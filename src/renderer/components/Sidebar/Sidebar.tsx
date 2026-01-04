import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import {
  makeStyles,
  tokens,
  shorthands,
  Text,
} from '@fluentui/react-components';
import {
  DocumentRegular,
  BriefcaseRegular,
  ClockRegular,
  CalendarClockRegular,
  SettingsRegular,
} from '@fluentui/react-icons';

/**
 * Sidebar Component
 *
 * Enhanced navigation sidebar with Fluent UI design patterns.
 * Features:
 * - Subtle active state with left accent bar (no prominent background fill)
 * - Smooth hover transitions
 * - Collapsed mode for responsive layouts
 * - Full keyboard navigation support
 * - WCAG 2.2 Level AA accessibility compliance
 */

// Navigation item type definition
export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactElement;
  ariaLabel?: string;
}

// Component props
export interface SidebarProps {
  /** Currently active navigation item ID */
  activeItem?: string;
  /** Callback when navigation item changes */
  onNavigationChange?: (itemId: string) => void;
  /** Whether the sidebar is in collapsed (icon-only) mode */
  collapsed?: boolean;
  /** Custom navigation items (optional override) */
  items?: NavigationItem[];
}

// Default navigation items
const defaultNavigationItems: NavigationItem[] = [
  {
    id: 'documents',
    label: 'Documents',
    icon: <DocumentRegular />,
    ariaLabel: 'Navigate to Documents',
  },
  {
    id: 'cases',
    label: 'Cases',
    icon: <BriefcaseRegular />,
    ariaLabel: 'Navigate to Cases',
  },
  {
    id: 'activity',
    label: 'Activity',
    icon: <ClockRegular />,
    ariaLabel: 'Navigate to Activity',
  },
  {
    id: 'time-entries',
    label: 'Time Entries',
    icon: <CalendarClockRegular />,
    ariaLabel: 'Navigate to Time Entries',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <SettingsRegular />,
    ariaLabel: 'Navigate to Settings',
  },
];

// Styles using Fluent UI makeStyles
const useStyles = makeStyles({
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    width: '220px',
    height: '100%',
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRight('1px', 'solid', tokens.colorNeutralStroke2),
    transitionProperty: 'width',
    transitionDuration: '200ms',
    transitionTimingFunction: 'cubic-bezier(0.33, 0, 0.67, 1)',
    position: 'relative',
  },

  sidebarCollapsed: {
    width: '64px',
  },

  nav: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.padding('8px', '4px'),
    ...shorthands.gap('2px'),
    flex: 1,
  },

  navItem: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
    ...shorthands.padding('10px', '12px'),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: 'transparent',
    color: tokens.colorNeutralForeground2,
    cursor: 'pointer',
    position: 'relative',
    textDecoration: 'none',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    fontSize: tokens.fontSizeBase300,
    fontFamily: tokens.fontFamilyBase,
    lineHeight: tokens.lineHeightBase300,
    transitionProperty: 'background-color, color',
    transitionDuration: '150ms',
    transitionTimingFunction: 'ease',

    // Remove default left border
    '::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: '2px',
      backgroundColor: 'transparent',
      ...shorthands.borderRadius('0', '2px', '2px', '0'),
      transitionProperty: 'background-color',
      transitionDuration: '150ms',
      transitionTimingFunction: 'ease',
    },

    ':hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
      color: tokens.colorNeutralForeground1,
    },

    ':focus-visible': {
      outlineWidth: '2px',
      outlineStyle: 'solid',
      outlineColor: tokens.colorBrandStroke1,
      outlineOffset: '-2px',
      ...shorthands.borderRadius(tokens.borderRadiusMedium),
    },

    // Pressed state
    ':active': {
      backgroundColor: 'rgba(0, 0, 0, 0.06)',
    },
  },

  navItemActive: {
    // Subtle Mica Alt background for active state
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    color: tokens.colorBrandForeground1,
    fontWeight: tokens.fontWeightSemibold,

    // Left accent bar (2px) for selected item
    '::before': {
      backgroundColor: 'var(--color-brand-primary)',
    },

    ':hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.06)',
      color: tokens.colorBrandForeground1,
    },
  },

  navItemCollapsed: {
    justifyContent: 'center',
    ...shorthands.padding('10px'),
  },

  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    flexShrink: 0,
    width: '20px',
    height: '20px',
  },

  label: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: 1,
    transitionProperty: 'opacity',
    transitionDuration: '150ms',
    transitionTimingFunction: 'ease',
  },

  labelHidden: {
    opacity: 0,
    width: 0,
    flex: 0,
  },
});

/**
 * Sidebar Component
 *
 * A navigation sidebar with Fluent UI design patterns and enhanced accessibility.
 */
const Sidebar: React.FC<SidebarProps> = ({
  activeItem = 'documents',
  onNavigationChange,
  collapsed = false,
  items = defaultNavigationItems,
}) => {
  const styles = useStyles();
  const navRef = useRef<HTMLElement>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  // Handle navigation item click
  const handleItemClick = (itemId: string) => {
    onNavigationChange?.(itemId);
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>, index: number) => {
    const itemCount = items.length;
    let newIndex = index;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        newIndex = (index + 1) % itemCount;
        break;

      case 'ArrowUp':
        event.preventDefault();
        newIndex = (index - 1 + itemCount) % itemCount;
        break;

      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;

      case 'End':
        event.preventDefault();
        newIndex = itemCount - 1;
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        handleItemClick(items[index].id);
        return;

      default:
        return;
    }

    setFocusedIndex(newIndex);

    // Focus the new item
    const navItems = navRef.current?.querySelectorAll('[role="menuitem"]');
    if (navItems && navItems[newIndex]) {
      (navItems[newIndex] as HTMLElement).focus();
    }
  };

  // Reset focused index when active item changes externally
  useEffect(() => {
    const activeIndex = items.findIndex((item) => item.id === activeItem);
    if (activeIndex !== -1) {
      setFocusedIndex(activeIndex);
    }
  }, [activeItem, items]);

  return (
    <aside
      className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''}`}
      aria-label="Main navigation"
    >
      <nav
        ref={navRef}
        className={styles.nav}
        role="menu"
        aria-orientation="vertical"
      >
        {items.map((item, index) => {
          const isActive = item.id === activeItem;

          return (
            <button
              key={item.id}
              role="menuitem"
              aria-label={item.ariaLabel || item.label}
              aria-current={isActive ? 'page' : undefined}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ''} ${
                collapsed ? styles.navItemCollapsed : ''
              }`}
              onClick={() => handleItemClick(item.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              tabIndex={index === focusedIndex || (focusedIndex === -1 && index === 0) ? 0 : -1}
            >
              <span className={styles.iconWrapper}>{item.icon}</span>
              <span
                className={`${styles.label} ${collapsed ? styles.labelHidden : ''}`}
                aria-hidden={collapsed}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
