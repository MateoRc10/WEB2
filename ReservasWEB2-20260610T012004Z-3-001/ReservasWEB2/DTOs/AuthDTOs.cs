using System.ComponentModel.DataAnnotations;

namespace ReservasWEB2.DTOs
{
    // DTO significa "Data Transfer Object". Son clases simples que usamos para 
    // recibir datos del cliente o enviarlos, sin exponer directamente nuestros modelos de base de datos.
    // Esto previene que los usuarios modifiquen campos que no deberían (como el Rol o el Id) por accidente.

    // DTO usado cuando el usuario se quiere registrar.
    public class RegisterDTO
    {
        [Required(ErrorMessage = "El nombre es obligatorio")]
        public string Nombre { get; set; } = string.Empty;

        [Required(ErrorMessage = "El email es obligatorio")]
        [EmailAddress(ErrorMessage = "Formato de correo inválido")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "La contraseña es obligatoria")]
        [MinLength(6, ErrorMessage = "La contraseña debe tener al menos 6 caracteres")]
        public string Password { get; set; } = string.Empty;
    }

    // DTO usado cuando el usuario intenta iniciar sesión (Login).
    public class LoginDTO
    {
        [Required(ErrorMessage = "El email es obligatorio")]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "La contraseña es obligatoria")]
        public string Password { get; set; } = string.Empty;
    }
}
