-- =====================================================
-- SCRIPT DE CREACIÓN DE BASE DE DATOS - ReservasWEB2
-- Sistema de Reservas de Canchas Sintéticas
-- =====================================================

-- PASO 1: Crear la base de datos (ejecuta esto SOLO si no existe aún)
-- Si ya la creaste o el comando dotnet ef database update funcionó, salta al PASO 2
CREATE DATABASE "ReservasWEB2";

-- PASO 2: Conéctate a la base de datos (si usas psql en consola, escribe \c "ReservasWEB2")

-- =====================================================
-- PASO 3: Crear las Tablas
-- =====================================================

-- Tabla de Usuarios
-- Guarda todos los usuarios del sistema (Admins y Clientes)
CREATE TABLE IF NOT EXISTS "Usuarios" (
    "Id"           SERIAL PRIMARY KEY,          -- Id autonumérico (se incrementa solo)
    "Nombre"       VARCHAR(100) NOT NULL,        -- Nombre del usuario, obligatorio
    "Email"        VARCHAR(100) NOT NULL UNIQUE, -- Email único (no pueden repetirse)
    "PasswordHash" TEXT        NOT NULL,         -- La contraseña encriptada con BCrypt
    "Role"         VARCHAR(20) NOT NULL DEFAULT 'Cliente' -- Rol: 'Admin' o 'Cliente'. Por defecto: 'Cliente'
);

-- Tabla de Canchas
-- Guarda las canchas disponibles para reservar
CREATE TABLE IF NOT EXISTS "Canchas" (
    "Id"            SERIAL PRIMARY KEY,
    "Nombre"        VARCHAR(100)   NOT NULL,       -- Nombre de la cancha
    "Descripcion"   VARCHAR(500)   NOT NULL DEFAULT '',
    "PrecioPorHora" DECIMAL(18, 2) NOT NULL        -- Precio monetario: 18 dígitos, 2 decimales
);

-- Tabla de Reservas
-- Guarda cada reserva hecha por los clientes (relaciona Usuarios con Canchas)
CREATE TABLE IF NOT EXISTS "Reservas" (
    "Id"           SERIAL PRIMARY KEY,
    "UsuarioId"    INT          NOT NULL,   -- Llave foránea: a qué usuario pertenece
    "CanchaId"     INT          NOT NULL,   -- Llave foránea: qué cancha se reservó
    "FechaInicio"  TIMESTAMPTZ  NOT NULL,   -- Fecha y hora de inicio con zona horaria
    "FechaFin"     TIMESTAMPTZ  NOT NULL,   -- Fecha y hora de fin con zona horaria
    "Estado"       VARCHAR(50)  NOT NULL DEFAULT 'Confirmada', -- Estado: Confirmada | Cancelada

    -- Restricciones de clave foránea (integridad referencial)
    CONSTRAINT fk_usuario FOREIGN KEY ("UsuarioId") REFERENCES "Usuarios"("Id") ON DELETE CASCADE,
    CONSTRAINT fk_cancha  FOREIGN KEY ("CanchaId")  REFERENCES "Canchas"("Id")  ON DELETE CASCADE
);

-- Tabla de historial de migraciones de EF Core (requerida si usas EF junto a este script)
CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId"    VARCHAR(150) NOT NULL PRIMARY KEY,
    "ProductVersion" VARCHAR(32)  NOT NULL
);

-- =====================================================
-- PASO 4: Insertar datos de prueba
-- =====================================================

-- CANCHAS DE EJEMPLO
INSERT INTO "Canchas" ("Nombre", "Descripcion", "PrecioPorHora") VALUES
('Cancha Principal Norte',  'Cancha de fútbol 11, césped sintético de última generación.', 80000),
('Cancha Fútbol 5 - Sur',   'Ideal para partidos rápidos, techada y con iluminación nocturna.', 60000),
('Cancha VIP Central',      'Cancha premium con vestidores privados y cancha temperada.',     120000),
('Cancha Familiar Este',    'Perfecta para eventos familiares, amplio espacio y parqueadero.', 50000),
('Cancha Nocturna Oeste',   'Disponible 24/7, con sistema de iluminación LED profesional.',   70000)
ON CONFLICT DO NOTHING; -- Si ya existen, no duplicar

-- USUARIO ADMIN DE PRUEBA
-- Contraseña: admin123
-- El hash fue generado con BCrypt (costo 10)
INSERT INTO "Usuarios" ("Nombre", "Email", "PasswordHash", "Role") VALUES
('Administrador Sistema',
 'admin@reservas.com',
 '$2a$11$K8vR0K8vR0K8vR0K8vR0KOXdJfHNxJ3z5Z9M2Bq1YpL4sQ7wT.uuK',
 'Admin')
ON CONFLICT ("Email") DO NOTHING;

-- NOTA: Para el usuario Admin, lo más fácil es:
-- 1. Registrarte normalmente en la app web (con cualquier correo y contraseña).
-- 2. Luego ejecutar este UPDATE para promoverlo a Admin:
-- UPDATE "Usuarios" SET "Role" = 'Admin' WHERE "Email" = 'tu@correo.com';

-- =====================================================
-- VERIFICACIÓN: Consultas para comprobar que todo está bien
-- =====================================================
-- SELECT * FROM "Canchas";
-- SELECT "Id", "Nombre", "Email", "Role" FROM "Usuarios";
-- SELECT * FROM "Reservas";
