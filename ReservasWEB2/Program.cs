using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

using ReservasWEB2.Data;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ==========================================
// 1. CONFIGURACIÓN DE BASE DE DATOS (Entity Framework)
// ==========================================
// Le decimos a nuestra app que use PostgreSQL y que tome la cadena de conexión de appsettings.json
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ==========================================
// 2. CONFIGURACIÓN DE AUTENTICACIÓN (JWT)
// ==========================================
// Leemos la clave secreta
var jwtKey = builder.Configuration["Jwt:Key"];
var keyBytes = Encoding.UTF8.GetBytes(jwtKey!);

// Configuramos el esquema de autenticación por defecto como "Bearer" (JWT)
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        // Reglas para validar el token que nos envíen
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true, // Validar quién emite el token
            ValidateAudience = true, // Validar para quién es el token
            ValidateLifetime = true, // Validar que no esté expirado
            ValidateIssuerSigningKey = true, // Validar que la firma sea auténtica

            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(keyBytes)
        };
    });

builder.Services.AddAuthorization(); // Habilitamos la autorización basada en roles.

// ==========================================
// 3. CONFIGURACIÓN DE CONTROLADORES Y SWAGGER
// ==========================================
builder.Services.AddControllersWithViews(); // AddControllersWithViews es necesario si integramos Angular después

// Swagger es una herramienta visual para probar nuestra API.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ==========================================
// 4. CONFIGURACIÓN DEL PIPELINE HTTP (Middleware)
// ==========================================
// Middleware: Es el camino que recorre cada petición HTTP.

// Solo activamos Swagger si estamos en modo desarrollo
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles(); // Para servir los archivos de Angular
app.UseRouting();

// ¡EL ORDEN AQUÍ ES CRÍTICO! Primero preguntamos ¿Quién eres? (Autenticación)
app.UseAuthentication();
// Y luego preguntamos ¿Tienes permiso para entrar aquí? (Autorización)
app.UseAuthorization();

// Mapeamos las rutas a nuestros Controladores
app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

// Si ninguna ruta del backend coincide, mandamos la petición al Frontend (Angular)
app.MapFallbackToFile("index.html");

app.Run();
