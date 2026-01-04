/**
 * LegalApp Accessibility Hooks
 * WCAG 2.2 Level AA Compliance Utilities
 *
 * Provides React hooks for:
 * - Focus trap management for modals and flyouts
 * - Keyboard navigation for lists (arrow keys, Home, End)
 * - Screen reader announcements via aria-live regions
 */

import { useEffect, useRef, useCallback, useState } from 'react';

/* ========================================================================
   FOCUS TRAP HOOK
   ======================================================================== */

/**
 * Focus Trap Options
 */
interface FocusTrapOptions {
  /**
   * Whether the focus trap is currently active
   * @default true
   */
  enabled?: boolean;

  /**
   * Element to focus when trap is activated
   * If not provided, focuses the first focusable element
   */
  initialFocus?: HTMLElement | null;

  /**
   * Whether to return focus to the triggering element on cleanup
   * @default true
   */
  returnFocus?: boolean;

  /**
   * Callback when user attempts to escape (Escape key)
   */
  onEscape?: () => void;
}

/**
 * Creates a focus trap within a container element
 * Prevents keyboard focus from leaving the container
 * Essential for modal dialogs and flyouts
 *
 * @example
 * ```tsx
 * function Modal({ isOpen, onClose }) {
 *   const trapRef = useFocusTrap({
 *     enabled: isOpen,
 *     onEscape: onClose,
 *   });
 *
 *   if (!isOpen) return null;
 *
 *   return (
 *     <div ref={trapRef} role="dialog" aria-modal="true">
 *       <h2>Modal Title</h2>
 *       <button onClick={onClose}>Close</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useFocusTrap<T extends HTMLElement = HTMLDivElement>(
  options: FocusTrapOptions = {}
) {
  const {
    enabled = true,
    initialFocus = null,
    returnFocus = true,
    onEscape,
  } = options;

  const containerRef = useRef<T>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  /**
   * Get all focusable elements within the container
   */
  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(', ');

    const elements = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(focusableSelectors)
    );

    // Filter out hidden elements
    return elements.filter((el) => {
      return (
        el.offsetParent !== null &&
        !el.hasAttribute('hidden') &&
        window.getComputedStyle(el).display !== 'none' &&
        window.getComputedStyle(el).visibility !== 'hidden'
      );
    });
  }, []);

  /**
   * Handle Tab key navigation
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled || !containerRef.current) return;

      // Handle Escape key
      if (event.key === 'Escape' && onEscape) {
        event.preventDefault();
        onEscape();
        return;
      }

      // Only handle Tab key
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement as HTMLElement;

      // Shift + Tab: moving backwards
      if (event.shiftKey) {
        if (activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      }
      // Tab: moving forwards
      else {
        if (activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    },
    [enabled, onEscape, getFocusableElements]
  );

  /**
   * Set up focus trap
   */
  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    // Store currently focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focus initial element or first focusable element
    const focusableElements = getFocusableElements();
    if (initialFocus && containerRef.current.contains(initialFocus)) {
      initialFocus.focus();
    } else if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    // Add keyboard listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);

      // Return focus to previous element
      if (
        returnFocus &&
        previousActiveElement.current &&
        document.body.contains(previousActiveElement.current)
      ) {
        previousActiveElement.current.focus();
      }
    };
  }, [enabled, initialFocus, returnFocus, handleKeyDown, getFocusableElements]);

  return containerRef;
}

/* ========================================================================
   KEYBOARD NAVIGATION HOOK
   ======================================================================== */

/**
 * Keyboard Navigation Options
 */
interface KeyboardNavigationOptions {
  /**
   * Whether keyboard navigation is enabled
   * @default true
   */
  enabled?: boolean;

  /**
   * Selector for navigable items
   * @default '[role="option"], [role="menuitem"], [role="tab"]'
   */
  itemSelector?: string;

  /**
   * Whether navigation wraps around (end to start, start to end)
   * @default true
   */
  loop?: boolean;

  /**
   * Orientation of the list
   * @default 'vertical'
   */
  orientation?: 'vertical' | 'horizontal' | 'both';

  /**
   * Callback when selection changes
   */
  onSelectionChange?: (element: HTMLElement, index: number) => void;

  /**
   * Callback when item is activated (Enter or Space)
   */
  onItemActivate?: (element: HTMLElement, index: number) => void;
}

/**
 * Provides keyboard navigation for lists
 * Supports arrow keys, Home, End, and typeahead
 *
 * @example
 * ```tsx
 * function NavigableList({ items }) {
 *   const listRef = useKeyboardNavigation({
 *     onItemActivate: (element, index) => {
 *       console.log('Activated item:', index);
 *     },
 *   });
 *
 *   return (
 *     <div ref={listRef} role="listbox">
 *       {items.map((item, i) => (
 *         <div key={i} role="option" tabIndex={-1}>
 *           {item.name}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useKeyboardNavigation<T extends HTMLElement = HTMLDivElement>(
  options: KeyboardNavigationOptions = {}
) {
  const {
    enabled = true,
    itemSelector = '[role="option"], [role="menuitem"], [role="tab"], [data-navigable="true"]',
    loop = true,
    orientation = 'vertical',
    onSelectionChange,
    onItemActivate,
  } = options;

  const containerRef = useRef<T>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const typeaheadBuffer = useRef<string>('');
  const typeaheadTimeout = useRef<NodeJS.Timeout | null>(null);

  /**
   * Get all navigable items
   */
  const getNavigableItems = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];

    return Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(itemSelector)
    ).filter((el) => {
      return (
        !el.hasAttribute('disabled') &&
        !el.hasAttribute('aria-disabled') &&
        el.offsetParent !== null
      );
    });
  }, [itemSelector]);

  /**
   * Focus item at index
   */
  const focusItem = useCallback(
    (index: number) => {
      const items = getNavigableItems();
      if (index < 0 || index >= items.length) return;

      const item = items[index];
      item.focus();
      item.setAttribute('data-keyboard-active', 'true');

      // Remove attribute from other items
      items.forEach((el, i) => {
        if (i !== index) {
          el.removeAttribute('data-keyboard-active');
        }
      });

      setCurrentIndex(index);
      if (onSelectionChange) {
        onSelectionChange(item, index);
      }
    },
    [getNavigableItems, onSelectionChange]
  );

  /**
   * Navigate to next/previous item
   */
  const navigate = useCallback(
    (direction: 'next' | 'previous' | 'first' | 'last') => {
      const items = getNavigableItems();
      if (items.length === 0) return;

      let newIndex = currentIndex;

      switch (direction) {
        case 'next':
          newIndex = currentIndex + 1;
          if (newIndex >= items.length) {
            newIndex = loop ? 0 : items.length - 1;
          }
          break;
        case 'previous':
          newIndex = currentIndex - 1;
          if (newIndex < 0) {
            newIndex = loop ? items.length - 1 : 0;
          }
          break;
        case 'first':
          newIndex = 0;
          break;
        case 'last':
          newIndex = items.length - 1;
          break;
      }

      focusItem(newIndex);
    },
    [currentIndex, loop, getNavigableItems, focusItem]
  );

  /**
   * Typeahead search
   */
  const handleTypeahead = useCallback(
    (char: string) => {
      const items = getNavigableItems();
      if (items.length === 0) return;

      // Clear existing timeout
      if (typeaheadTimeout.current) {
        clearTimeout(typeaheadTimeout.current);
      }

      // Add character to buffer
      typeaheadBuffer.current += char.toLowerCase();

      // Find matching item
      const startIndex = currentIndex + 1;
      const searchString = typeaheadBuffer.current;

      for (let i = 0; i < items.length; i++) {
        const index = (startIndex + i) % items.length;
        const item = items[index];
        const text = (
          item.textContent ||
          item.getAttribute('aria-label') ||
          ''
        ).toLowerCase();

        if (text.startsWith(searchString)) {
          focusItem(index);
          break;
        }
      }

      // Clear buffer after 500ms
      typeaheadTimeout.current = setTimeout(() => {
        typeaheadBuffer.current = '';
      }, 500);
    },
    [currentIndex, getNavigableItems, focusItem]
  );

  /**
   * Handle keyboard events
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const { key } = event;

      // Ignore if modifier keys are pressed (except Shift for selection)
      if (event.ctrlKey || event.altKey || event.metaKey) return;

      // Navigation keys
      const isVertical = orientation === 'vertical' || orientation === 'both';
      const isHorizontal = orientation === 'horizontal' || orientation === 'both';

      if ((key === 'ArrowDown' && isVertical) || (key === 'ArrowRight' && isHorizontal)) {
        event.preventDefault();
        navigate('next');
      } else if ((key === 'ArrowUp' && isVertical) || (key === 'ArrowLeft' && isHorizontal)) {
        event.preventDefault();
        navigate('previous');
      } else if (key === 'Home') {
        event.preventDefault();
        navigate('first');
      } else if (key === 'End') {
        event.preventDefault();
        navigate('last');
      } else if (key === 'Enter' || key === ' ') {
        event.preventDefault();
        const items = getNavigableItems();
        if (currentIndex >= 0 && currentIndex < items.length && onItemActivate) {
          onItemActivate(items[currentIndex], currentIndex);
        }
      } else if (key.length === 1 && /[a-z0-9]/i.test(key)) {
        // Typeahead
        event.preventDefault();
        handleTypeahead(key);
      }
    },
    [enabled, orientation, navigate, currentIndex, getNavigableItems, onItemActivate, handleTypeahead]
  );

  /**
   * Set up keyboard listeners
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!enabled || !container) return;

    container.addEventListener('keydown', handleKeyDown as any);

    return () => {
      container.removeEventListener('keydown', handleKeyDown as any);
      if (typeaheadTimeout.current) {
        clearTimeout(typeaheadTimeout.current);
      }
    };
  }, [enabled, handleKeyDown]);

  /**
   * Initialize first item focus
   */
  useEffect(() => {
    if (enabled && currentIndex === -1) {
      const items = getNavigableItems();
      if (items.length > 0) {
        // Don't auto-focus, just set the index
        setCurrentIndex(0);
      }
    }
  }, [enabled, currentIndex, getNavigableItems]);

  return containerRef;
}

/* ========================================================================
   SCREEN READER ANNOUNCEMENT HOOK
   ======================================================================== */

/**
 * Announcement Priority
 */
type AnnouncementPriority = 'polite' | 'assertive';

/**
 * Announcement Options
 */
interface AnnouncementOptions {
  /**
   * Priority level for the announcement
   * - 'polite': Wait for current speech to finish
   * - 'assertive': Interrupt current speech
   * @default 'polite'
   */
  priority?: AnnouncementPriority;

  /**
   * Delay before announcement (ms)
   * Useful for ensuring DOM updates complete
   * @default 100
   */
  delay?: number;

  /**
   * How long to keep the announcement visible (ms)
   * @default 1000
   */
  timeout?: number;
}

/**
 * Creates ARIA live regions for screen reader announcements
 * Provides a function to announce messages to screen reader users
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const announce = useAnnouncer();
 *
 *   const handleSave = async () => {
 *     await saveData();
 *     announce('Data saved successfully', { priority: 'polite' });
 *   };
 *
 *   const handleError = (error) => {
 *     announce(`Error: ${error.message}`, { priority: 'assertive' });
 *   };
 *
 *   return <button onClick={handleSave}>Save</button>;
 * }
 * ```
 */
export function useAnnouncer() {
  const politeRegionRef = useRef<HTMLDivElement | null>(null);
  const assertiveRegionRef = useRef<HTMLDivElement | null>(null);

  /**
   * Create live regions on mount
   */
  useEffect(() => {
    // Check if regions already exist
    let politeRegion = document.getElementById('a11y-announcer-polite') as HTMLDivElement;
    let assertiveRegion = document.getElementById('a11y-announcer-assertive') as HTMLDivElement;

    // Create polite region if it doesn't exist
    if (!politeRegion) {
      politeRegion = document.createElement('div');
      politeRegion.id = 'a11y-announcer-polite';
      politeRegion.className = 'a11y-live-region';
      politeRegion.setAttribute('role', 'status');
      politeRegion.setAttribute('aria-live', 'polite');
      politeRegion.setAttribute('aria-atomic', 'true');
      politeRegion.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
      `;
      document.body.appendChild(politeRegion);
    }

    // Create assertive region if it doesn't exist
    if (!assertiveRegion) {
      assertiveRegion = document.createElement('div');
      assertiveRegion.id = 'a11y-announcer-assertive';
      assertiveRegion.className = 'a11y-live-region';
      assertiveRegion.setAttribute('role', 'alert');
      assertiveRegion.setAttribute('aria-live', 'assertive');
      assertiveRegion.setAttribute('aria-atomic', 'true');
      assertiveRegion.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
      `;
      document.body.appendChild(assertiveRegion);
    }

    politeRegionRef.current = politeRegion;
    assertiveRegionRef.current = assertiveRegion;

    // Cleanup: Remove regions when no components are using them
    return () => {
      // Don't remove - they're shared across components
    };
  }, []);

  /**
   * Announce a message to screen readers
   */
  const announce = useCallback(
    (
      message: string,
      options: AnnouncementOptions = {}
    ) => {
      const {
        priority = 'polite',
        delay = 100,
        timeout = 1000,
      } = options;

      const region =
        priority === 'assertive'
          ? assertiveRegionRef.current
          : politeRegionRef.current;

      if (!region) return;

      // Delay announcement to ensure DOM updates complete
      setTimeout(() => {
        // Clear previous content
        region.textContent = '';

        // Force reflow to ensure screen readers notice the change
        void region.offsetHeight;

        // Set new message
        region.textContent = message;

        // Clear after timeout to allow for re-announcements
        setTimeout(() => {
          region.textContent = '';
        }, timeout);
      }, delay);
    },
    []
  );

  return announce;
}

/* ========================================================================
   ROVING TABINDEX HOOK
   ======================================================================== */

/**
 * Implements roving tabindex pattern for component groups
 * Only one item is tabbable at a time, arrow keys navigate between items
 *
 * @example
 * ```tsx
 * function Toolbar() {
 *   const { containerProps, itemProps } = useRovingTabIndex();
 *
 *   return (
 *     <div {...containerProps} role="toolbar">
 *       <button {...itemProps(0)}>Cut</button>
 *       <button {...itemProps(1)}>Copy</button>
 *       <button {...itemProps(2)}>Paste</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useRovingTabIndex(itemCount: number, initialIndex: number = 0) {
  const [focusedIndex, setFocusedIndex] = useState(initialIndex);

  const containerProps = {
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % itemCount);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + itemCount) % itemCount);
      } else if (e.key === 'Home') {
        e.preventDefault();
        setFocusedIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setFocusedIndex(itemCount - 1);
      }
    },
  };

  const itemProps = (index: number) => ({
    tabIndex: index === focusedIndex ? 0 : -1,
    onFocus: () => setFocusedIndex(index),
  });

  return { containerProps, itemProps, focusedIndex, setFocusedIndex };
}

/* ========================================================================
   EXPORTS
   ======================================================================== */

export default {
  useFocusTrap,
  useKeyboardNavigation,
  useAnnouncer,
  useRovingTabIndex,
};
