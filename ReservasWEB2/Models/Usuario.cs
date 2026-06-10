using System.ComponentModel.DataAnnotations;

namespace ReservasWEB2.Models
{
    // Esta clase representa la tabla de "Usuarios" en nuestra base de datos.
    // Usamos el modificador 'public' para que otras partes del sistema puedan acceder a ella.
    public class Usuario
    {
        // El atributo [Key] le indica a Entity Framework que esta propiedad es la Llave Primaria (Primary Key) de la tabla.
        // Es decir, el identificador único de cada usuario.
        [Key]
        public int Id { get; set; }

        // El atributo [Required] significa que este campo no puede estar vacío en la base de datos (es NOT NULL).
        // [MaxLength(100)] limita la cantidad de caracteres que se pueden guardar en la columna Nombre a 100.
        [Required]
        [MaxLength(100)]
        public string Nombre { get; set; } = string.Empty; // Iniciamos con string vacío para evitar errores de valores nulos.

        // Al igual que Nombre, el Email es obligatorio y tiene un tamaño máximo.
        [Required]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        // Aquí guardaremos la contraseña. NUNCA guardamos contraseñas en texto plano.
        // Usaremos BCrypt para encriptarla (convertirla en un "hash" indescifrable) antes de guardarla.
        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        // Este campo define el nivel de acceso del usuario en el sistema.
        // Solo aceptaremos dos valores: "Admin" o "Cliente".
        // Le damos por defecto el valor de "Cliente" para que nadie se registre como Admin por accidente.
        [Required]
        [MaxLength(20)]
        public string Role { get; set; } = "Cliente";
    }
}
