import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { autoUpdater } from 'electron-updater';
import { setupDatabaseHandlers } from './ipc/database';
import { setupTemplateHandlers } from './ipc/templates';
import { getTemplatesDbPath } from './lib/config';
import { openTemplatesDb, closeTemplatesDb } from './lib/templates-db';

let mainWindow: BrowserWindow | null = null;

function setupAutoUpdater() {
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('checking-for-update', () => {
    console.log('[updater] Checking for update...');
    mainWindow?.webContents.send('update:status', 'checking');
  });

  autoUpdater.on('update-available', (info) => {
    console.log('[updater] Update available:', info.version);
    mainWindow?.webContents.send('update:available', info.version);
  });

  autoUpdater.on('update-not-available', (info) => {
    console.log('[updater] No update available. Current:', info.version);
    mainWindow?.webContents.send('update:status', 'up-to-date');
  });

  autoUpdater.on('update-downloaded', () => {
    console.log('[updater] Update downloaded, ready to install');
    mainWindow?.webContents.send('update:downloaded');
  });

  autoUpdater.on('error', (err) => {
    console.error('[updater] Error:', err.message);
    mainWindow?.webContents.send('update:status', `error: ${err.message}`);
  });

  const doCheck = () => {
    console.log('[updater] Triggering checkForUpdates...');
    autoUpdater.checkForUpdates().catch(err => {
      console.error('[updater] checkForUpdates failed:', err);
      mainWindow?.webContents.send('update:status', `error: ${err.message}`);
    });
  };

  // Check immediately on startup (renderer shows overlay), then every 4 hours
  doCheck();
  setInterval(doCheck, 4 * 60 * 60 * 1000);
}

function createWindow() {
  const iconPath = path.join(__dirname, '../renderer/favicon.ico');
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
  setupTemplateHandlers();
  openTemplatesDb(getTemplatesDbPath());
  createWindow();
  setupAutoUpdater();
});

app.on('before-quit', () => {
  closeTemplatesDb();
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

ipcMain.handle('update:install', () => {
  autoUpdater.quitAndInstall();
});

ipcMain.handle('app:version', () => app.getVersion());

// IPC Handlers (Phase 2+)
ipcMain.handle('campaign:create', async (event, data) => {
  // To be implemented in Phase 3
  return { success: true };
});
