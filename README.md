# Club UAA Campañas — Electron Edition

Desktop campaign manager for Club UAA supermarket loyalty program. Built with Electron + React + TypeScript.

## Architecture (Phase 1)

- **Main Process** (Node.js backend) — will handle SQL Server, IPC
- **Renderer** (React UI) — campaign creation flow
- **IPC** — secure communication between processes
- **CSV/XLSX Parsing** — detect columns, handle encodings

## Project Structure

```
src/
├── main/
│   ├── main.ts          (Electron entry point)
│   └── preload.ts       (IPC bridge)
├── renderer/
│   ├── index.tsx        (React entry)
│   ├── App.tsx          (Main component)
│   ├── index.html       (HTML template)
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Campaign.tsx (5-step flow)
│   │   └── steps/
│   │       ├── Step1Upload.tsx
│   │       ├── Step2Design.tsx
│   │       └── Step3Preview.tsx
│   └── utils/
│       ├── constants.ts (colors, templates)
│       └── csv-parser.ts
```

## Development

### Install dependencies
```bash
npm install
```

### Run dev (Electron + hot reload)
```bash
npm run dev
```

### Build (TypeScript)
```bash
npm run build
```

### Create .exe installer
```bash
npm run dist
```

## Phase 1 Features

- ✅ 5-step campaign flow (load CSV → design → preview → (send in Phase 2))
- ✅ CSV/XLSX file parsing
- ✅ Auto-detect phone and name columns
- ✅ Template selection
- ✅ Variable interpolation
- ✅ Message preview per contact
- ✅ Club UAA purple design system

## Phase 2+ Roadmap

- 🔄 SQL Server connection (tedious driver)
- 🔄 User login (against usuarios table)
- 🔄 Campaign persistence (INSERT into SQL Server)
- 🔄 Meta WhatsApp send integration
- 🔄 Windows installer + auto-updater
