declare module 'bcryptjs' {
  export function hash(data: string, saltOrRounds: number): Promise<string>;
  export function compare(data: string, encrypted: string): Promise<boolean>;
}

declare module 'tedious' {
  export class Connection {
    constructor(config: ConnectionConfig);
    on(event: string, callback: (...args: any[]) => void): void;
    connect(): void;
    close(): void;
    execSql(request: Request): void;
    state: any;
  }

  export class Request {
    constructor(sql: string, callback: (err: any, rowCount: any) => void);
    addParameter(name: string, type: any, value: any): void;
    on(event: string, callback: (...args: any[]) => void): void;
  }

  export const TYPES: {
    NVarChar: any;
    Int: any;
    BigInt: any;
    Bit: any;
  };

  export interface ConnectionConfig {
    server: string;
    port: number;
    database: string;
    authentication: {
      type: string;
      options: {
        userName: string;
        password: string;
      };
    };
    options: {
      trustServerCertificate: boolean;
      encrypt: boolean;
      connectTimeout: number;
    };
  }
}
