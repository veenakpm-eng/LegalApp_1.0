# LegalApp - Windows Desktop Prototype

A Windows-style desktop application prototype built with Electron, React, TypeScript, and Fluent UI.

## Features

- **System Tray Integration** - Always-on experience with system tray as primary interface
- **Windows-Native Feel** - Built with Microsoft Fluent UI design system
- **Modern Stack** - Electron + React + TypeScript
- **Professional UI** - Clean, minimal, and focused interface

## Tech Stack

- **Electron** - Desktop application framework
- **React** - UI library
- **TypeScript** - Type-safe development
- **Fluent UI** - Microsoft's design system for Windows-native look and feel

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

This will:
1. Start the webpack dev server for the renderer process
2. Launch Electron with hot reload enabled

### Building

```bash
npm run build
```

Builds both the main and renderer processes for production.

### Packaging

```bash
npm run package
```

Creates a distributable Windows application in the `release` folder.

## Project Structure

```
src/
├── main/           # Electron main process
│   ├── main.ts     # App lifecycle, window & tray management
│   └── preload.ts  # Preload script for renderer
└── renderer/       # React application
    ├── index.html  # HTML template
    ├── index.tsx   # React entry point
    └── App.tsx     # Main application component
```

## Design Principles

- **System tray first** - Primary interface is the system tray
- **Windows-native** - Uses Fluent UI for authentic Windows feel
- **Always-on** - App stays in tray instead of closing
- **Minimal and fast** - Clean UI with non-blocking interactions
- **Desktop-focused** - No browser or mobile UI patterns

## Notes

This is a UI/UX prototype that simulates Windows desktop behavior. It does not implement real Windows APIs or OS-level integrations.
