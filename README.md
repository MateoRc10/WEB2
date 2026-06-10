# Sistema de Reservas de Canchas Sintéticas ⚽🏟️

Este proyecto es una aplicación **Full Stack** construida con la arquitectura integrada de **ASP.NET Core 8.0** y **Angular**. Sirve como entrega final para la asignatura de Programación Web 2.

## Descripción del Sistema

El sistema permite a los usuarios:
1. **Registrarse e Iniciar Sesión**: Autenticación segura mediante JWT y contraseñas encriptadas con BCrypt.
2. **Gestionar Canchas (Admin)**: Creación, actualización, listado y eliminación de canchas sintéticas.
3. **Buscar Canchas (Cliente)**: Visualización de canchas con paginación server-side y filtros de búsqueda por nombre.
4. **Hacer Reservas (Cliente)**: Los clientes pueden reservar canchas en un horario específico (se validan solapamientos) y cancelar sus propias reservas (Soft Delete).

---

## 🛠️ Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js (LTS)](https://nodejs.org/) (Necesario para Angular)
- [PostgreSQL](https://www.postgresql.org/download/)

---

## ⚙️ Variables de Entorno y Configuración

Toda la configuración principal se encuentra en el archivo `appsettings.json` (ubicado en la raíz del backend).

1. **Cadena de Conexión (Base de Datos)**
   El sistema está configurado para apuntar a un servidor PostgreSQL local. 
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Host=localhost;Port=5432;Database=ReservasDB;Username=postgres;Password=tu_contraseña_aqui"
   }
   ```
   **IMPORTANTE**: Debes asegurarte de que tu servidor PostgreSQL esté corriendo e introducir tu contraseña real en `Password`.

2. **Llave JWT**
   La clave para firmar los tokens debe tener al menos 32 caracteres de longitud. Ya viene configurada una por defecto segura en el archivo.

---

## 🚀 Instrucciones de Instalación y Ejecución

Sigue estos pasos en tu terminal (abre PowerShell en la carpeta del proyecto `ReservasWEB2`):

### 1. Aplicar las Migraciones (Crear la Base de Datos)
Ya se ha generado la migración inicial (`InitialCreate`). Solo debes aplicarla a tu motor PostgreSQL:
```bash
dotnet ef database update
```
*(Si te aparece que 'dotnet-ef' no se reconoce, instala la herramienta primero: `dotnet tool install --global dotnet-ef`)*

### 2. Levantar el Servidor
Dado que es una arquitectura integrada (SPA), el comando `dotnet run` construirá el backend en .NET e internamente llamará a `npm start` para levantar Angular.
```bash
dotnet run
```

Una vez en ejecución, podrás acceder a la aplicación en tu navegador web. (Revisa la consola para ver la URL exacta, típicamente `https://localhost:7198` o similar).

### 3. Swagger (Para el Docente)
Puedes probar directamente los endpoints de la API navegando a `/swagger` en la URL generada.

---

## 👥 Credenciales de Prueba Sugeridas

Como el sistema exige que el **Administrador** sea quien cree las canchas inicialmente, y los **Clientes** quienes reserven, sigue este flujo para tu sustentación:

1. **Crear un Admin**:
   Para crear un Admin rápido, registra un usuario normal desde la pantalla "Registro" y luego actualiza directamente en tu base de datos PostgreSQL su columna `Role` a `"Admin"`.
   ```sql
   UPDATE "Usuarios" SET "Role" = 'Admin' WHERE "Email" = 'admin@admin.com';
   ```

2. **Probar el Cliente**:
   Registra otro usuario desde la interfaz web (por defecto será "Cliente"). Inicia sesión con él y verás que el menú se adapta y le permite hacer reservas.

---

## 📦 Comandos de Git para subir a tu Repositorio

Si deseas subir este proyecto a GitHub/GitLab, ejecuta los siguientes comandos en la terminal desde la carpeta raíz:

```bash
git init
git add .
git commit -m "Entrega Final: Sistema de Reservas de Canchas Sintéticas (.NET 8 + Angular)"
git branch -M main
git remote add origin URL_DE_TU_REPOSITORIO_AQUI
git push -u origin main
```
*(No olvides reemplazar `URL_DE_TU_REPOSITORIO_AQUI` con la URL que te da GitHub al crear un nuevo proyecto vacío)*.
