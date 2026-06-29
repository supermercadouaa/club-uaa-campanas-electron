import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { setupDatabaseHandlers } from './ipc/database';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  const iconPath = path.join(__dirname, '../renderer/favicon.png');
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1000,
    minHeight: 600,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: true,
    },
  });

  const startUrl = `file://${path.join(__dirname, '../renderer/index.html')}`;
  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  setupDatabaseHandlers();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC Handlers (Phase 2+)
ipcMain.handle('campaign:create', async (event, data) => {
  // To be implemented in Phase 3
  return { success: true };
});
