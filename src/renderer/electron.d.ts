// Type definitions for Electron API exposed to renderer

export interface ElectronAPI {
  platform: string;
  version: string;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
