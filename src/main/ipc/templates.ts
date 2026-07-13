import { ipcMain } from 'electron';
import { getTemplatesDbPath, setTemplatesDbPath } from '../lib/config';
import { openTemplatesDb, getTemplates } from '../lib/templates-db';

export function setupTemplateHandlers(): void {
  ipcMain.handle('templates:get-path', () => {
    return getTemplatesDbPath();
  });

  ipcMain.handle('templates:set-path', (_event, newPath: string) => {
    try {
      setTemplatesDbPath(newPath);
      const result = openTemplatesDb(newPath);
      return result;
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

  ipcMain.handle('templates:get', () => {
    return getTemplates();
  });
}
