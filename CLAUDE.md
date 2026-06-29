# Club UAA Campañas - Electron App

## 📋 Estado Actual del Proyecto (2026-06-29)

### ✅ Completado
- **Arquitectura Electron**: Main process + Renderer process con context isolation
- **Base de datos SQL Server**: Tedious driver, conexión con Tedious
- **Autenticación**: Login con email/password contra tabla `super_usuarios`
- **Seguridad**: DPAPI encryption para credenciales SQL en %APPDATA%
- **Contraseñas**: bcryptjs para hashing, cambio obligatorio en primer login
- **Interfaz 5-pasos**: 
  1. Cargar datos (CSV/Excel con autodetección de columnas)
  2. Diseñar (seleccionar plantilla, agregar variables)
  3. Preview (visualizar mensaje con datos reales)
  4. Envío (crear campaña en BD)
- **Campaña workflow**: Crear tabla `super_campanias_envios` con 1 fila por contacto
- **Variables dinámicas**: Productos, precios (como VARCHAR para preservar formato $), ofertas
- **Paste-from-table**: Modal para copiar/pegar datos desde Excel
- **Modal global**: Overlay para editar credenciales sin cerrar sesión
- **Control de versiones**: Git + GitHub (https://github.com/supermercadouaa/club-uaa-campanas-electron)

### 🔧 Tech Stack
- **Frontend**: Vanilla HTML/CSS/JS (no React)
- **Desktop**: Electron 28+
- **Backend**: Node.js TypeScript
- **DB**: SQL Server (Tedious driver)
- **Build**: Vite + electron-builder
- **Password**: bcryptjs v2.4.3
- **CSV**: Built-in + xlsx library

### 📊 Base de Datos
```
Tablas en mssql_web.dbo:
- super_usuarios (id, email, password_hash, nombre, is_temporary)
- super_campanias (id_usuario, nombre, plantilla_meta, total_contactos, estado)
- super_campanias_envios (id_campania, nombre, telefono, prod_1-3, precio_1-3, oferta_1-3, link_catalogo, status)
```

### 🐛 Bugs Resueltos (Historial)
1. **Tedious state checking**: `.state === 1` → `.state?.name === 'LoggedIn'`
2. **@@IDENTITY en parámetros**: Separar INSERT y SELECT en dos queries
3. **Precios como DECIMAL**: Reverter a VARCHAR strings (IT requirement para formato $)
4. **Modal overlay**: Crear config-modal-global con z-index 3000 para no cerrar sesión
5. **ID config-section**: Cambiar referencias a config-section-login

### 📁 Estructura de Carpetas
```
src/
  main/
    ipc/database.ts       (8 handlers: login, credentials, campaign creation)
    lib/credentials.ts    (DPAPI encrypt/decrypt)
    lib/sql.ts            (Tedious connection, query/execute)
    main.ts               (Electron window, setupDatabaseHandlers)
    preload.ts            (Context bridge IPC)
    types.d.ts            (Tedious types)
  renderer/
    index.html            (5-step workflow UI, login, modals)
    (+ React files - legacy, no se usan)
```

### 🚀 Próximos Pasos
- [ ] Compilar .exe para distribución
- [ ] Testear con usuarios (2 analistas marketing)
- [ ] Auto-updater con electron-updater (v2.0.0)
- [ ] Mejorar UX según feedback de usuarios
- [ ] Agregar logging/analytics

---

## 🔄 Metodología de Trabajo y Distribución

### Rama Strategy (Simplificada)
```
main (estable)   → Versiones distribuidas a usuarios
  ↑
dev (desarrollo) → Tu rama diaria, solo tú trabaja aquí
```

**NO hay feature branches** (por ahora, app es pequeña):
- Todo va directo a `dev`
- Solo mergea a `main` cuando está listo para distribuir

### Commits en Dev
```bash
git checkout dev
git add .
git commit -m "tipo: descripción"
git push origin dev

Tipos: feat, fix, refactor, style, docs
```

### Distribución a Usuarios

#### **Release v1.0.0** (Primera distribución)
```bash
# 1. Preparar main con versión estable
git checkout main
git merge dev
git tag -a v1.0.0 -m "Release v1.0.0 - Initial release"
git push origin main --tags

# 2. Compilar .exe
npm run build
# Genera: out/Club-UAA-Campanas.exe

# 3. Distribuir
# Opción A: Email directo
# Opción B: GitHub Releases (https://github.com/supermercadouaa/club-uaa-campanas-electron/releases)
```

**Usuarios:** Descargan `.exe`, lo instalan, listo. No necesitan git.

#### **Updates (v1.0.1, v1.1.0, etc.)**
```bash
# Mientras usuarios usan v1.0.0, tú en dev
git checkout dev
# Desarrollás features/fixes
git commit -m "fix: algo importante"
git push origin dev

# Cuando listo para distribuir:
git checkout main
git merge dev
git tag -a v1.0.1 -m "Release v1.0.1 - Bugfixes"
git push origin main --tags

npm run build
# Distribuís nuevo .exe
```

### Versionamiento
- **v1.0.0** → Mayor.Menor.Patch
- **v1.0.0** = Primera release
- **v1.0.1** = Bugfix
- **v1.1.0** = Nueva feature
- **v2.0.0** = Breaking changes (raro)

### Usuarios vs Dev
| Quién | Rama | Cómo accede | Updates |
|-------|------|------------|---------|
| 2 Analistas Marketing | main | .exe descargado | Manual: nuevo .exe |
| Tú (dev) | dev | `npm run dev` | `git pull origin dev` |

### Para Próximas Sesiones (Automático)
- Considerar `electron-updater` cuando distribuyas a 5+ usuarios
- Crear CHANGELOG.md con cada release
- Automatizar GitHub Releases con GitHub Actions (futuro)

---

## 🛠️ Comandos Útiles

```bash
# Desarrollo diario
npm run dev              # Levanta app en modo desarrollo
npm run build            # Compila .exe para distribución
npm run start            # Ejecuta .exe compilado localmente

# Git
git checkout dev         # Switch a rama dev
git checkout main        # Switch a rama main
git merge dev            # Mergea dev a main (cuando estés en main)
git tag -a v1.0.0 ...   # Crea version tag
git push origin main --tags  # Push con tags

# Conectado a GitHub
git pull origin dev      # Traé cambios de GitHub
git push origin dev      # Enviá cambios a GitHub
```

---

## 📝 Notas Importantes

- **No hay .env.production/.env.development**: dev y main apuntan a la MISMA BD SQL por ahora
- **Credenciales encriptadas**: Los usuarios guardan sus credenciales en la app (DPAPI), no en .env
- **node_modules y dist/**: En .gitignore, no se versionan
- **Email domain**: @uaa.com.ar hardcodeado en UI (interno)
- **Precios como strings**: Ej. "$2.890,88" se almacenan como VARCHAR en BD

