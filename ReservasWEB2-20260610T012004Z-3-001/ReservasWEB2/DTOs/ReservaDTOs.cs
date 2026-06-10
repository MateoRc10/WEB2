using System.ComponentModel.DataAnnotations;

namespace ReservasWEB2.DTOs
{
    // DTO para enviar la información de una reserva a crear.
    // No necesitamos el UsuarioId aquí, ya que por seguridad, lo extraeremos 
    // del token JWT del usuario logueado en el backend.
    public class ReservaCreateDTO
    {
        [Required(ErrorMessage = "Debes seleccionar una cancha")]
        public int CanchaId { get; set; }

        [Required]
        public DateTime FechaInicio { get; set; }

        [Required]
        public DateTime FechaFin { get; set; }
    }

    // DTO para devolver los datos de la reserva con un formato más amigable al Front.
    public class ReservaResponseDTO
    {
        public int Id { get; set; }
        public string CanchaNombre { get; set; } = string.Empty;
        public string UsuarioNombre { get; set; } = string.Empty;
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
        public string Estado { get; set; } = string.Empty;
    }
}
