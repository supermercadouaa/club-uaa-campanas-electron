import * as fs from 'fs';
import * as path from 'path';

export interface Template {
  num_id: number;
  id: string;
  plantilla_meta: string;
  name: string;
  subtitle: string;
  icon: string;
  body: string;
  variables: string[];
  activo: boolean;
}

export interface TemplateInput {
  id?: string;
  plantilla_meta?: string;
  name: string;
  subtitle?: string;
  icon?: string;
  body: string;
  variables: string[];
  activo?: boolean;
}

interface DbFile {
  nextId: number;
  plantillas: Template[];
}

const SEED: Template = {
  num_id: 1,
  id: 'ofertas_3',
  plantilla_meta: 'super_ofertas',
  name: 'Ofertas Quincenales',
  subtitle: '3 Destacados',
  icon: '🎁',
  body: 'Hola {{nombre}},\n\n¡No te pierdas nuestras SUPER OFERTAS! Aprovechá nuestras ofertas destacadas:\n\n{{prod_1}}: {{precio_1}} → {{oferta_1}}\n{{prod_2}}: {{precio_2}} → {{oferta_2}}\n{{prod_3}}: {{precio_3}} → {{oferta_3}}\n\nVer el catálogo completo de ofertas: {{link_catalogo}}\n\n¡Hasta pronto!\nEquipo Club UAA',
  variables: ['prod_1', 'precio_1', 'oferta_1', 'prod_2', 'precio_2', 'oferta_2', 'prod_3', 'precio_3', 'oferta_3', 'link_catalogo'],
  activo: true,
};

let dbPath: string | null = null;
let db: DbFile | null = null;

function readFile(): DbFile {
  if (!dbPath) return { nextId: 1, plantillas: [] };
  try {
    return JSON.parse(fs.readFileSync(dbPath, 'utf8')) as DbFile;
  } catch {
    return { nextId: 1, plantillas: [] };
  }
}

function writeFile(data: DbFile): void {
  if (!dbPath) return;
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

export function openTemplatesDb(p: string): { success: boolean; error?: string } {
  try {
    dbPath = p;
    const dir = path.dirname(p);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    if (!fs.existsSync(p)) {
      const initial: DbFile = { nextId: 2, plantillas: [SEED] };
      writeFile(initial);
      console.log('[templates-json] Created new DB with seed at', p);
    }

    db = readFile();
    console.log(`[templates-json] Opened at ${p}, ${db.plantillas.length} plantillas`);
    return { success: true };
  } catch (err) {
    console.error('[templates-json] Error opening:', err);
    return { success: false, error: (err as Error).message };
  }
}

export function getTemplates(): Template[] {
  if (!db) db = readFile();
  return db.plantillas.filter(t => t.activo);
}

export function getAllTemplates(): Template[] {
  if (!db) db = readFile();
  return [...db.plantillas];
}

export function createTemplate(input: TemplateInput): { success: boolean; error?: string } {
  try {
    db = readFile();
    const id = input.id || slugify(input.name);
    if (db.plantillas.find(t => t.id === id)) {
      return { success: false, error: 'Ya existe una plantilla con ese ID' };
    }
    const newT: Template = {
      num_id: db.nextId++,
      id,
      plantilla_meta: input.plantilla_meta || '',
      name: input.name,
      subtitle: input.subtitle || '',
      icon: input.icon || '🎁',
      body: input.body,
      variables: input.variables,
      activo: input.activo !== false,
    };
    db.plantillas.push(newT);
    writeFile(db);
    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export function updateTemplate(id: string, input: Partial<TemplateInput>): { success: boolean; error?: string } {
  try {
    db = readFile();
    const idx = db.plantillas.findIndex(t => t.id === id);
    if (idx === -1) return { success: false, error: 'Plantilla no encontrada' };
    db.plantillas[idx] = {
      ...db.plantillas[idx],
      ...(input.name !== undefined && { name: input.name }),
      ...(input.plantilla_meta !== undefined && { plantilla_meta: input.plantilla_meta }),
      ...(input.subtitle !== undefined && { subtitle: input.subtitle }),
      ...(input.icon !== undefined && { icon: input.icon }),
      ...(input.body !== undefined && { body: input.body }),
      ...(input.variables !== undefined && { variables: input.variables }),
    };
    writeFile(db);
    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export function deleteTemplate(id: string): { success: boolean; error?: string } {
  try {
    db = readFile();
    const before = db.plantillas.length;
    db.plantillas = db.plantillas.filter(t => t.id !== id);
    if (db.plantillas.length === before) return { success: false, error: 'No encontrada' };
    writeFile(db);
    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export function closeTemplatesDb(): void {
  db = null;
  dbPath = null;
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 40)
    || `tpl_${Date.now()}`;
}
