using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; // Usado para la relación con Foreign Keys.

namespace ReservasWEB2.Models
{
    // Esta clase representa la tabla "Reservas" en la base de datos.
    // Esta es una tabla transaccional: relaciona qué usuario reservó qué cancha y cuándo.
    public class Reserva
    {
        // La llave primaria de la reserva.
        [Key]
        public int Id { get; set; }

        // Aquí guardamos el Id del usuario que hace la reserva.
        // Es obligatorio.
        [Required]
        public int UsuarioId { get; set; }

        // Propiedad de navegación: Entity Framework usa esta propiedad para "traer" 
        // todos los datos del usuario relacionado automáticamente (se le llama "Carga Eager" o Eager Loading).
        // Le indicamos que el "UsuarioId" de arriba es la llave foránea (Foreign Key) de este objeto.
        [ForeignKey("UsuarioId")]
        public Usuario? Usuario { get; set; }

        // Aquí guardamos el Id de la cancha que está siendo reservada.
        [Required]
        public int CanchaId { get; set; }

        // Al igual que con Usuario, esta es la propiedad de navegación hacia la Cancha.
        [ForeignKey("CanchaId")]
        public Cancha? Cancha { get; set; }

        // Fecha y hora exactas en que inicia la reserva.
        // Obligatorio para calcular solapamientos (que dos personas no reserven al mismo tiempo).
        [Required]
        public DateTime FechaInicio { get; set; }

        // Fecha y hora exactas en que termina la reserva.
        [Required]
        public DateTime FechaFin { get; set; }

        // Estado actual de la reserva.
        // Puede ser "Confirmada", "Cancelada", o "Pendiente". 
        // Le asignamos por defecto "Confirmada".
        [Required]
        [MaxLength(50)]
        public string Estado { get; set; } = "Confirmada";
    }
}
