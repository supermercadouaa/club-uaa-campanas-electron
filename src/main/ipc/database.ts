import { ipcMain } from 'electron';
import { saveCredentials, loadCredentials, credentialsExist, SqlCredentials } from '../lib/credentials';
import { initConnection, query, execute, closeConnection, isConnected } from '../lib/sql';
import * as bcrypt from 'bcryptjs';

export function setupDatabaseHandlers() {
  // Verificar si existen credenciales guardadas
  ipcMain.handle('db:credentials-exist', () => {
    return credentialsExist();
  });

  // Guardar credenciales SQL
  ipcMain.handle('db:save-credentials', async (event, credentials: SqlCredentials) => {
    try {
      const saved = saveCredentials(credentials);
      if (saved) {
        // Intentar conectar con las nuevas credenciales
        const connected = await initConnection();
        return { success: true, connected };
      }
      return { success: false, error: 'Failed to save credentials' };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  // Probar conexión a SQL Server
  ipcMain.handle('db:test-connection', async (event, credentials: SqlCredentials) => {
    try {
      saveCredentials(credentials);
      const connected = await initConnection();
      return { success: connected, message: connected ? 'Connected successfully' : 'Connection failed' };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  });

  // Inicializar conexión (al arrancar la app)
  ipcMain.handle('db:init', async () => {
    try {
      const connected = await initConnection();
      return { success: connected };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  // Validar login contra tabla usuarios
  ipcMain.handle('db:auth-login', async (event, email: string, password: string) => {
    try {
      console.log('db:auth-login called with email:', email);

      if (!isConnected()) {
        console.log('Not connected, attempting to connect');
        const connected = await initConnection();
        if (!connected) {
          return { success: false, error: 'Database not connected' };
        }
      }

      console.log('About to query super_usuarios');
      const users = await query<any>(
        'SELECT id, email, password_hash, nombre, is_temporary FROM mssql_web.dbo.super_usuarios WHERE email = @param1',
        [email]
      );

      console.log('Query result:', users);

      if (users.length === 0) {
        console.log('User not found');
        return { success: false, error: 'Email not found' };
      }

      const user = users[0];
      console.log('User found:', { email: user.email, hash_length: user.password_hash?.length });

      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      console.log('Password match:', passwordMatch);

      if (!passwordMatch) {
        console.log('Password does not match');
        return { success: false, error: 'Invalid password' };
      }

      console.log('Login successful for:', email);
      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          nombre: user.nombre,
          isTemporary: Boolean(user.is_temporary),
        },
      };
    } catch (error) {
      console.error('db:auth-login error:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // Cambiar contraseña (primera vez)
  ipcMain.handle('db:change-password', async (event, email: string, newPassword: string) => {
    try {
      if (!isConnected()) {
        const connected = await initConnection();
        if (!connected) {
          return { success: false, error: 'Database not connected' };
        }
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const rowsAffected = await execute(
        'UPDATE mssql_web.dbo.super_usuarios SET password_hash = @param1, is_temporary = 0, updated_at = GETDATE() WHERE email = @param2',
        [hashedPassword, email]
      );

      return { success: rowsAffected > 0 };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  // Desconectar
  ipcMain.handle('db:close', () => {
    closeConnection();
    return { success: true };
  });

  // Crear campaña
  ipcMain.handle('db:create-campaign', async (event, campaignData: any) => {
    try {
      if (!isConnected()) {
        const connected = await initConnection();
        if (!connected) {
          return { success: false, error: 'Database not connected' };
        }
      }

      const { nombre, plantilla_meta, id_usuario, creado_por, total_contactos, envios } = campaignData;

      console.log('Creating campaign:', { nombre, plantilla_meta, id_usuario, total_contactos });

      // Insert en super_campanias
      const campaignInsert = `
        INSERT INTO mssql_web.dbo.super_campanias (id_usuario, nombre, plantilla_meta, total_contactos, estado, created_at)
        VALUES (@param1, @param2, @param3, @param4, 'pending', GETDATE());
      `;

      await execute(campaignInsert, [id_usuario, nombre, plantilla_meta, total_contactos]);

      // Get the last inserted ID
      const idQuery = `SELECT @@IDENTITY as id;`;
      const idRows = await query<any>(idQuery, []);
      const campaign_id = idRows[0]?.id;

      if (!campaign_id) {
        return { success: false, error: 'Failed to get campaign ID' };
      }

      console.log('Campaign created with ID:', campaign_id);

      // Insert en super_campanias_envios (una fila por contacto)
      for (const envio of envios) {
        const envioInsert = `
          INSERT INTO mssql_web.dbo.super_campanias_envios
          (id_campania, id_cliente, nombre, telefono, prod_1, precio_1, oferta_1, prod_2, precio_2, oferta_2, prod_3, precio_3, oferta_3, link_catalogo, status, creado_por, created_at)
          VALUES (@param1, @param2, @param3, @param4, @param5, @param6, @param7, @param8, @param9, @param10, @param11, @param12, @param13, @param14, 'pending', @param15, GETDATE());
        `;

        const params = [
          campaign_id,
          envio.id_cliente || null,
          envio.nombre || null,
          envio.telefono || null,
          envio.prod_1 || null,
          envio.precio_1 || null,
          envio.oferta_1 || null,
          envio.prod_2 || null,
          envio.precio_2 || null,
          envio.oferta_2 || null,
          envio.prod_3 || null,
          envio.precio_3 || null,
          envio.oferta_3 || null,
          envio.link_catalogo || null,
          creado_por || id_usuario
        ];

        await execute(envioInsert, params);
      }

      console.log(`Campaign envios created: ${envios.length} rows`);

      return {
        success: true,
        campaign_id,
        envios_created: envios.length
      };
    } catch (error) {
      console.error('db:create-campaign error:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // Obtener campañas del usuario
  ipcMain.handle('db:get-campaigns', async (event, { id_usuario }: { id_usuario: string }) => {
    try {
      if (!isConnected()) {
        const connected = await initConnection();
        if (!connected) {
          return { success: false, error: 'Database not connected' };
        }
      }

      const campaigns = await query<any>(
        `SELECT id, id_usuario, nombre, plantilla_meta, total_contactos, estado, created_at as fecha_creacion
         FROM mssql_web.dbo.super_campanias
         WHERE id_usuario = @param1
         ORDER BY created_at DESC`,
        [id_usuario]
      );

      return {
        success: true,
        campaigns: campaigns || []
      };
    } catch (error) {
      console.error('db:get-campaigns error:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // Obtener detalle de una campaña + sus envíos
  ipcMain.handle('db:get-campaign-detail', async (event, { id_campania }: { id_campania: number | string }) => {
    try {
      if (!isConnected()) {
        const connected = await initConnection();
        if (!connected) {
          return { success: false, error: 'Database not connected' };
        }
      }

      const campaignRows = await query<any>(
        `SELECT id, id_usuario, nombre, plantilla_meta, total_contactos, estado, created_at as fecha_creacion
         FROM mssql_web.dbo.super_campanias
         WHERE id = @param1`,
        [id_campania]
      );

      if (campaignRows.length === 0) {
        return { success: false, error: 'Campaign not found' };
      }

      const envios = await query<any>(
        `SELECT id, id_cliente, nombre, telefono, prod_1, precio_1, oferta_1, prod_2, precio_2, oferta_2, prod_3, precio_3, oferta_3, status
         FROM mssql_web.dbo.super_campanias_envios
         WHERE id_campania = @param1
         ORDER BY id ASC`,
        [id_campania]
      );

      return {
        success: true,
        campaign: campaignRows[0],
        envios: envios || []
      };
    } catch (error) {
      console.error('db:get-campaign-detail error:', error);
      return { success: false, error: (error as Error).message };
    }
  });
}
