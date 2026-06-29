import { FIELD_ALIASES } from './constants';

export interface ParsedData {
  rawData: Record<string, string>[];
  columns: string[];
  data: Array<Record<string, string> & { nombre: string; telefono: string }>;
}

export function detectAlias(fieldAliases: string[], cols: string[]): string {
  const colsLower = cols.map(c => c.toLowerCase().trim());
  for (const alias of fieldAliases) {
    const idx = colsLower.findIndex(c => c === alias || c.includes(alias));
    if (idx !== -1) return cols[idx];
  }
  return '';
}

export function parseCSV(text: string): { rawData: Record<string, string>[]; columns: string[] } {
  text = text.replace(/^[﻿﻿]/, '').replace(/^ï»¿/, '');
  const lines = text.split('\n').filter(l => l.trim());
  if (!lines.length) return { rawData: [], columns: [] };

  const firstLine = lines[0];
  const sep = firstLine.split(';').length > firstLine.split(',').length ? ';' : ',';
  const headers = firstLine.split(sep).map(h => h.trim().replace(/^"|"$/g, ''));

  const rows = lines.slice(1).map(line => {
    const vals = line.split(sep).map(v => v.trim().replace(/^"|"$/g, ''));
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = vals[i] || '';
    });
    return obj;
  }).filter(r => Object.values(r).some(v => v));

  return { rawData: rows, columns: headers };
}

export async function parseXLSX(buffer: ArrayBuffer): Promise<{ rawData: Record<string, string>[]; columns: string[] }> {
  const XLSX = (window as any).XLSX;
  const wb = XLSX.read(buffer, { type: 'array' });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const json = XLSX.utils.sheet_to_json(ws, { defval: '' });
  const columns = Object.keys(json[0] || {});
  return { rawData: json, columns };
}

export function processData(
  rawData: Record<string, string>[],
  columns: string[]
): Array<Record<string, string> & { nombre: string; telefono: string }> {
  const telCol = detectAlias(FIELD_ALIASES.telefono, columns);
  const nomCol = detectAlias(FIELD_ALIASES.nombre, columns);

  return rawData
    .filter(r => r[telCol] && r[nomCol])
    .map(row => ({
      nombre: row[nomCol] || '',
      telefono: row[telCol] || '',
      ...row
    }));
}
