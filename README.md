#  CanchasPro — Sistema de Reservas de Canchas Sintéticas 

Este proyecto es una aplicación **Full Stack** construida bajo una arquitectura integrada de **ASP.NET Core (con .NET 9.0)** y **Angular**. Está diseñada para gestionar la reserva y alquiler de canchas deportivas sintéticas bajo el patrón arquitectónico **Modelo-Vista-Controlador (MVC)**.

---

##  Características del Sistema

1. **Autenticación y Autorización Segura**: 
   - Registro de usuarios e Inicio de Sesión seguro.
   - Seguridad mediante **JSON Web Tokens (JWT)** para endpoints protegidos.
   - Contraseñas encriptadas con hashing seguro **BCrypt** de costo 11.
2. **Roles de Usuario Diferenciados**:
   - **Administrador**: Gestión completa (CRUD) de las canchas disponibles (crear, editar, eliminar y listar). Visualización global de todas las reservas registradas.
   - **Cliente**: Listado interactivo de canchas con buscador en tiempo real, filtros y paginación desde el servidor. Creación y visualización de sus reservas personales.
3. **Módulo de Reserva Interactivo**:
   - Selector interactivo mediante modal para elegir la **Fecha**, la **Hora de Inicio** y la **Hora de Fin** de la reserva.
   - **Validación en Tiempo Real**: Evita la creación de reservas en el pasado y previene solapamientos o cruces de horarios en una misma cancha.
   - **Cancelación de Reservas**: Soporte para cancelación de turnos mediante *Soft Delete* (se mantiene el registro con estado `'Cancelada'`).

---

##  Requisitos Previos

Asegúrate de contar con lo siguiente instalado en tu equipo:
- [.NET 8.0 SDK o .NET 9.0 SDK](https://dotnet.microsoft.com/download)
- [Node.js (LTS)](https://nodejs.org/) (versión 18 o superior para Angular)
- [PostgreSQL](https://www.postgresql.org/download/) en ejecución local.

---

##  Configuración e Inicialización

Toda la configuración principal del sistema se define en el archivo [appsettings.json](file:///d:/ReservasWEB2-20260610T012004Z-3-001/ReservasWEB2/appsettings.json):

```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Port=5432;Database=ReservasWEB2;Username=postgres;Password=frisby15;Include Error Detail=true"
}
```

> [!NOTE]
> La base de datos por defecto está configurada para el usuario `postgres` y la contraseña `frisby15`. Puedes cambiar la contraseña si tu servidor PostgreSQL local utiliza otra distinta.

---

##  Pasos para Ejecutar el Proyecto

Sigue las siguientes instrucciones desde una terminal (abierta en la carpeta raíz del backend `ReservasWEB2`):

### 1. Recrear y Migrar la Base de Datos
Para generar la base de datos limpia con todas las tablas y los datos semilla precargados, ejecuta:
```bash
# Restaura los paquetes NuGet necesarios
dotnet restore ReservasWEB2.csproj

# Aplica las migraciones de Entity Framework y los datos semilla
dotnet ef database update
```

### 2. Instalar Dependencias del Frontend
Accede a la carpeta de la interfaz de Angular e instala los módulos limpios:
```bash
cd ClientApp
npm install
cd ..
```

### 3. Levantar la Aplicación
Regresa a la raíz de `ReservasWEB2` e inicia el servidor unificado:
```bash
dotnet run
```

Una vez ejecutado, el servidor levantará automáticamente la API de .NET y el servidor de desarrollo de Angular:
* **Aplicación Web (Cliente + Admin)**: **[https://localhost:7107](https://localhost:7107)**
* **Documentación Interactiva (Swagger)**: **[https://localhost:7107/swagger](https://localhost:7107/swagger)**

---

##  Credenciales de Prueba Precargadas

Para facilitar la sustentación y las pruebas, la base de datos se autosemilla automáticamente con los siguientes perfiles de prueba:

| Rol | Correo Electrónico | Contraseña | Acciones Permitidas |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@canchas.com` | `admin123` | CRUD de canchas, ver todas las reservas de todos los clientes. |
| **Cliente** | `cliente@canchas.com` | `cliente123` | Buscar canchas, seleccionar fecha/hora y reservar turnos, cancelar sus propias reservas. |

*También puedes registrar nuevos usuarios en la opción **"Regístrate aquí"** de la pantalla de login (por defecto, cualquier usuario nuevo se registrará con el rol de Cliente).*

Este proyecto fue Diseñado y Creado con Apoyo de la IA, Modelo Gemini 3.5 Flash, en el IDE Antigravity