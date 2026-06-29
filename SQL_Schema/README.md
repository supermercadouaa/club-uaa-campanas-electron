# Schema de Campañas UAA - Instrucciones para IT

## Descripción
Estructura SQL Server para el sistema de campañas WhatsApp de Club UAA.

---

## Instrucciones para crear las tablas

### 1. Crear tabla USUARIOS

```sql
CREATE TABLE usuarios (
  id INT PRIMARY KEY IDENTITY(1,1),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nombre VARCHAR(255),
  is_temporary BIT DEFAULT 1,
  activo BIT DEFAULT 1,
  created_at DATETIME DEFAULT GETDATE(),
  updated_at DATETIME DEFAULT GETDATE()
);

-- Insertar usuario de prueba (contraseña temporal: "admin")
INSERT INTO usuarios (email, password_hash, nombre, is_temporary, activo)
VALUES ('jivillar@uaa.com.ar', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'Juan Ignacio Villar', 0, 1);
```

**Notas:**
- `is_temporary = 1` → usuario debe cambiar contraseña en primer login
- `password_hash` debe ser bcrypt (se genera desde la app)
- El hash de ejemplo es placeholder; usar uno real

---

### 2. Crear tabla CAMPAÑAS

```sql
CREATE TABLE campanas (
  id INT PRIMARY KEY IDENTITY(1,1),
  id_usuario INT NOT NULL FOREIGN KEY REFERENCES usuarios(id),
  nombre VARCHAR(255) NOT NULL,
  plantilla_meta VARCHAR(100),
  total_contactos INT,
  estado VARCHAR(50) DEFAULT 'draft',
  created_at DATETIME DEFAULT GETDATE(),
  started_at DATETIME NULL,
  completed_at DATETIME NULL
);

-- Estados posibles: 'draft', 'sent', 'completed'
```

**Notas:**
- `id_usuario` → referencia al usuario que creó la campaña
- `plantilla_meta` → nombre de plantilla (ej: 'super_ofertas', '3_destacados')
- `estado` → 'draft' = sin enviar, 'sent' = enviando, 'completed' = finalizada

---

### 3. Crear tabla CAMPAÑAS_ENVIOS

```sql
CREATE TABLE campanas_envios (
  id INT PRIMARY KEY IDENTITY(1,1),
  id_campaña INT NOT NULL FOREIGN KEY REFERENCES campanas(id),
  nombre VARCHAR(255),
  telefono VARCHAR(20),
  
  -- Variables de plantilla (productos y precios)
  prod_1 VARCHAR(255),
  precio_1 VARCHAR(50),
  oferta_1 VARCHAR(50),
  prod_2 VARCHAR(255),
  precio_2 VARCHAR(50),
  oferta_2 VARCHAR(50),
  prod_3 VARCHAR(255),
  precio_3 VARCHAR(50),
  oferta_3 VARCHAR(50),
  link_catalogo VARCHAR(500),
  
  -- Status y tracking
  status VARCHAR(50) DEFAULT 'pending',
  fh_enviouaa DATETIME NULL,
  fh_enviometa DATETIME NULL,
  fh_delivered DATETIME NULL,
  fh_read DATETIME NULL,
  error_msg VARCHAR(500),
  
  -- Auditoría
  creado_por VARCHAR(255),
  created_at DATETIME DEFAULT GETDATE()
);

-- Estados posibles: 'pending', 'sent', 'delivered', 'failed', 'read'
```

**Notas:**
- Un registro por cada destinatario de la campaña
- `status` trackea estado: pending → sent → delivered → read
- `fh_enviouaa` → cuando la app envía el mensaje
- `fh_enviometa` → cuando Meta API confirma envío
- `error_msg` → si falla, el error (ej: "número inválido")

---

## Estructura de archivos CSV

- `01_usuarios.csv` → estructura de tabla usuarios
- `02_campanas.csv` → estructura de tabla campanas
- `03_campanas_envios.csv` → estructura de tabla campanas_envios

