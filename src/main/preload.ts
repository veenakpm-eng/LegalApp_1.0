// Preload script - runs in renderer process before web content loads
// This is where you'd expose specific APIs to the renderer if needed

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // Platform info
  platform: process.platform,
  version: process.versions.electron,

  // Tray control APIs
  tray: {
    setState: (state: 'active' | 'idle') =>
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
});
