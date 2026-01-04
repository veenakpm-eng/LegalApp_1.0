import React from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  mergeClasses,
} from '@fluentui/react-components';

/**
 * Card Component
 *
 * Reusable card component with proper depth and visual refinement:
 * - Multiple variants: elevated, outlined, filled
 * - Interactive states with hover effects
 * - Selected state with brand color border
 * - Accessible focus states
 * - Smooth shadow transitions
 */

// ============================================
// Types
// ============================================

export interface CardProps {
  /** Visual variant of the card */
  variant?: 'elevated' | 'outlined' | 'filled';
  /** Enable interactive hover effects */
  interactive?: boolean;
  /** Show selected state */
  selected?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS class names */
  className?: string;
  /** Children elements */
  children?: React.ReactNode;
  /** Tab index for keyboard navigation */
  tabIndex?: number;
  /** Role for accessibility */
  role?: string;
  /** ARIA label */
  'aria-label'?: string;
  /** Key down handler */
  onKeyDown?: (e: React.KeyboardEvent) => void;
  /** Mouse enter handler */
  onMouseEnter?: () => void;
  /** Mouse leave handler */
  onMouseLeave?: () => void;
}

// ============================================
// Styles
// ============================================

const useStyles = makeStyles({
  // Base card styles
  card: {
    display: 'block',
    position: 'relative',
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius('4px'), // 4px border radius for in-page elements
    ...shorthands.padding('16px'),
    transitionProperty: 'box-shadow, transform, border-color, background-color',
    transitionDuration: '200ms',
    transitionTimingFunction: 'ease',

    // Focus state for accessibility
    ':focus-visible': {
      ...shorthands.outline('2px', 'solid', tokens.colorBrandStroke1),
      outlineOffset: '2px',
    },
  },

  // Elevated variant - subtle shadow that increases on hover
  elevated: {
    boxShadow: 'var(--shadow-card)', // 0 1px 2px rgba(0,0,0,0.05)
    ...shorthands.border('none'),
  },

  // Outlined variant - 1px border, no shadow
  outlined: {
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    boxShadow: 'none',
  },

  // Filled variant - light background, no shadow
  filled: {
    backgroundColor: tokens.colorNeutralBackground2,
    boxShadow: 'none',
    ...shorthands.border('none'),
  },

  // Interactive state - cursor pointer
  interactive: {
    cursor: 'pointer',
    userSelect: 'none',
  },

  // Hover states for interactive cards
  elevatedInteractiveHover: {
    ':hover': {
      boxShadow: 'var(--shadow-card-hover)', // 0 2px 4px rgba(0,0,0,0.1)
      transform: 'translateY(-1px)',
    },

    ':active': {
      transform: 'translateY(0)',
    },
  },

  outlinedInteractiveHover: {
    ':hover': {
      borderColor: tokens.colorNeutralStroke1,
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },

  filledInteractiveHover: {
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground2Hover,
    },
  },

  // Selected state - 2px brand color border with slightly elevated shadow
  selected: {
    ...shorthands.border('2px', 'solid', tokens.colorBrandStroke1),
    boxShadow: '0 2px 6px rgba(0, 120, 212, 0.15)', // Elevated shadow with brand tint
  },

  selectedElevated: {
    boxShadow: '0 2px 6px rgba(0, 120, 212, 0.15)',
  },

  selectedOutlined: {
    borderColor: tokens.colorBrandStroke1,
    borderWidth: '2px',
  },

  selectedFilled: {
    backgroundColor: tokens.colorBrandBackground2,
    borderColor: tokens.colorBrandStroke1,
    borderWidth: '2px',
    borderStyle: 'solid',
  },
});

// ============================================
// Card Component
// ============================================

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'elevated',
      interactive = false,
      selected = false,
      onClick,
      className,
      children,
      tabIndex,
      role,
      'aria-label': ariaLabel,
      onKeyDown,
      onMouseEnter,
      onMouseLeave,
    },
    ref
  ) => {
    const styles = useStyles();

    // Build class list based on variant and state
    const cardClasses = mergeClasses(
      styles.card,

      // Variant styles
      variant === 'elevated' && styles.elevated,
      variant === 'outlined' && styles.outlined,
      variant === 'filled' && styles.filled,

      // Interactive styles
      interactive && styles.interactive,
      interactive && variant === 'elevated' && styles.elevatedInteractiveHover,
      interactive && variant === 'outlined' && styles.outlinedInteractiveHover,
      interactive && variant === 'filled' && styles.filledInteractiveHover,

      // Selected state styles
      selected && styles.selected,
      selected && variant === 'elevated' && styles.selectedElevated,
      selected && variant === 'outlined' && styles.selectedOutlined,
      selected && variant === 'filled' && styles.selectedFilled,

      // Additional class names
      className
    );

    // Handle keyboard events for accessibility
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (onKeyDown) {
        onKeyDown(e);
      } else if (interactive && onClick && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onClick();
      }
    };

    // Determine tabIndex
    const effectiveTabIndex = tabIndex !== undefined ? tabIndex : (interactive ? 0 : undefined);

    return (
      <div
        ref={ref}
        className={cardClasses}
        onClick={interactive ? onClick : undefined}
        onKeyDown={handleKeyDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        tabIndex={effectiveTabIndex}
        role={role || (interactive ? 'button' : undefined)}
        aria-label={ariaLabel}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
