declare module 'electron-positioner' {
  import { BrowserWindow, Screen } from 'electron';

  export class Positioner {
    constructor(window: BrowserWindow);
    move(
      position:
        | 'trayLeft'
        | 'trayBottomLeft'
        | 'trayRight'
        | 'trayBottomRight'
        | 'trayCenter'
        | 'trayBottomCenter'
        | 'topLeft'
        | 'topRight'
        | 'bottomLeft'
        | 'bottomRight'
        | 'topCenter'
        | 'bottomCenter'
        | 'leftCenter'
        | 'rightCenter'
        | 'center',
      trayBounds?: Electron.Rectangle
    ): void;
    calculate(
      position: string,
      trayBounds?: Electron.Rectangle
    ): { x: number; y: number };
  }
}
