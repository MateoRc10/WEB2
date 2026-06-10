using System.ComponentModel.DataAnnotations;

namespace ReservasWEB2.DTOs
{
    // DTO para crear o actualizar una Cancha.
    // Omitimos el 'Id' ya que al crear, la base de datos lo genera sola.
    // Al actualizar, pasamos el Id en la URL, no en el cuerpo del mensaje.
    public class CanchaCreateUpdateDTO
    {
        [Required(ErrorMessage = "El nombre de la cancha es requerido")]
        public string Nombre { get; set; } = string.Empty;

        public string Descripcion { get; set; } = string.Empty;

        [Required]
        [Range(1, 1000000, ErrorMessage = "El precio debe ser mayor a 0")]
        public decimal PrecioPorHora { get; set; }
    }
}
