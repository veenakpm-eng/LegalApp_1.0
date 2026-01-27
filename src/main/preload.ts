// Preload script - runs in renderer process before web content loads
// This is where you'd expose specific APIs to the renderer if needed

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // Platform info
  platform: process.platform,
  version: process.versions.electron,

  // Tray control APIs
  tray: {
    setState: (state: 'active' | 'idle' | 'needs-review') =>
      ipcRenderer.send('tray:set-state', state),
    updateTooltip: (text: string) =>
      ipcRenderer.send('tray:update-tooltip', text),
  },

  // Window control APIs
  window: {
    close: () => ipcRenderer.send('window:close'),
    minimize: () => ipcRenderer.send('window:minimize'),
    maximize: () => ipcRenderer.send('window:maximize'),
  },

  // Action APIs for flyout
  actions: {
    toggleTracking: () => ipcRenderer.send('action:toggle-tracking'),
    openMainWindow: () => ipcRenderer.send('action:open-main-window'),
  },

  // IPC event listener APIs
  ipcRenderer: {
    on: (channel: string, func: (...args: any[]) => void) => {
      // Whitelist channels for security
      const validChannels = ['tracking-state-changed', 'navigate-to', 'trigger-sync'];
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (_event, ...args) => func(...args));
      }
    },
    removeListener: (channel: string, func: (...args: any[]) => void) => {
      const validChannels = ['tracking-state-changed', 'navigate-to', 'trigger-sync'];
      if (validChannels.includes(channel)) {
        ipcRenderer.removeListener(channel, func);
      }
    },
  },
});
