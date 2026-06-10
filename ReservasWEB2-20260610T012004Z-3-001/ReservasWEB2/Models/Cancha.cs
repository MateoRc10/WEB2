using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; // Importamos esto para usar [Column] y definir tipos de datos precisos en la BD.

namespace ReservasWEB2.Models
{
    // Esta clase representa la tabla "Canchas" en nuestra base de datos.
    public class Cancha
    {
        // Llave primaria única e irrepetible para cada cancha.
        [Key]
        public int Id { get; set; }

        // El nombre de la cancha es obligatorio y máximo de 100 caracteres.
        // Ejemplo: "Cancha Principal", "Cancha Futbol 5 - Norte".
        [Required]
        [MaxLength(100)]
        public string Nombre { get; set; } = string.Empty;

        // Una breve descripción de las condiciones de la cancha.
        // [MaxLength(500)] permite guardar textos un poco más largos que el nombre.
        [MaxLength(500)]
        public string Descripcion { get; set; } = string.Empty;

        // Precio por hora de alquiler de la cancha.
        // Usamos [Column(TypeName = "decimal(18,2)")] para decirle a PostgreSQL exactamente 
        // cómo guardar este número: 18 dígitos en total, y 2 decimales.
        // Es una buena práctica usar 'decimal' en lugar de 'float' o 'double' para valores monetarios porque no pierde precisión.
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal PrecioPorHora { get; set; }
    }
}
