# Mica Material System Implementation

## Overview
This document describes the complete implementation of the Mica material system from Fluent Design 2.0 in the LegalApp desktop application.

## Implementation Summary

### Task 1: Electron Main Process Updates
**File**: `src/main/main.ts`

**Changes:**
- Set `transparent: true` to enable window transparency
- Set `backgroundColor: '#00000000'` for fully transparent background
- Added macOS vibrancy support with `vibrancy: 'under-window'`
- Added Windows 11 Mica support with `backgroundMaterial: 'mica'`
- Platform-specific handling for optimal material effects

**Code Location**: `src/main/main.ts:27-56`

### Task 2: MicaBackground Component
**Files Created:**
- `src/renderer/components/MicaBackground/MicaBackground.tsx`
- `src/renderer/components/MicaBackground/index.ts`
- `src/renderer/components/MicaBackground/MicaBackground.module.css`

**Features:**
- Mica Alt effect with `backdrop-filter: blur(20px) saturate(180%)`
- Light mode: `rgba(255, 255, 255, 0.85)` background
- Dark mode: `rgba(32, 32, 32, 0.85)` background
- Automatic fallback for browsers without backdrop-filter support
- Proper z-index layering (background layer at z-index: 0, content at z-index: 1)
- System theme detection via `window.matchMedia('prefers-color-scheme: dark')`

**Props:**
- `variant`: 'light' | 'dark' | 'auto' (default: 'auto')
- `children`: React components to render above the Mica effect
- `className`: Optional CSS class name

### Task 3: App Layout Integration
**File**: `src/renderer/App.tsx`

**Changes:**
- Wrapped entire app in `<MicaBackground variant="auto">`
- Updated styles to use CSS custom properties:
  - `--mica-base`: Main background color
  - `--mica-header`: Header background color
  - `--mica-sidebar`: Sidebar background color
- Made title bar transparent to show Mica effect
- Added `backdrop-filter: blur(10px)` to header and sidebar for layered effect
- Updated Sidebar component to use `var(--mica-sidebar)` for dynamic theming

**Files Modified:**
- `src/renderer/App.tsx:18,40-47,51,70-79,100-104,395-484`
- `src/renderer/components/Sidebar/Sidebar.tsx:89-96`

### Task 4: Dark Mode Support
**Files Created:**
- `src/renderer/contexts/ThemeContext.tsx`
- `src/renderer/views/SettingsView/SettingsView.tsx`
- `src/renderer/views/SettingsView/index.ts`

**Theme System Features:**
- `ThemeProvider` component wraps the app
- `useTheme()` hook for accessing theme state anywhere in the app
- Three theme modes:
  - **Light**: Always use light theme
  - **Dark**: Always use dark theme
  - **Auto**: Follow system preference (default)
- Automatic system theme detection and updates
- CSS custom properties updated dynamically based on theme
- Integration with Fluent UI themes (webLightTheme/webDarkTheme)

**Settings View:**
- Radio button group for theme selection
- Visual icons for each theme mode
- Real-time theme switching
- Description of current system theme when in Auto mode
- Information about Mica material system

**Files Modified:**
- `src/renderer/index.tsx:3-6,26` - Added ThemeProvider wrapper

### CSS Custom Properties
The following CSS variables are set dynamically based on theme:

```css
/* Light Mode */
--mica-base: rgba(255, 255, 255, 0.85)
--mica-alt: rgba(249, 249, 249, 0.85)
--mica-header: rgba(255, 255, 255, 0.5)
--mica-sidebar: rgba(249, 249, 249, 0.5)

/* Dark Mode */
--mica-base: rgba(32, 32, 32, 0.85)
--mica-alt: rgba(28, 28, 28, 0.85)
--mica-header: rgba(32, 32, 32, 0.5)
--mica-sidebar: rgba(28, 28, 28, 0.5)
```

## Material Specifications (From Report)

### Mica Alt
- **Background**: `rgba(255, 255, 255, 0.85)` (light) / `rgba(32, 32, 32, 0.85)` (dark)
- **Backdrop Filter**: `blur(20px) saturate(180%)`
- **Applied to**: Main window background, sidebar container

## Technical Details

### Browser Compatibility
The implementation includes fallbacks for browsers that don't support `backdrop-filter`:
- **With backdrop-filter**: Full Mica effect with blur and saturation
- **Without backdrop-filter**: Solid background with higher opacity (0.95)

### Platform Support
- **Windows 11**: Native Mica material via Electron API
- **macOS**: Vibrancy effect using `under-window` mode
- **Other platforms**: CSS-based backdrop-filter effect

### Performance Considerations
- Backdrop filter is GPU-accelerated on modern browsers
- Fallback mode uses simple solid backgrounds for older systems
- Z-index layering ensures content stays above effect layers
- Smooth transitions (150ms-200ms) for theme changes

## Usage Example

### Using MicaBackground Component
```tsx
import MicaBackground from './components/MicaBackground';

function App() {
  return (
    <MicaBackground variant="auto">
      {/* Your app content */}
    </MicaBackground>
  );
}
```

### Using Theme Context
```tsx
import { useTheme } from './contexts/ThemeContext';

function MyComponent() {
  const { mode, resolvedTheme, setMode } = useTheme();

  return (
    <div>
      <p>Current theme: {resolvedTheme}</p>
      <button onClick={() => setMode('dark')}>Dark Mode</button>
      <button onClick={() => setMode('light')}>Light Mode</button>
      <button onClick={() => setMode('auto')}>Auto Mode</button>
    </div>
  );
}
```

## Testing

To test the implementation:

1. **Build the project**: `npm run build`
2. **Start the app**: `npm start`
3. **Verify Mica effect**:
   - Check that the window background is semi-transparent
   - Verify desktop wallpaper shows through with blur effect
   - Test on different wallpapers to see dynamic tinting
4. **Test dark mode**:
   - Open Settings view
   - Switch between Light, Dark, and Auto modes
   - Change system theme and verify Auto mode follows it
5. **Test fallback**:
   - Use browser DevTools to disable backdrop-filter
   - Verify solid background fallback appears

## Files Modified

### New Files
1. `src/renderer/components/MicaBackground/MicaBackground.tsx`
2. `src/renderer/components/MicaBackground/index.ts`
3. `src/renderer/components/MicaBackground/MicaBackground.module.css`
4. `src/renderer/contexts/ThemeContext.tsx`
5. `src/renderer/views/SettingsView/SettingsView.tsx`
6. `src/renderer/views/SettingsView/index.ts`

### Modified Files
1. `src/main/main.ts` - Electron window configuration
2. `src/renderer/App.tsx` - MicaBackground integration and theme-aware styles
3. `src/renderer/components/Sidebar/Sidebar.tsx` - Dynamic theme support
4. `src/renderer/index.tsx` - ThemeProvider wrapper

## Next Steps

Potential enhancements:
- Add custom accent color support
- Implement additional Fluent material types (Acrylic, Smoke)
- Add theme persistence to localStorage
- Create theme animation transitions
- Add HDR display support
