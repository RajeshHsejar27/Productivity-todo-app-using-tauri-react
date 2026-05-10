# Modern Desktop To-Do Tracker

A high-performance, offline-first Windows desktop application built for professional task management. This app prioritizes speed, stability, and a premium "dashboard" aesthetic.

## 🚀 Features

- **Productivity Dashboard**: High-level overview of Today's tasks, Upcoming work, and Progress metrics.
- **SQLite Persistence**: Robust local storage using `rusqlite` via Tauri backend—no Node.js runtime required for data.
- **Dynamic Categories**: Organize tasks with custom categories and color-coding.
- **Interactive UI**: Double-click to edit, smooth transitions, and keyboard-friendly navigation.
- **Sound Effects**: Audio feedback for task creation, completion, and deletion.
- **Backup & Restore**: Export your entire database to JSON and restore it instantly via the Settings panel.
- **Dark Mode**: Native system-aware theme support with manual override.

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui, Framer Motion
- **Desktop Framework**: Tauri v2 (Rust-based)
- **Database**: SQLite (`tauri-plugin-sql`)
- **State Management**: Zustand
- **Date Handling**: date-fns

## 📂 Project Structure

```text
├── src/                    # Frontend source code
│   ├── components/         # React components
│   │   ├── dashboard/      # Stat cards and overview widgets
│   │   ├── layout/         # Sidebar, Navbar, and Shell
│   │   ├── settings/       # Backup, Restore, and Theme settings
│   │   ├── tasks/          # Task list, Editor, and Category dialogs
│   │   └── ui/             # Reusable shadcn/ui base components
│   ├── lib/                # Shared utilities
│   │   ├── api.ts          # SQLite database abstraction layer
│   │   ├── sounds.ts       # Web Audio API sound effect manager
│   │   └── utils.ts        # Tailwind class merger and helpers
│   ├── store/              # Zustand state management stores
│   │   ├── appStore.ts     # View state and navigation
│   │   ├── categoryStore.ts# Category CRUD and persistence
│   │   ├── settingsStore.ts# User preferences and theme
│   │   └── taskStore.ts    # Task CRUD and sound triggers
│   ├── types/              # TypeScript interfaces and enums
│   ├── App.css             # Global styles and Tailwind configuration
│   ├── App.tsx             # Main application shell and routing
│   └── main.tsx            # Application entry point
├── src-tauri/              # Rust backend code
│   ├── capabilities/       # Security permission definitions (SQL, FS, Dialog)
│   ├── src/                # Rust source files
│   │   ├── lib.rs          # Plugin initialization and SQL migrations
│   │   └── main.rs         # Desktop entry point
│   ├── Cargo.toml          # Rust dependencies (tauri, rusqlite)
│   └── tauri.conf.json     # Tauri app configuration and build settings
├── README.md               # Project documentation
└── package.json            # Node.js dependencies and scripts
```

## 🔨 Development

### Prerequisites
- [Rust](https://www.rust-lang.org/tools/install)
- [Node.js](https://nodejs.org/)

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Run in development mode:
   ```bash
   npm run tauri dev
   ```

3. Build for production:
   ```bash
   npm run tauri build
   ```
