import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';

const CONFIG_DIR = path.join(app.getPath('userData'), 'Club-UAA-Campanas');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

// Default: SharePoint-synced folder (OneDrive for Business)
const DEFAULT_TEMPLATES_DB = path.join(
  app.getPath('home'),
  'UAA',
  'Comercios y Servicios UAA - Documentos',
  '6 - Transformación Digital',
  'Herramientas Internas',
  'Campañas UAA',
  'plantillas.db'
);

interface AppConfig {
  templatesDbPath: string;
}

function readConfig(): AppConfig {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    }
  } catch {
    // ignore
  }
  return { templatesDbPath: DEFAULT_TEMPLATES_DB };
}

function writeConfig(config: AppConfig): void {
  if (!fs.existsSync(CONFIG_DIR)) fs.mkdirSync(CONFIG_DIR, { recursive: true });
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

export function getTemplatesDbPath(): string {
  return readConfig().templatesDbPath;
}

export function setTemplatesDbPath(newPath: string): void {
  const config = readConfig();
  config.templatesDbPath = newPath;
  writeConfig(config);
}
