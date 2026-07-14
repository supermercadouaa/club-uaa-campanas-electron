import { ipcMain } from 'electron';
import { getTemplatesDbPath, setTemplatesDbPath } from '../lib/config';
import {
  openTemplatesDb, getTemplates, getAllTemplates,
  createTemplate, updateTemplate, deleteTemplate,
  TemplateInput,
} from '../lib/templates-json';

export function setupTemplateHandlers(): void {
  ipcMain.handle('templates:get-path', () => getTemplatesDbPath());

  ipcMain.handle('templates:set-path', (_event, newPath: string) => {
    try {
      setTemplatesDbPath(newPath);
      return openTemplatesDb(newPath);
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

  ipcMain.handle('templates:get', () => getTemplates());
  ipcMain.handle('templates:get-all', () => getAllTemplates());
  ipcMain.handle('templates:create', (_event, input: TemplateInput) => createTemplate(input));
  ipcMain.handle('templates:update', (_event, id: string, input: Partial<TemplateInput>) => updateTemplate(id, input));
  ipcMain.handle('templates:delete', (_event, id: string) => deleteTemplate(id));
}
