// Type definitions for Electron API exposed to renderer

export interface ElectronAPI {
  platform: string;
  version: string;
  tray: {
    setState: (state: 'active' | 'idle') => void;
    updateTooltip: (text: string) => void;
  };
  window: {
    close: () => void;
    minimize: () => void;
    maximize: () => void;
  };
  actions: {
    toggleTracking: () => void;
    openMainWindow: () => void;
  };
  ipcRenderer?: {
    on: (channel: string, func: (...args: any[]) => void) => void;
    removeListener: (channel: string, func: (...args: any[]) => void) => void;
  };
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
