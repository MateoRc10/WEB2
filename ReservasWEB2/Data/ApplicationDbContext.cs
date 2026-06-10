using Microsoft.EntityFrameworkCore;
using ReservasWEB2.Models;

namespace ReservasWEB2.Data
{
    // =========================================================
    // ApplicationDbContext.cs — El "puente" entre C# y PostgreSQL
    // =========================================================
    // Esta clase hereda de DbContext (Entity Framework Core).
    // Su trabajo es: conectarse a la BD, traducir objetos C# a filas SQL
    // y ejecutar consultas de forma automática. Es el corazón del ORM.
    public class ApplicationDbContext : DbContext
    {
        // El constructor recibe las "opciones" de configuración (como la cadena de conexión)
        // que vienen desde appsettings.json y las pasa a la clase padre DbContext.
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // =========================================================
        // DbSets = Tablas de la Base de Datos
        // =========================================================
        // Cada propiedad DbSet<T> representa una tabla completa en PostgreSQL.
        // Entity Framework usará estas propiedades para hacer los SELECT, INSERT, UPDATE y DELETE.
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Cancha> Canchas { get; set; }
        public DbSet<Reserva> Reservas { get; set; }

        // =========================================================
        // OnModelCreating — Configuración avanzada del modelo
        // =========================================================
        // Este método se ejecuta UNA SOLA VEZ cuando la app arranca por primera vez.
        // Aquí configuramos reglas especiales que no se pueden poner con atributos simples.
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Siempre llamamos a la versión base primero (buena práctica).
            base.OnModelCreating(modelBuilder);

            // =========================================================
            // REGLA: El Email del usuario debe ser ÚNICO en la BD.
            // Esto evita que dos personas se registren con el mismo correo.
            // EF Core traducirá esto a: CREATE UNIQUE INDEX en la columna Email.
            // =========================================================
            modelBuilder.Entity<Usuario>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // =========================================================
            // SEED DATA — Datos Iniciales Precargados
            // =========================================================
            // HasData() le dice a Entity Framework que estos registros deben
            // existir en la base de datos desde el primer momento (al hacer la migración).
            // Son los datos de prueba que evitan que la app abra completamente vacía.
            //
            // IMPORTANTE: Los IDs deben ser fijos y no cambiar nunca,
            // porque EF Core los usa para saber si ya existen o si los tiene que crear.

            // ---------------------------------------------------------
            // USUARIO ADMINISTRADOR: admin@canchas.com / admin123
            // ---------------------------------------------------------
            // BCrypt.HashPassword("admin123") genera el hash de la contraseña.
            // Este hash fue calculado previamente para incluirlo aquí como texto fijo.
            // BCrypt es un algoritmo de hashing "lento a propósito" que hace casi imposible
            // adivinar la contraseña original aunque alguien robe la base de datos.
            modelBuilder.Entity<Usuario>().HasData(
                new Usuario
                {
                    Id = 1, // ID fijo para que EF Core sepa identificarlo siempre
                    Nombre = "Administrador",
                    Email = "admin@canchas.com",
                    // Este es el hash BCrypt de la contraseña "admin123"
                    // Se verifica con: BCrypt.Verify("admin123", hash) → true
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                    Role = "Admin" // Rol especial con permisos para gestionar canchas
                },
                // ---------------------------------------------------------
                // USUARIO CLIENTE REGULAR: cliente@canchas.com / cliente123
                // ---------------------------------------------------------
                new Usuario
                {
                    Id = 2, // ID fijo diferente al del Admin
                    Nombre = "Carlos Rodríguez",
                    Email = "cliente@canchas.com",
                    // Hash BCrypt de la contraseña "cliente123"
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("cliente123"),
                    Role = "Cliente" // Rol básico: solo puede ver canchas y crear reservas
                }
            );

            // ---------------------------------------------------------
            // CANCHAS DE EJEMPLO — 3 canchas sintéticas reales
            // ---------------------------------------------------------
            // Estas canchas aparecerán en el listado cuando el usuario inicie sesión.
            // Los precios están en COP (pesos colombianos) por hora, valores realistas.
            modelBuilder.Entity<Cancha>().HasData(
                new Cancha
                {
                    Id = 1, // ID fijo para la primera cancha
                    Nombre = "Cancha Fútbol 5 — El Clásico",
                    // Descripción detallada que aparecerá en la tabla
                    Descripcion = "Cancha de césped sintético de última generación con iluminación LED nocturna, camerinos y zona de descanso. Capacidad para 10 jugadores.",
                    // 80.000 pesos por hora — precio realista para fútbol 5 en Colombia
                    PrecioPorHora = 80000.00m // La 'm' al final indica que es de tipo decimal (más preciso que double para dinero)
                },
                new Cancha
                {
                    Id = 2,
                    Nombre = "Cancha Fútbol 7 — La Arena",
                    Descripcion = "Cancha amplia con graderías para espectadores, cesped de alta calidad y sistema de riego automático. Ideal para torneos y partidos semi-profesionales.",
                    // 120.000 pesos por hora — más cara por ser de fútbol 7 y mayor tamaño
                    PrecioPorHora = 120000.00m
                },
                new Cancha
                {
                    Id = 3,
                    Nombre = "Microfútbol Cubierta — El Refugio",
                    Descripcion = "Cancha techada con piso laminado especial para microfútbol. Disponible los 365 días del año sin importar el clima. Vestuarios y baños incluidos.",
                    // 60.000 pesos por hora — la más económica al ser más pequeña y cubierta
                    PrecioPorHora = 60000.00m
                }
            );
        }
    }
}
