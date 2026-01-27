import { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain, screen, NativeImage } from 'electron';
import * as path from 'path';
import { Positioner } from 'electron-positioner';

let mainWindow: BrowserWindow | null = null;
let flyoutWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isQuitting = false;
let isTrackingActive = true; // Track current state for menu updates
let needsReviewCount = 0; // Number of entries needing review
let currentTooltip = 'LegalApp · Tracking · 0h 0m today';

/**
 * Get the appropriate tray icon based on the current state
 */
const getTrayIcon = (state: 'active' | 'idle' | 'needs-review'): NativeImage => {
  // needs-review uses the active icon (tracking is still running)
  const iconName = state === 'idle' ? 'tray-idle.png' : 'tray-active.png';
  const iconPath = app.isPackaged
    ? path.join(process.resourcesPath, 'assets', iconName)
    : path.join(__dirname, '../../assets', iconName);

  return nativeImage.createFromPath(iconPath);
};

/**
 * Create the main application window
 */
const createWindow = (): void => {
  const windowOptions: any = {
    width: 1200,
    height: 800,
    show: false, // Don't show until ready
    frame: true,
    transparent: true, // Enable transparency for Mica effect
    backgroundColor: '#00000000', // Fully transparent background
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '../../assets/icon.png'),
  };

  // Enable vibrancy on macOS
  if (process.platform === 'darwin') {
    windowOptions.vibrancy = 'under-window';
    windowOptions.visualEffectState = 'active';
  }

  // Enable background material on Windows 11
  if (process.platform === 'win32') {
    // Windows 11 Mica effect will be applied via CSS backdrop-filter
    // The transparent window allows the desktop wallpaper to show through
    windowOptions.backgroundMaterial = 'mica';
  }

  mainWindow = new BrowserWindow(windowOptions);

  // Load the app
  const isDev = !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  // Hide to tray instead of closing
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

/**
 * Create the flyout window for quick status display
 * This appears when clicking the tray icon
 */
const createFlyoutWindow = (): void => {
  if (flyoutWindow) {
    return;
  }

  flyoutWindow = new BrowserWindow({
    width: 280,
    height: 400,
    show: false,
    frame: false,
    resizable: false,
    skipTaskbar: true,
    transparent: false,
    backgroundColor: '#ffffff',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  const isDev = !app.isPackaged;

  if (isDev) {
    flyoutWindow.loadURL('http://localhost:3000#/flyout');
  } else {
    flyoutWindow.loadFile(path.join(__dirname, '../renderer/index.html'), {
      hash: '/flyout',
    });
  }

  // Hide when losing focus
  flyoutWindow.on('blur', () => {
    if (flyoutWindow && !flyoutWindow.webContents.isDevToolsOpened()) {
      flyoutWindow.hide();
    }
  });

  flyoutWindow.on('closed', () => {
    flyoutWindow = null;
  });
};

/**
 * Position the flyout window relative to the tray icon
 * Uses electron-positioner to handle taskbar position detection
 */
const positionFlyoutWindow = (): void => {
  if (!flyoutWindow || !tray) return;

  const trayBounds = tray.getBounds();
  const windowBounds = flyoutWindow.getBounds();
  const primaryDisplay = screen.getPrimaryDisplay();
  const workArea = primaryDisplay.workArea;

  let x = 0;
  let y = 0;

  // Detect taskbar position based on tray bounds
  const isBottom = trayBounds.y > workArea.height / 2;
  const isTop = trayBounds.y < workArea.height / 2 && trayBounds.y < 100;
  const isLeft = trayBounds.x < workArea.width / 2 && trayBounds.x < 100;
  const isRight = trayBounds.x > workArea.width / 2;

  if (isBottom) {
    // Taskbar at bottom (most common on Windows)
    x = Math.round(trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2);
    y = Math.round(trayBounds.y - windowBounds.height - 10);
  } else if (isTop) {
    // Taskbar at top
    x = Math.round(trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2);
    y = Math.round(trayBounds.y + trayBounds.height + 10);
  } else if (isLeft) {
    // Taskbar at left
    x = Math.round(trayBounds.x + trayBounds.width + 10);
    y = Math.round(trayBounds.y + trayBounds.height / 2 - windowBounds.height / 2);
  } else if (isRight) {
    // Taskbar at right
    x = Math.round(trayBounds.x - windowBounds.width - 10);
    y = Math.round(trayBounds.y + trayBounds.height / 2 - windowBounds.height / 2);
  }

  // Ensure window stays within screen bounds
  x = Math.max(workArea.x, Math.min(x, workArea.x + workArea.width - windowBounds.width));
  y = Math.max(workArea.y, Math.min(y, workArea.y + workArea.height - windowBounds.height));

  flyoutWindow.setPosition(x, y);
};

/**
 * Toggle the flyout window visibility
 */
const toggleFlyout = (): void => {
  if (!flyoutWindow) {
    createFlyoutWindow();
  }

  if (flyoutWindow) {
    if (flyoutWindow.isVisible()) {
      flyoutWindow.hide();
    } else {
      positionFlyoutWindow();
      flyoutWindow.show();
      flyoutWindow.focus();
    }
  }
};

/**
 * Update the tray context menu
 * This rebuilds the menu to update the Pause/Resume toggle state
 */
const updateTrayMenu = (): void => {
  if (!tray) return;

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'LegalApp',
      enabled: false,
    },
    { type: 'separator' },
    {
      label: isTrackingActive ? 'Pause Tracking' : 'Resume Tracking',
      click: () => {
        isTrackingActive = !isTrackingActive;
        updateTrayMenu();

        // Update tray icon based on state
        const newState = isTrackingActive ? 'active' : 'idle';
        tray?.setImage(getTrayIcon(newState));

        // Notify renderer process
        if (mainWindow) {
          mainWindow.webContents.send('tracking-state-changed', isTrackingActive);
        }
        if (flyoutWindow) {
          flyoutWindow.webContents.send('tracking-state-changed', isTrackingActive);
        }
      },
    },
    ...(needsReviewCount > 0
      ? [
          {
            label: `Review Entries (${needsReviewCount})`,
            click: () => {
              if (mainWindow) {
                mainWindow.show();
                mainWindow.focus();
              } else {
                createWindow();
              }
            },
          },
        ]
      : []),
    {
      label: 'Open Activity Feed',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
          // Send message to navigate to Activity tab
          mainWindow.webContents.send('navigate-to', 'activity');
        } else {
          createWindow();
        }
      },
    },
    {
      label: 'Sync Now',
      click: () => {
        // Trigger manual sync
        if (mainWindow) {
          mainWindow.webContents.send('trigger-sync');
        }
        if (flyoutWindow) {
          flyoutWindow.webContents.send('trigger-sync');
        }
      },
    },
    { type: 'separator' },
    {
      label: 'Exit',
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
};

/**
 * Create the system tray with persistent GUID
 */
const createTray = (): void => {
  const icon = getTrayIcon('active');

  // Use GUID for Windows persistence to maintain tray position
  tray = new Tray(icon, 'legalapp-tray-guid');

  // Set initial tooltip
  tray.setToolTip(currentTooltip);

  // Create context menu
  updateTrayMenu();

  // Left-click toggles flyout window
  tray.on('click', () => {
    toggleFlyout();
  });

  // Right-click shows context menu (handled automatically by setContextMenu)
};

/**
 * IPC Handlers for renderer communication
 */
const setupIPCHandlers = (): void => {
  // Handle tray state changes from renderer
  ipcMain.on('tray:set-state', (_event, state: 'active' | 'idle' | 'needs-review') => {
    if (tray) {
      tray.setImage(getTrayIcon(state));
      isTrackingActive = state !== 'idle';
      needsReviewCount = state === 'needs-review' ? 2 : 0;
      updateTrayMenu();
    }
  });

  // Handle tooltip updates from renderer
  ipcMain.on('tray:update-tooltip', (_event, text: string) => {
    if (tray) {
      currentTooltip = text;
      tray.setToolTip(text);
    }
  });

  // Window control handlers
  ipcMain.on('window:close', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window === mainWindow) {
      window?.hide();
    } else {
      window?.close();
    }
  });

  ipcMain.on('window:minimize', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    window?.minimize();
  });

  ipcMain.on('window:maximize', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window?.isMaximized()) {
      window.unmaximize();
    } else {
      window?.maximize();
    }
  });

  // Action handlers for flyout
  ipcMain.on('action:toggle-tracking', () => {
    // Toggle tracking state
    isTrackingActive = !isTrackingActive;

    // Update tray icon
    const newState = isTrackingActive ? 'active' : 'idle';
    tray?.setImage(getTrayIcon(newState));

    // Update tray menu
    updateTrayMenu();

    // Notify all windows of state change
    if (mainWindow) {
      mainWindow.webContents.send('tracking-state-changed', isTrackingActive);
    }
    if (flyoutWindow) {
      flyoutWindow.webContents.send('tracking-state-changed', isTrackingActive);
    }
  });

  ipcMain.on('action:open-main-window', () => {
    // Hide flyout
    if (flyoutWindow) {
      flyoutWindow.hide();
    }

    // Show or create main window
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    } else {
      createWindow();
    }
  });
};

/**
 * App lifecycle events
 */
app.whenReady().then(() => {
  setupIPCHandlers();
  createWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Keep app running in system tray on Windows
  // Don't quit when all windows are closed - stay in tray
  if (process.platform === 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  isQuitting = true;
});
