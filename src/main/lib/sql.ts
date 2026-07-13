import { Connection, Request, ConnectionConfig, TYPES } from 'tedious';
import { loadCredentials, SqlCredentials } from './credentials';

let sqlConnection: Connection | null = null;
let isConnecting = false;

function createConnectionConfig(creds: SqlCredentials): ConnectionConfig {
  return {
    server: creds.host,
    port: creds.port,
    database: creds.database,
    authentication: {
      type: 'default',
      options: {
        userName: creds.username,
        password: creds.password,
      },
    },
    options: {
      trustServerCertificate: true,
      encrypt: true,
      connectTimeout: 15000,
    },
  };
}

export async function initConnection(): Promise<boolean> {
  return new Promise((resolve) => {
    console.log('initConnection called. Current state:', sqlConnection?.state);

    if (sqlConnection && sqlConnection.state?.name === 'LoggedIn') {
      console.log('Already connected');
      resolve(true);
      return;
    }

    if (isConnecting) {
      console.log('Already connecting');
      resolve(false);
      return;
    }

    const creds = loadCredentials();
    if (!creds) {
      console.warn('SQL credentials not found');
      resolve(false);
      return;
    }

    console.log('Creating new connection to:', creds.host, creds.port, creds.database);
    isConnecting = true;
    const config = createConnectionConfig(creds);
    sqlConnection = new Connection(config);

    sqlConnection.on('connect', () => {
      console.log('Connected to SQL Server');
      isConnecting = false;
      resolve(true);
    });

    sqlConnection.on('error', (err) => {
      console.error('Connection error:', err);
      isConnecting = false;
      sqlConnection = null;
      resolve(false);
    });

    sqlConnection.connect();
  });
}

export async function query<T>(sql: string, params: any[] = []): Promise<T[]> {
  return new Promise((resolve, reject) => {
    if (!sqlConnection || sqlConnection.state?.name !== 'LoggedIn') {
      reject(new Error('Not connected to database'));
      return;
    }

    const results: T[] = [];
    const request = new Request(sql, (err, rowCount) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });

    // Agregar parámetros si existen
    params.forEach((param, index) => {
      request.addParameter(`param${index + 1}`, TYPES.NVarChar, param === null ? null : String(param));
    });

    request.on('row', (columns: any) => {
      const row: any = {};
      columns.forEach((col: any) => {
        row[col.metadata.colName] = col.value;
      });
      results.push(row);
    });

    sqlConnection.execSql(request);
  });
}

export async function execute(sql: string, params: any[] = []): Promise<number> {
  return new Promise((resolve, reject) => {
    if (!sqlConnection || sqlConnection.state?.name !== 'LoggedIn') {
      reject(new Error('Not connected to database'));
      return;
    }

    const request = new Request(sql, (err, rowCount) => {
      if (err) {
        reject(err);
      } else {
        resolve(rowCount || 0);
      }
    });

    params.forEach((param, index) => {
      request.addParameter(`param${index + 1}`, TYPES.NVarChar, param === null ? null : String(param));
    });

    sqlConnection.execSql(request);
  });
}

export function closeConnection(): void {
  if (sqlConnection) {
    sqlConnection.close();
    sqlConnection = null;
  }
}

export function isConnected(): boolean {
  const connected = sqlConnection !== null && sqlConnection.state?.name === 'LoggedIn';
  console.log('isConnected check:', { sqlConnection_exists: sqlConnection !== null, state: sqlConnection?.state?.name, result: connected });
  return connected;
}
