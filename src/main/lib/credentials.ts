import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { app } from 'electron';

export interface SqlCredentials {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

const CREDENTIALS_DIR = path.join(app.getPath('userData'), 'Club-UAA-Campanas');
const CREDENTIALS_FILE = path.join(CREDENTIALS_DIR, 'sql-credentials.enc');

function getEncryptionKey(): Buffer {
  // Usar DPAPI equivalente en Node.js - combinamos máquina + usuario
  // En producción, esto se derivaría de credenciales Windows
  // Para esta versión, usamos una clave estable por máquina
  const machineId = crypto.createHash('sha256').update(process.env.USERNAME || 'default').digest();
  return machineId;
}

export function saveCredentials(credentials: SqlCredentials): boolean {
  try {
    if (!fs.existsSync(CREDENTIALS_DIR)) {
      fs.mkdirSync(CREDENTIALS_DIR, { recursive: true });
    }

    const json = JSON.stringify(credentials);
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

    let encrypted = cipher.update(json, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Guardar IV + datos encriptados
    const data = iv.toString('hex') + ':' + encrypted;
    fs.writeFileSync(CREDENTIALS_FILE, data);

    return true;
  } catch (error) {
    console.error('Error saving credentials:', error);
    return false;
  }
}

export function loadCredentials(): SqlCredentials | null {
  try {
    if (!fs.existsSync(CREDENTIALS_FILE)) {
      return null;
    }

    const data = fs.readFileSync(CREDENTIALS_FILE, 'utf8');
    const [ivHex, encrypted] = data.split(':');

    const key = getEncryptionKey();
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Error loading credentials:', error);
    return null;
  }
}

export function clearCredentials(): boolean {
  try {
    if (fs.existsSync(CREDENTIALS_FILE)) {
      fs.unlinkSync(CREDENTIALS_FILE);
    }
    return true;
  } catch (error) {
    console.error('Error clearing credentials:', error);
    return false;
  }
}

export function credentialsExist(): boolean {
  return fs.existsSync(CREDENTIALS_FILE);
}
