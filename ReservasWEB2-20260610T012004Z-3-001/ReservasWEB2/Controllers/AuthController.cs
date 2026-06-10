using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ReservasWEB2.Data;
using ReservasWEB2.DTOs;
using ReservasWEB2.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ReservasWEB2.Controllers
{
    // [Route("api/[controller]")] le dice a .NET que todas las rutas de este archivo 
    // empezarán con "/api/auth" (toma el nombre "Auth" de "AuthController").
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        // El ApplicationDbContext nos permite consultar la base de datos.
        private readonly ApplicationDbContext _context;
        // IConfiguration nos permite leer datos de nuestro archivo appsettings.json (como la llave secreta).
        private readonly IConfiguration _config;

        // Constructor donde inyectamos las dependencias. 
        // .NET se encarga automáticamente de pasarnos el DbContext y la Configuración.
        public AuthController(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // Endpoint POST: /api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO model)
        {
            // Primero, verificamos si ya existe alguien registrado con el mismo correo.
            // Usamos AnyAsync, que es más rápido que traer todo el usuario.
            if (await _context.Usuarios.AnyAsync(u => u.Email == model.Email))
            {
                return BadRequest(new { mensaje = "El email ya está registrado." });
            }

            // Aquí sucede la magia de seguridad: Encriptamos la contraseña con BCrypt.
            // Así, si alguien roba la base de datos, no podrá saber las contraseñas.
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(model.Password);

            // Creamos un nuevo objeto Usuario usando nuestro modelo de dominio.
            var nuevoUsuario = new Usuario
            {
                Nombre = model.Nombre,
                Email = model.Email,
                PasswordHash = passwordHash,
                Role = "Cliente" // Todos son clientes por defecto al registrarse.
            };

            // Agregamos el usuario a la "memoria" de Entity Framework y luego guardamos en la BD real.
            _context.Usuarios.Add(nuevoUsuario);
            await _context.SaveChangesAsync();

            // Retornamos un estado 200 OK informando del éxito.
            return Ok(new { mensaje = "Usuario registrado exitosamente." });
        }

        // Endpoint POST: /api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO model)
        {
            // Buscamos al usuario en la BD usando su email.
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == model.Email);

            // Si el usuario no existe, o si la contraseña ingresada NO coincide con el Hash guardado (Verify evalúa esto),
            // le devolvemos un error de "Credenciales inválidas".
            if (usuario == null || !BCrypt.Net.BCrypt.Verify(model.Password, usuario.PasswordHash))
            {
                return Unauthorized(new { mensaje = "Credenciales inválidas." });
            }

            // Si todo está correcto, procedemos a generar su "Token JWT".
            // El token es como un carnet de identificación virtual.

            // 1. Preparamos las "afirmaciones" (Claims) que irán dentro del token.
            // Estas claims identifican a quién pertenece el token.
            var claims = new[]
            {
                // 'sub' es el estándar para referirse al "subject" (el ID del usuario en nuestro caso).
                new Claim(JwtRegisteredClaimNames.Sub, usuario.Id.ToString()),
                // El email del usuario.
                new Claim(JwtRegisteredClaimNames.Email, usuario.Email),
                // Su rol ("Admin" o "Cliente"). Esto es clave para proteger nuestras rutas más adelante.
                new Claim(ClaimTypes.Role, usuario.Role)
            };

            // 2. Extraemos nuestra llave súper secreta desde appsettings.json
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            // Creamos una firma usando nuestra llave y el algoritmo HmacSha256.
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // 3. Ensamblamos el Token completo.
            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(60), // Le damos un tiempo de expiración exacto de 60 minutos como se pidió.
                signingCredentials: creds
            );

            // 4. "Imprimimos" el token y se lo devolvemos al frontend.
            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                role = usuario.Role,
                nombre = usuario.Nombre
            });
        }
    }
}
