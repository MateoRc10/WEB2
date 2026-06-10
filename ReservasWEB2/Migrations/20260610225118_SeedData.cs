using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ReservasWEB2.Migrations
{
    /// <inheritdoc />
    public partial class SeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Canchas",
                columns: new[] { "Id", "Descripcion", "Nombre", "PrecioPorHora" },
                values: new object[,]
                {
                    { 1, "Cancha de césped sintético de última generación con iluminación LED nocturna, camerinos y zona de descanso. Capacidad para 10 jugadores.", "Cancha Fútbol 5 — El Clásico", 80000.00m },
                    { 2, "Cancha amplia con graderías para espectadores, cesped de alta calidad y sistema de riego automático. Ideal para torneos y partidos semi-profesionales.", "Cancha Fútbol 7 — La Arena", 120000.00m },
                    { 3, "Cancha techada con piso laminado especial para microfútbol. Disponible los 365 días del año sin importar el clima. Vestuarios y baños incluidos.", "Microfútbol Cubierta — El Refugio", 60000.00m }
                });

            migrationBuilder.InsertData(
                table: "Usuarios",
                columns: new[] { "Id", "Email", "Nombre", "PasswordHash", "Role" },
                values: new object[,]
                {
                    { 1, "admin@canchas.com", "Administrador", "$2a$11$AfoWYGLWrrWQtqszjX7iy.2fHcpmsFMDnl4n7QfWvmV4KfbKq2thS", "Admin" },
                    { 2, "cliente@canchas.com", "Carlos Rodríguez", "$2a$11$r2yrTOydR/mEzcLe/7u4T.Gw38ESHd3krvTB.wpBxz8Xzb/T.bIfq", "Cliente" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Canchas",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Canchas",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Canchas",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 2);
        }
    }
}
