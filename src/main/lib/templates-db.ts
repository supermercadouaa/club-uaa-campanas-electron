import * as fs from 'fs';
import * as path from 'path';
import Database from 'better-sqlite3';

export interface Template {
  id: string;
  plantilla_meta: string;
  name: string;
  subtitle: string;
  icon: string;
  body: string;
  variables: string[];
  activo: boolean;
}

interface SeedRow {
  id: string;
  plantilla_meta: string;
  name: string;
  subtitle: string;
  icon: string;
  body: string;
  variables: string; // JSON string for SQLite
  activo: number;
}

const SEED: SeedRow = {
  id: 'ofertas_3',
  plantilla_meta: 'super_ofertas',
  name: 'Ofertas Quincenales',
  subtitle: '3 Destacados',
  icon: '🎁',
  body: 'Hola {{nombre}},\n\n¡No te pierdas nuestras SUPER OFERTAS! Aprovechá nuestras ofertas destacadas:\n\n{{prod_1}}: {{precio_1}} → {{oferta_1}}\n{{prod_2}}: {{precio_2}} → {{oferta_2}}\n{{prod_3}}: {{precio_3}} → {{oferta_3}}\n\nVer el catálogo completo de ofertas: {{link_catálogo_personalizado}}\n\n¡Hasta pronto!\nEquipo Club UAA',
  variables: JSON.stringify(['prod_1','precio_1','oferta_1','prod_2','precio_2','oferta_2','prod_3','precio_3','oferta_3','link_catálogo_personalizado']),
  activo: 1,
};

let db: Database.Database | null = null;

export function openTemplatesDb(dbPath: string): { success: boolean; error?: string } {
  try {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    db = new Database(dbPath);

    db.exec(`
      CREATE TABLE IF NOT EXISTS plantillas (
        id          TEXT PRIMARY KEY,
        plantilla_meta TEXT,
        name        TEXT NOT NULL,
        subtitle    TEXT DEFAULT '',
        icon        TEXT DEFAULT '🎁',
        body        TEXT NOT NULL,
        variables   TEXT NOT NULL DEFAULT '[]',
        activo      INTEGER NOT NULL DEFAULT 1,
        created_at  TEXT DEFAULT (datetime('now')),
        updated_at  TEXT DEFAULT (datetime('now'))
      )
    `);

    // Seed si la tabla está vacía
    const { c } = db.prepare('SELECT COUNT(*) AS c FROM plantillas').get() as { c: number };
    if (c === 0) {
      db.prepare(`
        INSERT INTO plantillas (id, plantilla_meta, name, subtitle, icon, body, variables, activo)
        VALUES (@id, @plantilla_meta, @name, @subtitle, @icon, @body, @variables, @activo)
      `).run(SEED);
      console.log('[templates-db] Seeded initial template');
    }

    console.log(`[templates-db] Opened at ${dbPath}`);
    return { success: true };
  } catch (err) {
    console.error('[templates-db] Error opening:', err);
    return { success: false, error: (err as Error).message };
  }
}

export function getTemplates(): Template[] {
  if (!db) return [];
  const rows = db.prepare('SELECT * FROM plantillas WHERE activo = 1 ORDER BY created_at').all() as any[];
  return rows.map(r => ({
    ...r,
    variables: JSON.parse(r.variables || '[]'),
    activo: Boolean(r.activo),
  }));
}

export function closeTemplatesDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}
