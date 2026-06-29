-- ============================================================================
-- Script SQL Server para crear tablas de Campañas UAA
-- Fecha: 2026-06-24
-- Versión: Phase 2.A
-- ============================================================================

-- ============================================================================
-- 1. TABLA: usuarios
-- Descripción: Usuarios del sistema (2 inicialmente)
-- ============================================================================

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

-- Índice para búsqueda por email
CREATE UNIQUE INDEX idx_usuarios_email ON usuarios(email);

-- Insertar usuario de prueba
INSERT INTO usuarios (email, password_hash, nombre, is_temporary, activo)
VALUES ('jivillar@uaa.com.ar', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'Juan Ignacio Villar', 0, 1);

-- ============================================================================
-- 2. TABLA: campanas
-- Descripción: Definición de campañas
-- ============================================================================

CREATE TABLE campanas (
  id INT PRIMARY KEY IDENTITY(1,1),
  id_usuario INT NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  plantilla_meta VARCHAR(100),
  total_contactos INT,
  estado VARCHAR(50) DEFAULT 'draft',
  created_at DATETIME DEFAULT GETDATE(),
  started_at DATETIME NULL,
  completed_at DATETIME NULL,

  CONSTRAINT fk_campanas_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

-- Índices
CREATE INDEX idx_campanas_usuario ON campanas(id_usuario);
CREATE INDEX idx_campanas_estado ON campanas(estado);
CREATE INDEX idx_campanas_created ON campanas(created_at);

-- Insertar campaña de ejemplo
INSERT INTO campanas (id_usuario, nombre, plantilla_meta, total_contactos, estado)
VALUES (1, 'Oferta Quincena Junio', 'super_ofertas', 150, 'draft');

-- ============================================================================
-- 3. TABLA: campanas_envios
-- Descripción: Detalle de cada envío (uno por contacto)
-- ============================================================================

CREATE TABLE campanas_envios (
  id INT PRIMARY KEY IDENTITY(1,1),
  id_campaña INT NOT NULL,
  nombre VARCHAR(255),
  telefono VARCHAR(20),

  -- Variables de plantilla
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
  created_at DATETIME DEFAULT GETDATE(),

  CONSTRAINT fk_envios_campaña FOREIGN KEY (id_campaña) REFERENCES campanas(id)
);

-- Índices
CREATE INDEX idx_envios_campaña ON campanas_envios(id_campaña);
CREATE INDEX idx_envios_status ON campanas_envios(status);
CREATE INDEX idx_envios_telefono ON campanas_envios(telefono);
CREATE INDEX idx_envios_created ON campanas_envios(created_at);

-- Insertar registro de ejemplo
INSERT INTO campanas_envios (
  id_campaña, nombre, telefono,
  prod_1, precio_1, oferta_1,
  prod_2, precio_2, oferta_2,
  prod_3, precio_3, oferta_3,
  link_catalogo, status, creado_por
) VALUES (
  1, 'JUAN IGNACIO VILLAR', '3415707327',
  'CACAO CHOCOLINO FORTIF.PLUS 360g', '$2.890,88', '$2.399,00',
  'LECHE EN POLVO NIDO FORTI GROW LATA x 750g', '$12.040,70', '$9.999,00',
  'CALDO KNORR P/SABORIZAR VERDURAS x 4 SOBRES', '$1.347,56', '$1.099,00',
  'https://catalogo.uaa.com.ar/ofertas', 'pending', 'jivillar@uaa.com.ar'
);

-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================

-- Ver tablas creadas
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE';

-- Ver registros
SELECT 'Usuarios' as Tabla, COUNT(*) as Total FROM usuarios
UNION ALL
SELECT 'Campañas', COUNT(*) FROM campanas
UNION ALL
SELECT 'Envios', COUNT(*) FROM campanas_envios;

-- ============================================================================
-- NOTAS IMPORTANTES
-- ============================================================================
/*
Estados posibles:
- usuarios.is_temporary: 1 = cambiar pass en primer login, 0 = normal
- campanas.estado: 'draft' = sin enviar, 'sent' = enviando, 'completed' = finalizada
- campanas_envios.status: 'pending', 'sent', 'delivered', 'failed', 'read'

Password hash:
- El valor mostrado en el INSERT es placeholder
- Los hashes reales se generan desde la app usando bcrypt
- Contraseña temporal del usuario de prueba: "admin"

Conexión desde la app:
- Driver: tedious (Node.js)
- Encriptación de credenciales: crypto (Node.js)
- Las credenciales se guardarán en archivo local encriptado
*/
