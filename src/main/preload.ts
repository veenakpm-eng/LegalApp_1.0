// Preload script - runs in renderer process before web content loads
// This is where you'd expose specific APIs to the renderer if needed

import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // Add any APIs you want to expose to renderer here
  platform: process.platform,
  version: process.versions.electron
});
