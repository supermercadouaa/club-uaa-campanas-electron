# Changelog

## [1.0.0] - 2026-06-29

### ✨ Initial Release

**Features:**
- Electron desktop application (Windows .exe)
- Vanilla HTML/CSS/JS frontend (no React)
- SQL Server authentication with encrypted credentials
- User login system with mandatory password change on first login
- 5-step campaign workflow:
  1. Upload CSV/Excel with auto-column detection
  2. Select template and add dynamic variables
  3. Preview messages with real contact data
  4. Create campaign with send configuration
  5. Campaign execution and tracking
- Dynamic product/price/offer variables (3 sets per campaign)
- Global configuration modal for SQL Server connection settings
- Campaign persistence with one contact row per envio record
- Email domain suffix auto-completion (@uaa.com.ar)
- CSV parsing with BOM detection
- Paste-from-Excel feature for bulk variable input

**Technical:**
- Electron 28.3.3
- Node.js main process with TypeScript
- Tedious driver for SQL Server connectivity
- DPAPI encryption for Windows credential storage
- bcryptjs for password hashing
- Vite build system
- Vanilla HTML/CSS/JS (no framework)

**Database Integration:**
- Connects to SQL Server on-premise
- User authentication against `super_usuarios` table
- Campaign creation in `super_campanias` table
- Contact-level data persistence in `super_campanias_envios`
- One row per contact with all product/price/offer data flattened
- DPAPI-encrypted credentials stored in %APPDATA%

### 🔒 Security
- Context isolation enabled in Electron
- Encrypted SQL Server credentials (DPAPI)
- No hardcoded credentials
- Secure IPC bridge via preload script

### 📝 Known Limitations
- No auto-update mechanism (v2.0 feature)
- Manual .exe distribution required
- Requires direct SQL Server access on local network
- No built-in logging (v1.1 feature)

### 🚀 How to Use
1. Download `Club-UAA-Campanas-v1.0.0.exe`
2. Run the executable
3. Enter SQL Server connection details (host, port, database, username, password)
4. Login with your credentials
5. Follow the 5-step campaign workflow

### 📦 Distribution
- Download from: https://github.com/supermercadouaa/club-uaa-campanas-electron/releases/tag/v1.0.0
- File: `Club-UAA-Campanas-v1.0.0.exe`
- Size: ~169 MB (includes Electron runtime + dependencies)

### 🔄 Next Version (v1.1.0 — Planned)
- [ ] Built-in logging to file
- [ ] Error notifications in UI
- [ ] Campaign history/results viewer
- [ ] Better error handling for SQL Server connection failures

### 🔄 Future (v2.0.0 — Roadmap)
- [ ] Auto-update mechanism
- [ ] electron-updater integration
- [ ] NSIS installer generation (without code signing)
- [ ] WhatsApp integration via Meta API
- [ ] Email integration via SendGrid
- [ ] Campaign result tracking and ROI calculations

---

**Installation Support:** Contact IT for SQL Server connection details.
**Bug Reports:** Open an issue on GitHub.
